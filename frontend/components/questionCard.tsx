'use client';

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { saveAnswer, clearAnswer, submitAttempt } from "@/api/attempt";
import { toast } from "./ui/toast";
import { Flag, ChevronLeft, ChevronRight, X, Menu } from "lucide-react";

interface IAttempt {
    _id: string;
    user: string;
    test: string;
    questions?: { question: string; options: string[] }[];
    answers: Map<string, number>;
    correctMarks?: number;
    negativeMarks?: number;
    currentQuestion: number;
    score: number;
    startedAt: Date;
    endsAt: Date;
    submittedAt?: Date;
    status: "IN_PROGRESS" | "SUBMITTED";
    createdAt: Date;
    updatedAt: Date;
}

type Status = "not-visited" | "not-answered" | "answered" | "marked" | "answered-marked";

function formatTime(ms: number): string {
    if (ms <= 0) return "00:00:00";
    const totalSeconds = Math.floor(ms / 1000);
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;
    return [h, m, s].map((v) => String(v).padStart(2, "0")).join(":");
}

export function QuestionCard({ attempt, testId }: { attempt: IAttempt; testId: string }) {
    const router = useRouter();
    const questions = attempt.questions ?? [];
    const total = questions.length;

    const [currentQuestion, setCurrentQuestion] = useState(attempt.currentQuestion ?? 0);
    const [answers, setAnswers] = useState<Record<number, number>>(() => {
        const initial: Record<number, number> = {};
        if (attempt.answers) {
            Object.entries(attempt.answers as any).forEach(([k, v]) => {
                initial[Number(k)] = v as number;
            });
        }
        return initial;
    });
    const [visited, setVisited] = useState<Set<number>>(new Set([attempt.currentQuestion ?? 0]));
    const [marked, setMarked] = useState<Set<number>>(new Set());
    const [saving, setSaving] = useState(false);
    const [paletteOpen, setPaletteOpen] = useState(false);
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    const [timeLeft, setTimeLeft] = useState(() => new Date(attempt.endsAt).getTime() - Date.now());

    const handleSubmit = useCallback(async () => {
        setSubmitting(true);
        const result = await submitAttempt(attempt._id, testId);
        if (result.success) {
            toast.add({ title: "Test submitted", type: "success" });
            router.push("/test");
        } else {
            console.log("Submit attempt failed:", result.error);
            console.log("Attempt id:", attempt._id);
            toast.add({
                title: "Couldn't submit",
                description: typeof result.error === "string" ? result.error : "Please try again.",
                type: "error",
            });
            setSubmitting(false);
        }
    }, [attempt._id, router]);

    useEffect(() => {
        const interval = setInterval(() => {
            const remaining = new Date(attempt.endsAt).getTime() - Date.now();
            setTimeLeft(remaining);
            if (remaining <= 0) {
                clearInterval(interval);
                handleSubmit();
            }
        }, 1000);
        return () => clearInterval(interval);
    }, [attempt.endsAt, handleSubmit]);

    if (total === 0) {
        return (
            <div className="max-w-md mx-auto mt-10 rounded-md border border-foreground/10 p-6 text-center text-muted-foreground">
                No questions available for this attempt.
            </div>
        );
    }

    const question = questions[currentQuestion];
    const selected = answers[currentQuestion];

    const getStatus = (index: number): Status => {
        const isAnswered = answers[index] !== undefined;
        const isMarked = marked.has(index);
        if (isMarked && isAnswered) return "answered-marked";
        if (isMarked) return "marked";
        if (isAnswered) return "answered";
        if (visited.has(index)) return "not-answered";
        return "not-visited";
    };

    const statusStyles: Record<Status, string> = {
        "not-visited": "bg-foreground/10 text-foreground/60",
        "not-answered": "bg-red-500 text-white",
        "answered": "bg-emerald-500 text-white",
        "marked": "bg-purple-500 text-white",
        "answered-marked": "bg-purple-500 text-white ring-2 ring-emerald-400",
    };

    const goTo = (index: number) => {
        setVisited((prev) => new Set(prev).add(index));
        setCurrentQuestion(index);
        setPaletteOpen(false);
    };

    const selectOption = (optionIndex: number) => {
        setAnswers((prev) => ({ ...prev, [currentQuestion]: optionIndex }));
    };

    const saveAndNext = async (markCurrent = false) => {
        setSaving(true);
        try {
            const nextIndex = Math.min(currentQuestion + 1, total - 1);
            const answerToSave = selected !== undefined ? selected : -1;

            const result = await saveAnswer(attempt._id, currentQuestion, answerToSave, nextIndex);
            if (!result.success) {
                toast.add({ title: "Couldn't save answer", type: "error" });
                return;
            }

            if (markCurrent) {
                setMarked((prev) => new Set(prev).add(currentQuestion));
            }
            if (currentQuestion < total - 1) {
                goTo(currentQuestion + 1);
            }
        } finally {
            setSaving(false);
        }
    };

    const clearResponse = async () => {
        setSaving(true);
        try {
            const result = await clearAnswer(attempt._id, currentQuestion);
            if (result.success) {
                setAnswers((prev) => {
                    const next = { ...prev };
                    delete next[currentQuestion];
                    return next;
                });
            } else {
                toast.add({ title: "Couldn't clear answer", type: "error" });
            }
        } finally {
            setSaving(false);
        }
    };

    const answeredCount = Object.keys(answers).length;
    const markedCount = marked.size;
    const notVisitedCount = total - visited.size;
    const notAnsweredCount = total - answeredCount - notVisitedCount;

    const isLowTime = timeLeft < 5 * 60 * 1000;

    return (
        <div className="min-h-dvh flex flex-col">
            {/* Top bar */}
            <div className="sticky top-0 z-30 flex items-center justify-between border-b border-foreground/10 bg-background px-4 py-3">
                <span className="text-sm font-medium text-foreground">
                    Question {currentQuestion + 1} of {total}
                </span>
                <div className="flex items-center gap-3">
                    <span
                        className={`rounded-md px-3 py-1 text-sm font-mono font-semibold ${
                            isLowTime ? "bg-red-500/10 text-red-500" : "bg-foreground/5 text-foreground"
                        }`}
                    >
                        {formatTime(timeLeft)}
                    </span>
                    <button
                        onClick={() => setPaletteOpen(true)}
                        aria-label="Question palette"
                        className="lg:hidden flex h-9 w-9 items-center justify-center rounded-md text-foreground/70 hover:bg-foreground/5 transition-colors"
                    >
                        <Menu className="h-5 w-5" />
                    </button>
                </div>
            </div>

            <div className="flex flex-1">
                {/* Question panel */}
                <div className="flex-1 flex flex-col px-4 py-6 max-w-2xl mx-auto w-full">
                    <div className="flex items-center justify-between">
                        <span className="rounded-md bg-foreground/5 px-2.5 py-1 text-xs font-semibold text-foreground/70">
                            Q{currentQuestion + 1}
                        </span>
                        {marked.has(currentQuestion) && (
                            <span className="flex items-center gap-1 text-xs font-medium text-purple-500">
                                <Flag className="h-3 w-3 fill-purple-500" />
                                Marked for review
                            </span>
                        )}
                    </div>

                    <p className="mt-3 text-[16px] leading-relaxed text-foreground whitespace-pre-wrap break-words [overflow-wrap:anywhere]">
                        {question.question}
                    </p>

                    <div className="mt-5 space-y-2.5">
                        {question.options.map((option, oIndex) => (
                            <label
                                key={oIndex}
                                className={`flex items-center gap-3 rounded-md border p-3 text-sm cursor-pointer transition-colors ${
                                    selected === oIndex
                                        ? "border-[#C08A2E] bg-[#C08A2E]/5"
                                        : "border-input hover:bg-foreground/5"
                                }`}
                            >
                                <input
                                    type="radio"
                                    name="option"
                                    checked={selected === oIndex}
                                    onChange={() => selectOption(oIndex)}
                                    className="h-4 w-4 accent-[#C08A2E] shrink-0"
                                />
                                <span className="min-w-0 break-words [overflow-wrap:anywhere] text-foreground">
                                    {option}
                                </span>
                            </label>
                        ))}
                    </div>

                    {/* Navigation controls */}
                    <div className="mt-auto pt-8 space-y-3">
                        <div className="flex flex-wrap gap-2">
                            <button
                                onClick={() => saveAndNext(false)}
                                disabled={saving}
                                className="flex-1 min-w-[140px] rounded-md bg-[#C08A2E] py-2.5 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-50 transition"
                            >
                                Save & Next
                            </button>
                            <button
                                onClick={() => saveAndNext(true)}
                                disabled={saving}
                                className="flex-1 min-w-[140px] rounded-md bg-purple-500 py-2.5 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-50 transition"
                            >
                                Mark & Next
                            </button>
                            <button
                                onClick={clearResponse}
                                disabled={saving || selected === undefined}
                                className="flex-1 min-w-[140px] rounded-md border border-input py-2.5 text-sm font-medium text-foreground/70 hover:bg-foreground/5 disabled:opacity-50 transition"
                            >
                                Clear Response
                            </button>
                        </div>

                        <div className="flex items-center justify-between gap-2">
                            <button
                                onClick={() => goTo(Math.max(currentQuestion - 1, 0))}
                                disabled={currentQuestion === 0}
                                className="flex items-center gap-1 rounded-md border border-input px-3 py-2 text-sm font-medium text-foreground/70 hover:bg-foreground/5 disabled:opacity-40 transition"
                            >
                                <ChevronLeft className="h-4 w-4" />
                                Previous
                            </button>

                            <button
                                onClick={() => setConfirmOpen(true)}
                                className="rounded-md bg-foreground text-background px-5 py-2 text-sm font-semibold hover:opacity-90 transition"
                            >
                                Submit Test
                            </button>

                            <button
                                onClick={() => goTo(Math.min(currentQuestion + 1, total - 1))}
                                disabled={currentQuestion === total - 1}
                                className="flex items-center gap-1 rounded-md border border-input px-3 py-2 text-sm font-medium text-foreground/70 hover:bg-foreground/5 disabled:opacity-40 transition"
                            >
                                Next
                                <ChevronRight className="h-4 w-4" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Palette — sidebar on desktop, drawer on mobile */}
                {paletteOpen && (
                    <div className="fixed inset-0 z-40 bg-black/40 lg:hidden" onClick={() => setPaletteOpen(false)} />
                )}
                <div
                    className={`fixed lg:static inset-y-0 right-0 z-50 w-72 shrink-0 border-l border-foreground/10 bg-background p-4 overflow-y-auto transition-transform duration-200
                        ${paletteOpen ? "translate-x-0" : "translate-x-full"} lg:translate-x-0`}
                >
                    <div className="flex items-center justify-between lg:hidden">
                        <span className="text-sm font-semibold text-foreground">Question Palette</span>
                        <button onClick={() => setPaletteOpen(false)} aria-label="Close">
                            <X className="h-5 w-5 text-foreground/70" />
                        </button>
                    </div>

                    <div className="mt-3 space-y-1.5 text-xs">
                        <div className="flex items-center gap-2">
                            <span className="h-3 w-3 rounded-sm bg-emerald-500 shrink-0" />
                            <span className="text-foreground/70">Answered ({answeredCount})</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="h-3 w-3 rounded-sm bg-red-500 shrink-0" />
                            <span className="text-foreground/70">Not answered ({notAnsweredCount})</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="h-3 w-3 rounded-sm bg-foreground/10 shrink-0" />
                            <span className="text-foreground/70">Not visited ({notVisitedCount})</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="h-3 w-3 rounded-sm bg-purple-500 shrink-0" />
                            <span className="text-foreground/70">Marked for review ({markedCount})</span>
                        </div>
                    </div>

                    <div className="mt-4 grid grid-cols-5 gap-2">
                        {questions.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => goTo(index)}
                                className={`h-9 w-9 rounded-md text-xs font-semibold transition-colors ${
                                    statusStyles[getStatus(index)]
                                } ${index === currentQuestion ? "ring-2 ring-[#C08A2E] ring-offset-2 ring-offset-background" : ""}`}
                            >
                                {index + 1}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Submit confirmation */}
            {confirmOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
                    <div className="w-full max-w-sm rounded-md border border-foreground/10 bg-background p-5">
                        <h3 className="text-base font-semibold text-foreground">Submit test?</h3>
                        <p className="mt-1 text-sm text-muted-foreground">
                            You won't be able to change your answers after submitting.
                        </p>

                        <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
                            <div className="rounded-md bg-emerald-500/10 px-3 py-2 text-emerald-600 dark:text-emerald-400">
                                Answered: {answeredCount}
                            </div>
                            <div className="rounded-md bg-red-500/10 px-3 py-2 text-red-500">
                                Not answered: {notAnsweredCount}
                            </div>
                            <div className="rounded-md bg-purple-500/10 px-3 py-2 text-purple-500">
                                Marked: {markedCount}
                            </div>
                            <div className="rounded-md bg-foreground/5 px-3 py-2 text-foreground/70">
                                Not visited: {notVisitedCount}
                            </div>
                        </div>

                        <div className="mt-5 flex gap-2">
                            <button
                                onClick={() => setConfirmOpen(false)}
                                className="flex-1 rounded-md border border-input py-2 text-sm font-medium text-foreground/70 hover:bg-foreground/5 transition"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSubmit}
                                disabled={submitting}
                                className="flex-1 rounded-md bg-[#C08A2E] py-2 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-50 transition"
                            >
                                {submitting ? "Submitting..." : "Confirm Submit"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}