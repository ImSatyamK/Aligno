'use client'

import { useState } from 'react';
import { TestCard } from '@/components/testCard';
import Link from 'next/link';
import { Plus } from 'lucide-react';
import { ITest } from '@/api/test';

export function TestPageComponent({myTests, publicTests}: {myTests: ITest[], publicTests: ITest[]}) {

    const [toggle, setToggle] = useState<'myTests' | 'publicTests'>('publicTests');
    const [activeTests, setActiveTests] = useState<ITest[]>(toggle === 'myTests' ? myTests : publicTests);

    const handleToggle = (value: 'myTests' | 'publicTests') => {
        setToggle(value);
        setActiveTests(value === 'myTests' ? myTests : publicTests);
    }

    return (
        <div className="max-w-3xl mx-auto">
            <div className="sticky top-20 z-40 flex items-center justify-between gap-4 border-b border-foreground/10 bg-background px-4 py-3">
                <div className="flex items-center gap-6">
                    <button
                        onClick={() => handleToggle('publicTests')}
                        className={`pb-1 text-sm font-medium transition-colors ${toggle === 'publicTests'
                                ? 'text-foreground border-b-2 border-foreground'
                                : 'text-foreground/60 hover:text-foreground'
                            }`}
                    >
                        Discover
                    </button>

                    <button
                        onClick={() => handleToggle('myTests')}
                        className={`pb-1 text-sm font-medium transition-colors ${toggle === 'myTests'
                                ? 'text-foreground border-b-2 border-foreground'
                                : 'text-foreground/60 hover:text-foreground'
                            }`}
                    >
                        Mine
                    </button>
                </div>

                <Link
                    href="/test/create"
                    className="flex items-center gap-1.5 text-sm font-medium text-foreground/70 hover:text-foreground transition-colors shrink-0"
                >
                    <Plus className="h-4 w-4" />
                    Create test
                </Link>
            </div>

            <div className="px-4">
                {activeTests.length === 0 ? (
                    <p className="mt-10 text-center text-sm text-muted-foreground">
                        {toggle === 'myTests'
                            ? "You haven't created any tests yet."
                            : "No public tests available right now."}
                    </p>
                ) : (
                    <div className="flex flex-col gap-4 mt-6">
                        {activeTests.map((test) => (
                            <TestCard
                                key={test._id}
                                test={test}
                            />
                        ))}
                        <p className="text-center text-sm text-muted-foreground"> You've reached the end.</p>
                    </div>
                )}
            </div>
        </div>
    );
}