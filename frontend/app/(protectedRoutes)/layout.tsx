import { getCurrentUser } from "@/api/auth";
import { ProtectedShell } from "@/components/protected-shell";
import { redirect } from "next/navigation";

export default async function ProtectedRoutesLayout({ children }: { children: React.ReactNode }) {
    const user = await getCurrentUser();
    if (!user.success) {
        redirect("/login");
    }

    return <ProtectedShell user={user.data}>{children}</ProtectedShell>;
}