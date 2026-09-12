import Link from "next/link";
import { Clock, ListChecks, CheckCircle2, XCircle, Lock, Globe } from "lucide-react";
import { getTestDetail } from "@/api/test";
import { AttemptCard } from "@/components/attemptCard.component";

export default async function TestDetailPage({ params }: { params: Promise<{ testId: string }> }) {
    const { testId } = await params;
    const result = await getTestDetail(testId);

    if (!result.success) {
        return (
            <div className="max-w-2xl mx-auto px-4 py-10 text-center text-muted-foreground">
                Couldn't load this test.
            </div>
        );
    }

    const { test, attempts } = result.data;
    const inProgressAttempt = attempts?.find((a: any) => a.status === "IN_PROGRESS");

    return (
        <div className="max-w-2xl mx-auto px-4 py-8">
            <div className="flex items-start justify-between gap-3">
                <h1 className="text-2xl font-semibold text-foreground">{test.title}</h1>
                <span className="flex items-center gap-1 shrink-0 rounded-full bg-foreground/5 px-2.5 py-1 text-xs font-medium text-foreground/70">
                    {test.visibility === "PUBLIC" ? (
                        <Globe className="h-3 w-3" />
                    ) : (
                        <Lock className="h-3 w-3" />
                    )}
                    {test.visibility}
                </span>
            </div>

            {test.description && (
                <p className="mt-2 text-sm text-muted-foreground">{test.description}</p>
            )}

            <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 rounded-md border border-foreground/10 px-4 py-3 text-sm">
                <div className="flex items-center gap-1.5 text-foreground/70">
                    <Clock className="h-4 w-4" />
                    {Math.round(test.duration / 60)} min
                </div>
                <div className="flex items-center gap-1.5 text-foreground/70">
                    <ListChecks className="h-4 w-4" />
                    {test.questionCount} question{test.questionCount === 1 ? "" : "s"}
                </div>
                <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
                    <CheckCircle2 className="h-4 w-4" />
                    +{test.correctMarks}
                </div>
                <div className="flex items-center gap-1.5 text-red-500">
                    <XCircle className="h-4 w-4" />
                    -{test.negativeMarks}
                </div>
            </div>

            {test.instructions && (
                <div className="mt-4 rounded-md border border-foreground/10 bg-foreground/[0.02] p-4">
                    <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                        Instructions
                    </h2>
                    <p className="mt-2 text-sm text-foreground whitespace-pre-wrap break-words">
                        {test.instructions}
                    </p>
                </div>
            )}

            <div className="mt-6">
                    <Link
                        href={`/test/${test._id}/attempt/`}
                        className="block w-full rounded-md bg-[#C08A2E] py-3 text-center text-sm font-semibold text-white hover:opacity-90 transition"
                    >
                        {inProgressAttempt ? "Continue Attempt" : "Start Attempt"}
                    </Link>
            </div>

            {attempts && attempts.length > 0 && (
                <div className="mt-10">
                    <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                        Your attempts
                    </h2>
                    <div className="mt-3 flex flex-col gap-4">
                        {attempts.map((attempt: any) => (
                            <AttemptCard key={attempt._id} attempt={attempt} />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}