'use client'

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { createTest } from "@/api/test";
import { toast } from "./ui/toast";
import { Plus, Trash2, Upload, Copy, Check as CheckIcon } from "lucide-react";
import Link from "next/link";

interface QuestionDraft {
    question: string;
    options: string[];
    correctOption: number;
}

function emptyQuestion(): QuestionDraft {
    return { question: "", options: ["", ""], correctOption: 0 };
}

const JSON_EXAMPLE = `[
  {
    "question": "What does HTML stand for?",
    "options": ["Hyper Trainer Markup Language", "Hyper Text Markup Language", "Hyper Text Marketing Language"],
    "correctOption": 1
  }
]`;

const AI_PROMPT = `Create [no of questions] multiple-choice questions about [TOPIC]/ from [resource]. Respond with ONLY a JSON array in this exact format, no other text:

[
  {
    "question": "string",
    "options": ["string", "string", "string", "string"],
    "correctOption": 0
  }
]

"correctOption" is the index (starting at 0) of the correct answer in "options".`;

function isValidQuestionArray(data: unknown): data is QuestionDraft[] {
    if (!Array.isArray(data)) return false;
    return data.every(
        (q) =>
            typeof q === "object" &&
            q !== null &&
            typeof (q as any).question === "string" &&
            Array.isArray((q as any).options) &&
            (q as any).options.every((o: unknown) => typeof o === "string") &&
            typeof (q as any).correctOption === "number"
    );
}

