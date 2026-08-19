import { getCurrentUser } from "@/api/auth";
import { ProtectedShell } from "@/components/protected-shell";

export default async function ProtectedRoutesLayout({ children }: { children: React.ReactNode }) {
    const user = await getCurrentUser();
    const userData = user.success ? user.data : null;

    return <ProtectedShell user={userData}>{children}</ProtectedShell>;
}