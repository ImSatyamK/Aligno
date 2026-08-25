'use client'

import { useState } from "react";
import Link from "next/link";
import { timeAgo } from '@/lib/timeAgo';
import { Book, Clock, Timer, ChevronDown, Check, X } from 'lucide-react';

interface AttemptQuestion {
    question: string;
    options: string[];
    correctOption: number;
}

interface Attempt {
    _id: string;
    test: string;
    answers: Record<string, number>;
    questions: AttemptQuestion[];
    correctMarks: number;
    negativeMarks: number;
    score: number;
    startedAt: string;
    endsAt: string;
    submittedAt?: string;
    status: "IN_PROGRESS" | "SUBMITTED";
}

function formatDuration(ms: number): string {
    const totalSeconds = Math.round(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    if (minutes === 0) return `${seconds}s`;
    return `${minutes}m ${seconds}s`;
}

export function AttemptCard({ attempt }: { attempt: Attempt }) {
    const [expanded, setExpanded] = useState(false);
    const isSubmitted = attempt.status === "SUBMITTED";

    const totalQuestions = attempt.questions?.length ?? 0;
    const answeredCount = Object.keys(attempt.answers ?? {}).length;
    const unansweredCount = totalQuestions - answeredCount;

    const correctCount = attempt.questions?.filter(
        (q, i) => attempt.answers?.[String(i)] === q.correctOption
    ).length ?? 0;
    const accuracy = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;

    const allottedMs =
        new Date(attempt.endsAt).getTime() - new Date(attempt.startedAt).getTime();
    const takenMs =
        isSubmitted && attempt.submittedAt
            ? new Date(attempt.submittedAt).getTime() - new Date(attempt.startedAt).getTime()
            : null;

    return (
        <div className="w-full max-w-xl mx-auto rounded-lg border border-foreground/10 bg-foreground/[0.02] p-4 shadow-sm">
            <div className="flex items-start justify-between gap-3">
                <div>
                    <span
                        className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                            isSubmitted
                                ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                                : "bg-[#C08A2E]/10 text-[#C08A2E]"
                        }`}
                    >
                        {isSubmitted ? "Submitted" : "In progress"}
                    </span>

                    <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1.5">
                            <Clock className="h-3.5 w-3.5" />
                            Started {timeAgo(attempt.startedAt)}
                        </span>
                        <span className="flex items-center gap-1.5">
                            <Timer className="h-3.5 w-3.5" />
                            Duration: {formatDuration(allottedMs)}
                        </span>
                        {takenMs !== null && (
                            <span className="flex items-center gap-1.5">
                                <Timer className="h-3.5 w-3.5" />
                                Time taken: {formatDuration(takenMs)}
                            </span>
                        )}
                    </div>
                </div>

                {!isSubmitted && (
                    <Link
                        href={`/test/attempt/${attempt._id}`}
                        className="shrink-0 rounded-md bg-[#C08A2E] px-3 py-1.5 text-sm font-semibold text-white hover:opacity-90 transition"
                    >
                        Continue
                    </Link>
                )}
            </div>

            {isSubmitted && (
                <>
                    <div className="mt-3 flex flex-wrap items-center gap-x-6 gap-y-2 rounded-md border border-foreground/10 bg-background px-3 py-2 text-sm">
                        <div className="flex items-center gap-1.5 text-foreground">
                            <Book className="h-4 w-4 text-muted-foreground" />
                            Score: <span className="font-semibold">{attempt.score}</span>
                        </div>
                        <div className="text-foreground">
                            Accuracy: <span className="font-semibold">{accuracy}%</span>
                        </div>
                        <div className="text-emerald-600 dark:text-emerald-400">
                            {correctCount} correct
                        </div>
                        <div className="text-red-500">
                            {answeredCount - correctCount} wrong
                        </div>
                        {unansweredCount > 0 && (
                            <div className="text-muted-foreground">
                                {unansweredCount} skipped
                            </div>
                        )}
                    </div>

                    {attempt.questions && (
                        <button
                            onClick={() => setExpanded((v) => !v)}
                            className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-md border border-input bg-background py-1.5 text-sm font-medium text-foreground/70 hover:text-foreground hover:bg-foreground/5 transition-colors"
                        >
                            Review
                            <ChevronDown className={`h-4 w-4 transition-transform ${expanded ? "rotate-180" : ""}`} />
                        </button>
                    )}

                    {expanded && (
                        <div className="mt-3 space-y-3">
                            {attempt.questions.map((q, qIndex) => {
                                const selected = attempt.answers?.[String(qIndex)];
                                const hasAnswer = selected !== undefined;

                                return (
                                    <div
                                        key={qIndex}
                                        className="rounded-md border border-foreground/10 bg-background p-3"
                                    >
                                        <p className="text-sm font-medium text-foreground break-words [overflow-wrap:anywhere]">
                                            {qIndex + 1}. {q.question}
                                        </p>

                                        <div className="mt-2 space-y-1.5">
                                            {q.options.map((option, oIndex) => {
                                                const isCorrect = oIndex === q.correctOption;
                                                const isSelected = oIndex === selected;

                                                let stateClasses = "border-foreground/10";
                                                if (isCorrect) {
                                                    stateClasses = "border-emerald-500 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400";
                                                } else if (isSelected && !isCorrect) {
                                                    stateClasses = "border-red-500 bg-red-500/10 text-red-600";
                                                }

                                                return (
                                                    <div
                                                        key={oIndex}
                                                        className={`flex items-center justify-between gap-2 rounded-md border px-2.5 py-1.5 text-sm ${stateClasses}`}
                                                    >
                                                        <span className="min-w-0 break-words [overflow-wrap:anywhere]">
                                                            {option}
                                                        </span>
                                                        {isCorrect && <Check className="h-3.5 w-3.5 shrink-0 text-emerald-600" />}
                                                        {isSelected && !isCorrect && <X className="h-3.5 w-3.5 shrink-0 text-red-500" />}
                                                    </div>
                                                );
                                            })}
                                        </div>

                                        {!hasAnswer && (
                                            <p className="mt-1.5 text-xs text-red-800">Not answered.</p>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </>
            )}
        </div>
    );
}