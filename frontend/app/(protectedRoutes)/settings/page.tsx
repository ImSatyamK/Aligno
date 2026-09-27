import { SignOutComponent } from "@/components/signout";
import { ThemeToggle } from "@/components/theme-toggle";

export default async function SettingsPage() {

    return (
        <div className="mx-auto w-full max-w-xl px-4 pt-24">
            <h1 className="text-2xl font-semibold text-foreground">Settings</h1>
            <div className="mt-6 space-y-4">
                <div className="flex items-center justify-between rounded-md px-3 py-2 text-sm font-medium text-foreground/70 bg-background">
                    <span>Theme</span>
                    <ThemeToggle />
                </div>
                <SignOutComponent />
            </div>
        </div>
    );
}
