import { SignupComponent } from "@/components/signup.component";

export default function SignUpPage() {
    return (
        <div className="flex min-h-full items-center justify-center px-4 py-10">
            <div className="w-full max-w-md p-6 border bg-background border-border rounded-lg shadow-sm bg-card text-card-foreground">
                <SignupComponent />
            </div>
        </div>
    );
}