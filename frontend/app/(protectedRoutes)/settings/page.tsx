import { SignOutComponent } from "@/components/signout";

export default async function SettingsPage() {

    return (
        <div className="mx-auto w-full max-w-xl px-4 pt-24">
            <h1 className="text-2xl font-semibold text-foreground">Settings</h1>
            <div className="mt-6 space-y-4">
                <SignOutComponent />
            </div>
        </div>
    );
}
