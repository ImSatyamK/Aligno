'use client';

import Image from "next/image";
import { Menu } from "lucide-react";

export function Navbar({ onMenuClick }: { onMenuClick: () => void }) {
    return (
        <nav className="fixed top-0 left-0 right-0 z-50 grid grid-cols-3 items-center h-20 px-6 sm:px-8 border-b border-border bg-background text-foreground">
            <div className="flex items-center">
                <Image
                    src="/logo_light.png"
                    alt="Aligno"
                    width={40}
                    height={40}
                    style={{ width: "auto", height: "auto" }}
                    className="block dark:hidden"
                />
                <Image
                    src="/logo_dark.png"
                    alt="Aligno"
                    width={40}
                    height={40}
                    style={{ width: "auto", height: "auto" }}
                    className="hidden dark:block"
                />
            </div>

            <div className="relative w-56 justify-self-center">
                <svg
                    className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                >
                    <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-4.35-4.35m2.35-5.65a8 8 0 1 1-16 0 8 8 0 0 1 16 0Z" />
                </svg>
                <input
                    type="text"
                    placeholder="Search"
                    className="w-full rounded-full border border-input bg-background py-2 pl-9 pr-4 text-sm text-foreground outline-none transition focus:border-[#C08A2E] placeholder:text-muted-foreground"
                />
            </div>

            <button
                type="button"
                onClick={onMenuClick}
                aria-label="Toggle menu"
                className="md:hidden justify-self-end flex h-9 w-9 items-center justify-center rounded-md text-foreground/70 hover:text-foreground hover:bg-foreground/5 transition-colors"
            >
                <Menu className="h-5 w-5" />
            </button>
        </nav>
    );
}