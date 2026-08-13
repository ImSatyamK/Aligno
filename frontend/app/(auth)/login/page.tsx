import { LoginComponent } from "@/components/login.component";

export default function LoginPage() {
    return (
        <div className="flex min-h-full items-center justify-center px-4 py-10">
            <div className="w-full max-w-md p-6 border border-foreground/10 rounded-lg shadow-sm bg-background">
                <LoginComponent />
            </div>
        </div>
    );
}