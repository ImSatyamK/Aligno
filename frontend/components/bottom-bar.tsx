'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { Home, Pencil, Bell, Plus } from "lucide-react";
import { useHideOnScroll } from "@/hooks/scroll";

const NAV_ITEMS = [
    { href: "/", label: "Home", icon: Home },
    { href: "/test", label: "Tests", icon: Pencil },
    { href: "/create", label: "Create", icon: Plus },
    { href: "/notifications", label: "Alerts", icon: Bell },
];

interface TabBarUser {
    name: string;
    profileImg?: string;
}

export function BottomTabBar({ user }: { user: TabBarUser | null }) {
    const pathname = usePathname();
    const hidden = useHideOnScroll();
    const profileImage = user?.profileImg || "/default_profile.png";
    const isProfileActive = pathname === "/profile";

    return (
        <nav
            className={`md:hidden fixed bottom-0 left-0 right-0 z-50 flex items-center justify-around border-t border-foreground/10 bg-background py-2 pb-[calc(0.5rem+env(safe-area-inset-bottom))] transition-transform duration-300 ${
                hidden ? "translate-y-full" : "translate-y-0"
            }`}
        >
            {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
                const isActive = pathname === href;
                return (
                    <Link
                        key={href}
                        href={href}
                        className={`flex flex-col items-center gap-0.5 px-3 py-1 text-[11px] font-medium ${
                            isActive ? "text-[#C08A2E]" : "text-foreground/60"
                        }`}
                    >
                        <Icon className="h-5 w-5" />
                        {label}
                    </Link>
                );
            })}

            <Link href="/profile"
                className={`flex flex-col items-center gap-0.5 px-3 py-1 text-[11px] font-medium ${
                    isProfileActive ? "text-[#C08A2E]" : "text-foreground/60"
                }`}
            >
                <Image
                    src={profileImage}
                    alt="Profile"
                    width={20}
                    height={20}
                    className={`h-5 w-5 rounded-full object-cover ${
                        isProfileActive ? "ring-2 ring-[#C08A2E]" : ""
                    }`}
                />
                Profile
            </Link>
        </nav>
    );
}