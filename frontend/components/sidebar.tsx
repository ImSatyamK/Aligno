'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { Home, User, Bell, Pencil, Plus } from "lucide-react";

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

export function Sidebar({ user }: { user: SidebarUser | null }) {
    const pathname = usePathname();
    const profileImage = user?.profileImg || "/default_profile.webp";

    return (
        <aside className="hidden md:flex w-56 shrink-0 flex-col gap-1 border-r border-foreground/10 bg-background px-3 py-6 sticky top-[85px] h-[calc(100dvh-89px)]">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
            const isActive = pathname === href;
            return (
                <Link
                    key={href}
                    href={href}
                    className={`flex items-center gap-3 rounded-md px-3 py-2 text-base font-medium transition-colors ${isActive
                        ? "bg-[#C08A2E]/10 text-[#C08A2E]"
                        : "text-foreground/70 hover:bg-foreground/5 hover:text-foreground"
                        }`}
                >
                    <Icon className="h-5 w-5" />
                    {label}
                </Link>
            );
        })
        }

            <div className="mt-auto flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-foreground/70 hover:bg-foreground/5 hover:text-foreground transition-colors">
                <Link href="/profile">
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
        </aside>
    );
}