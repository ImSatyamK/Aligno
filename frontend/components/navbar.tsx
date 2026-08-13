'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "@/components/theme-toggle";

export function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="sticky top-0 z-50 flex items-center justify-between px-6 sm:px-8 py-5 border-b border-border bg-background text-foreground">
      
      <Link href="/" className="text-xl font-semibold tracking-tight">
        AliG<span className="text-[#C08A2E]">nO</span>
      </Link>

      <div className="flex items-center gap-4 sm:gap-6">
        {pathname === "/" && (
          <>
            <Link
              href="/login"
              className="text-sm font-medium transition-opacity hover:opacity-70"
            >
              Login
            </Link>

            <Link
              href="/signup"
              className="bg-[#C08A2E] text-white px-4 py-2 rounded-md text-sm font-medium hover:opacity-90 transition-opacity"
            >
              Sign Up
            </Link>
          </>
        )}

        <ThemeToggle />
      </div>
    </nav>
  );
}