'use client';

import { ThemeToggle } from "@/components/theme-toggle";
import Image from "next/image";
import { useHideOnScroll } from "@/hooks/scroll";

export function Navbar() {
    const hidden = useHideOnScroll();

    return (
        <nav
            className={`sticky top-0 z-50 flex items-center justify-between px-6 sm:px-8 py-5 border-b border-border bg-background text-foreground transition-transform duration-300 ${
                hidden ? "-translate-y-full" : "translate-y-0"
            }`}
        >
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

            <div className="relative w-56">
                <svg
                    className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="m21 21-4.35-4.35m2.35-5.65a8 8 0 1 1-16 0 8 8 0 0 1 16 0Z"
                    />
                </svg>

                <input
                    type="text"
                    placeholder="Search"
                    className="w-full rounded-full border border-input bg-background py-2 pl-9 pr-4 text-sm text-foreground outline-none transition focus:border-[#C08A2E] placeholder:text-muted-foreground"
                />
            </div>

            <ThemeToggle />
        </nav>
    );
}