import { getAttemptByTestId } from "@/api/test";
import Link from "next/link";
import { AttemptCard } from "@/components/attemptCard.component";

export default async function TestDetailPage({ params }: { params: Promise<{ testId: string }> }) {
    const { testId } = await params;
    const response = await getAttemptByTestId(testId);
    const attempts = response.data ?? []
    console.log(attempts)
    return (
        <div className="flex flex-col gap-4 px-10 py-6">
            <div className="flex justify-center gap-10 items-center mt-4 mb-4">
                <h1 className="text-2xl font-bold">Total Attempts: {attempts.length}</h1>
                <Link href={`/test/${testId}/attempt`} className="bg-[#C08A2E] text-white text-sm font-medium px-4 py-2 rounded hover:bg-[#A1701E] transition">
                {attempts.length > 0 ? "Re Attempt" : "Attempt Test"}
                </Link>
            </div>
            <div className="flex flex-col gap-4">
                {attempts.map((attempt: any) => (
                    <AttemptCard key={attempt._id} attempt={attempt} />
                ))}
            </div>
        </div>
    );
}