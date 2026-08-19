'use client';

import { useState } from "react";
import { Navbar } from "@/components/navbar";
import { Sidebar } from "@/components/sidebar";

export function ProtectedShell({
    children,
    user,
}: {
    children: React.ReactNode;
    user: { name: string; profileImg?: string } | null;
}) {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="min-h-dvh pt-20">
            <Navbar onMenuClick={() => setSidebarOpen((v) => !v)} />
            <div className="flex">
                <div className="hidden md:block w-56 shrink-0" />
                <main className="flex-1">{children}</main>
            </div>
            <Sidebar user={user} open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        </div>
    );
}