import { startAttempt } from "@/api/attempt";
import { QuestionCard } from "@/components/questionCard";

export default async function AttemptPage({ params }: { params: Promise<{ testId: string }> }) {
    const { testId } = await params;
    const result = await startAttempt(testId);
    console.log("Attempt result:", result);
    if (!result.success) {
        return (
            <div className="max-w-2xl mx-auto px-4 py-10 text-center text-muted-foreground">
                <p>Failed to start the test.</p>
            </div>
        );
    }

    const questions = result.data.attempt.questions;
    console.log("Attempt started:", result);
    return (
        <div className="max-w-2xl mx-auto px-4 py-10 text-center text-muted-foreground">
            <QuestionCard attempt={result.data.attempt} testId={testId} />
        </div>
    );
}