export function CreateTestForm() {
    const router = useRouter();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [mode, setMode] = useState<"guided" | "json">("guided");

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [duration, setDuration] = useState(30);
    const [correctMarks, setCorrectMarks] = useState(1);
    const [negativeMarks, setNegativeMarks] = useState(0);
    const [questions, setQuestions] = useState<QuestionDraft[]>([emptyQuestion()]);
    const [jsonText, setJsonText] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [promptCopied, setPromptCopied] = useState(false);

    const updateQuestion = (index: number, patch: Partial<QuestionDraft>) => {
        setQuestions((prev) => prev.map((q, i) => (i === index ? { ...q, ...patch } : q)));
    };

    const updateOption = (qIndex: number, oIndex: number, value: string) => {
        setQuestions((prev) =>
            prev.map((q, i) =>
                i === qIndex ? { ...q, options: q.options.map((o, j) => (j === oIndex ? value : o)) } : q
            )
        );
    };

    const addOption = (qIndex: number) => {
        setQuestions((prev) => prev.map((q, i) => (i === qIndex ? { ...q, options: [...q.options, ""] } : q)));
    };

    const removeOption = (qIndex: number, oIndex: number) => {
        setQuestions((prev) =>
            prev.map((q, i) => {
                if (i !== qIndex) return q;
                const options = q.options.filter((_, j) => j !== oIndex);
                const correctOption = q.correctOption >= options.length ? 0 : q.correctOption;
                return { ...q, options, correctOption };
            })
        );
    };

    const addQuestion = () => setQuestions((prev) => [...prev, emptyQuestion()]);
    const removeQuestion = (index: number) => setQuestions((prev) => prev.filter((_, i) => i !== index));

    const parseJsonIntoQuestions = (raw: string) => {
        try {
            const parsed = JSON.parse(raw);
            if (!isValidQuestionArray(parsed)) {
                toast.add({
                    title: "Invalid format",
                    description: "Check that each question has 'question', 'options', and 'correctOption'.",
                    type: "error",
                });
                return;
            }
            setQuestions(parsed);
            toast.add({ title: `Loaded ${parsed.length} question(s)`, type: "success" });
        } catch {
            toast.add({ title: "Invalid JSON", description: "Couldn't parse that as JSON.", type: "error" });
        }
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const text = await file.text();
        setJsonText(text);
        parseJsonIntoQuestions(text);
        e.target.value = "";
    };

    const copyPrompt = async () => {
        await navigator.clipboard.writeText(AI_PROMPT);
        setPromptCopied(true);
        toast.add({ title: "Prompt copied", type: "success" });
        setTimeout(() => setPromptCopied(false), 2000);
    };

    const validate = (): string | null => {
        if (!title.trim()) return "Give the test a title.";
        if (duration <= 0) return "Duration must be greater than 0.";
        if (questions.length === 0) return "Add at least one question.";

        for (const [i, q] of questions.entries()) {
            if (!q.question.trim()) return `Question ${i + 1} is missing text.`;
            if (q.options.length < 2) return `Question ${i + 1} needs at least 2 options.`;
            if (q.options.some((o) => !o.trim())) return `Question ${i + 1} has an empty option.`;
            if (q.correctOption < 0 || q.correctOption >= q.options.length) {
                return `Question ${i + 1} is missing a marked correct answer.`;
            }
        }
        return null;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const validationError = validate();
        if (validationError) {
            toast.add({ title: "Fix the form", description: validationError, type: "error" });
            return;
        }

        setSubmitting(true);
        const result = await createTest({
            title: title.trim(),
            description: description.trim() || undefined,
            duration,
            questions,
            correctMarks,
            negativeMarks,
        });

        if (result.success) {
            toast.add({ title: "Test created", type: "success" });
            router.push("/test");
        } else {
            toast.add({
                title: "Error",
                description: typeof result.error === "string" ? result.error : "Failed to create test",
                type: "error",
            });
        }
        setSubmitting(false);
    };

    return (
        <form onSubmit={handleSubmit} className="max-w-2xl mx-auto px-4 py-8 space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-semibold text-foreground">Create a test</h1>
                    <p className="mt-1 text-sm text-muted-foreground">Set up questions, options, and scoring.</p>
                </div>
                <Link href={'/test'}>
                    <button className="mb-4 inline-flex items-center justify-center rounded-md bg-[#C08A2E] text-white hover:bg-[#A16D1A] focus:outline-none focus:ring-2 focus:ring-[#C08A2E] focus:ring-offset-2 px-4 py-2 text-sm font-medium transition">
                        ← Back
                    </button>
                </Link>
            </div>

            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">Title</label>
                    <input
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="e.g. JavaScript Fundamentals"
                        className="w-full rounded-md border border-input bg-background text-foreground px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-[#C08A2E]"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">
                        Description <span className="text-muted-foreground font-normal">(optional)</span>
                    </label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        rows={2}
                        placeholder="What does this test cover?"
                        className="w-full resize-none rounded-md border border-input bg-background text-foreground px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-[#C08A2E]"
                    />
                </div>

                <div className="grid grid-cols-3 gap-3">
                    <div>
                        <label className="block text-sm font-medium text-foreground mb-1.5">Duration (min)</label>
                        <input
                            type="number"
                            min={1}
                            value={duration}
                            onChange={(e) => setDuration(Number(e.target.value))}
                            className="w-full rounded-md border border-input bg-background text-foreground px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#C08A2E]"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-foreground mb-1.5">Correct marks</label>
                        <input
                            type="number"
                            value={correctMarks}
                            onChange={(e) => setCorrectMarks(Number(e.target.value))}
                            className="w-full rounded-md border border-input bg-background text-foreground px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#C08A2E]"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-foreground mb-1.5">Negative marks</label>
                        <input
                            type="number"
                            value={negativeMarks}
                            onChange={(e) => setNegativeMarks(Number(e.target.value))}
                            className="w-full rounded-md border border-input bg-background text-foreground px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#C08A2E]"
                        />
                    </div>
                </div>
            </div>

            {/* Mode switch */}
            <div className="flex border border-input rounded-md w-fit overflow-hidden">
                <button
                    type="button"
                    onClick={() => setMode("guided")}
                    className={`px-4 py-1.5 text-sm font-medium transition-colors ${mode === "guided" ? "bg-[#C08A2E] text-white" : "text-foreground/70 hover:bg-foreground/5"
                        }`}
                >
                    Guided
                </button>
                <button
                    type="button"
                    onClick={() => setMode("json")}
                    className={`px-4 py-1.5 text-sm font-medium border-l border-input transition-colors ${mode === "json" ? "bg-[#C08A2E] text-white" : "text-foreground/70 hover:bg-foreground/5"
                        }`}
                >
                    JSON
                </button>
            </div>

            {mode === "json" ? (
                <div className="space-y-4">
                    <div>
                        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                            Generate with AI
                        </h2>
                        <p className="mt-1 text-sm text-muted-foreground">
                            Copy this prompt, paste it into any AI chat (replace the topic), and paste the JSON it gives you below.
                        </p>
                        <div className="mt-2 rounded-md border border-foreground/10 bg-foreground/5 p-3">
                            <pre className="whitespace-pre-wrap break-words text-xs text-foreground font-mono">{AI_PROMPT}</pre>
                            <button
                                type="button"
                                onClick={copyPrompt}
                                className="mt-2 flex items-center gap-1.5 text-sm font-medium text-[#C08A2E] hover:opacity-80 transition-opacity"
                            >
                                {promptCopied ? <CheckIcon className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                                {promptCopied ? "Copied" : "Copy prompt"}
                            </button>
                        </div>
                    </div>

                    <div>
                        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                            Questions (JSON)
                        </h2>
                        <p className="mt-1 text-sm text-muted-foreground">
                            Paste the JSON array below and click "Load JSON", or upload a <code className="text-foreground">.json</code> file.
                        </p>

                        <textarea
                            value={jsonText}
                            onChange={(e) => setJsonText(e.target.value)}
                            rows={10}
                            placeholder={JSON_EXAMPLE}
                            className="mt-2 w-full font-mono text-xs resize-none rounded-md border border-input bg-background text-foreground px-3 py-2 placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-[#C08A2E]"
                        />

                        <div className="mt-2 flex items-center gap-3">
                            <button
                                type="button"
                                onClick={() => parseJsonIntoQuestions(jsonText)}
                                className="rounded-md bg-[#C08A2E] px-4 py-2 text-sm font-semibold text-white hover:opacity-90 transition"
                            >
                                Load JSON
                            </button>

                            <label className="flex items-center gap-1.5 text-sm font-medium text-[#C08A2E] cursor-pointer hover:opacity-80 transition-opacity">
                                <Upload className="h-3.5 w-3.5" />
                                Upload .json file
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="application/json"
                                    onChange={handleFileUpload}
                                    className="hidden"
                                />
                            </label>
                        </div>

                        {questions.length > 0 && questions[0].question && (
                            <p className="mt-2 text-sm text-muted-foreground">
                                {questions.length} question(s) loaded — switch to "Guided" to review or edit before submitting.
                            </p>
                        )}
                    </div>
                </div>
            ) : (
                <div className="space-y-5">
                    <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Questions</h2>

                    {questions.map((q, qIndex) => (
                        <div key={qIndex} className="rounded-md border border-foreground/10 p-4 space-y-3">
                            <div className="flex items-start justify-between gap-3">
                                <label className="flex-1 text-sm font-medium text-foreground">
                                    Question {qIndex + 1}
                                </label>
                                {questions.length > 1 && (
                                    <button
                                        type="button"
                                        onClick={() => removeQuestion(qIndex)}
                                        aria-label="Remove question"
                                        className="text-muted-foreground hover:text-red-500 transition-colors"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                )}
                            </div>

                            <textarea
                                value={q.question}
                                onChange={(e) => updateQuestion(qIndex, { question: e.target.value })}
                                rows={2}
                                placeholder="Type the question..."
                                className="w-full resize-none rounded-md border border-input bg-background text-foreground px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-[#C08A2E]"
                            />

                            <p className="text-xs font-medium text-muted-foreground">
                                Select the radio button next to the correct option.
                            </p>

                            <div className="space-y-2">
                                {q.options.map((option, oIndex) => (
                                    <div key={oIndex} className="flex items-center gap-2">
                                        <input
                                            type="radio"
                                            name={`correct-${qIndex}`}
                                            checked={q.correctOption === oIndex}
                                            onChange={() => updateQuestion(qIndex, { correctOption: oIndex })}
                                            className="h-4 w-4 accent-[#C08A2E] shrink-0"
                                        />
                                        <input
                                            value={option}
                                            onChange={(e) => updateOption(qIndex, oIndex, e.target.value)}
                                            placeholder={`Option ${oIndex + 1}`}
                                            className="flex-1 rounded-md border border-input bg-background text-foreground px-3 py-1.5 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-[#C08A2E]"
                                        />
                                        {q.options.length > 2 && (
                                            <button
                                                type="button"
                                                onClick={() => removeOption(qIndex, oIndex)}
                                                aria-label="Remove option"
                                                className="text-muted-foreground hover:text-red-500 transition-colors shrink-0"
                                            >
                                                <Trash2 className="h-3.5 w-3.5" />
                                            </button>
                                        )}
                                    </div>
                                ))}

                                <button
                                    type="button"
                                    onClick={() => addOption(qIndex)}
                                    className="flex items-center gap-1.5 text-sm font-medium text-[#C08A2E] hover:opacity-80 transition-opacity"
                                >
                                    <Plus className="h-3.5 w-3.5" />
                                    Add option
                                </button>
                            </div>
                        </div>
                    ))}

                    <button
                        type="button"
                        onClick={addQuestion}
                        className="flex items-center gap-1.5 text-sm font-medium text-[#C08A2E] hover:opacity-80 transition-opacity"
                    >
                        <Plus className="h-4 w-4" />
                        Add question
                    </button>
                </div>
            )}

            <button
                type="submit"
                disabled={submitting}
                className="w-full rounded-md bg-[#C08A2E] py-3 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
                {submitting ? "Creating test..." : "Create test"}
            </button>
        </form>
    );
}