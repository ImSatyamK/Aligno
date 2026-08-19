'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { Home, Bell, Pencil, Plus } from "lucide-react";
import { ThemeToggle } from "./theme-toggle";

const NAV_ITEMS = [
    { href: "/", label: "Home", icon: Home },
    { href: "/test", label: "Tests", icon: Pencil },
    { href: "/create", label: "Create", icon: Plus },
    { href: "/notifications", label: "Notifications", icon: Bell },
];

interface SidebarUser {
    name: string;
    profileImg?: string;
}

export function Sidebar({
    user,
    open,
    onClose,
}: {
    user: SidebarUser | null;
    open: boolean;
    onClose: () => void;
}) {
    const pathname = usePathname();
    const profileImage = user?.profileImg || "/default_profile.webp";

    return (
        <>
            {open && <div className="fixed inset-0 z-30 bg-black/40 md:hidden" onClick={onClose} />}

            <aside
                className={`fixed left-0 top-0 z-40 w-56 h-dvh flex flex-col gap-1 border-r border-foreground/10 bg-background px-3 pt-24 pb-6 transition-transform duration-200
                ${open ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}
            >
                {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
                    const isActive = pathname === href;
                    return (
                        <Link
                            key={href}
                            href={href}
                            onClick={onClose}
                            className={`flex items-center gap-3 rounded-md px-3 py-2 text-base font-medium transition-colors ${isActive ? "bg-[#C08A2E]/10 text-[#C08A2E]" : "text-foreground/70 hover:bg-foreground/5 hover:text-foreground"
                                }`}
                        >
                            <Icon className="h-5 w-5" />
                            {label}
                        </Link>
                    );
                })}

                <div className="mt-auto flex flex-col gap-3">
                    <div className="flex items-center justify-between rounded-md px-3 py-2 text-sm font-medium text-foreground/70">
                        <span>Theme</span>
                        <ThemeToggle />
                    </div>

                    <div className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-foreground/70 hover:bg-foreground/5 hover:text-foreground transition-colors">
                        <Link href="/profile" onClick={onClose}>
                            <Image
                                src={profileImage}
                                alt="Profile"
                                width={32}
                                height={32}
                                className="h-7 w-7 rounded-full object-cover"
                            />
                        </Link>
                        {user?.name && <span className="text-base truncate">{user.name}</span>}
                    </div>
                </div>
            </aside>
        </>
    );
}