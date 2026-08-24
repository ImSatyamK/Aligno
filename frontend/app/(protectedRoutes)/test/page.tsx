import Link from "next/link";
import { Plus, ClipboardList } from "lucide-react";
import { getMyTests } from '@/api/test';
import { TestCard } from '@/components/testCard';

export default async function TestPage() {
    const response = await getMyTests();

    if (!response.success) {
        return (
            <div className="px-4 py-10 text-center text-muted-foreground">
                Couldn't load your tests.
            </div>
        );
    }

    const tests = response.data.tests ?? [];

    return (
        <div className="max-w-full mx-auto px-4 py-8">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-semibold text-foreground">Total Tests: {tests.length}</h1>

                <Link
                    href="/test/create"
                    className="flex items-center gap-1.5 rounded-md bg-[#C08A2E] px-4 py-2 text-sm font-semibold text-white hover:opacity-90 transition"
                >
                    <Plus className="h-4 w-4" />
                    Create test
                </Link>
            </div>

            {tests.length === 0 ? (
                <div className="mt-16 flex flex-col items-center text-center">
                    <ClipboardList className="h-10 w-10 text-muted-foreground/50" />
                    <p className="mt-3 text-muted-foreground">You haven't created any tests yet.</p>
                    <Link
                        href="/test/create"
                        className="mt-4 text-sm font-medium text-[#C08A2E] hover:underline"
                    >
                        Create your first test
                    </Link>
                </div>
            ) : (
                <div className="flex flex-col gap-4 w-full mt-6">
                    {tests.map((test: any) => (
                        <TestCard key={test._id} test={test} />
                    ))}
                </div>
            )}
        </div>
    );
}