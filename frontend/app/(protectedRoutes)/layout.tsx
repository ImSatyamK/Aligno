import { Navbar } from "@/components/navbar";
import { Sidebar } from "@/components/sidebar";
import { getCurrentUser } from "@/api/auth";
import { BottomTabBar } from "@/components/bottom-bar";

export default async function ProtectedRoutesLayout({ children }: { children: React.ReactNode }) {
    const user = await getCurrentUser();
    const userData = user.success ? user.data : null;

    return (
        <div className="min-h-dvh">
            <Navbar />
            <div className="flex">
                <Sidebar user={userData} />
                <main className="flex-1 pb-16 md:pb-0">{children}</main>
            </div>
            <BottomTabBar user={userData} />
        </div>
    );
}