import Link from "next/link";
import { Clock, ListChecks, CheckCircle2, XCircle } from "lucide-react";

interface Test {
    _id: string;
    title: string;
    description?: string;
    duration: number;
    questionCount: number;
    correctMarks: number;
    negativeMarks: number;
}

export function TestCard({ test }: { test: Test }) {
    return (
        <Link
            href={`/test/${test._id}`}
            className="block w-full rounded-md border border-foreground/10 bg-background p-5 transition-colors hover:border-[#C08A2E]/40"
        >
            <h2 className="text-lg font-semibold text-foreground">{test.title}</h2>

            {test.description && (
                <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{test.description}</p>
            )}

            <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm">
                <div className="flex items-center gap-1.5 text-foreground/70">
                    <Clock className="h-4 w-4" />
                    {test.duration / 60} min
                </div>

                <div className="flex items-center gap-1.5 text-foreground/70">
                    <ListChecks className="h-4 w-4" />
                    {test.questionCount} questions
                </div>

                <div className="flex items-center gap-1.5 text-green-600 dark:text-green-500">
                    <CheckCircle2 className="h-4 w-4" />
                    +{test.correctMarks}
                </div>

                <div className="flex items-center gap-1.5 text-red-600 dark:text-red-500">
                    <XCircle className="h-4 w-4" />
                    -{test.negativeMarks}
                </div>
            </div>
        </Link>
    );
}