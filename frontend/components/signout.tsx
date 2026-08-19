'use client'

import { useRouter } from "next/navigation";
import { signOut } from "@/api/auth";
import { toast } from "./ui/toast";

export function SignOutComponent() {
    const router = useRouter();
    const handleSignOut = async () => {
        const result = await signOut();
        if (!result) {
            toast.add({
                    title: "Error",
                    description: "Failed to sign out. Please try again.",
                })
            return;
        }
        else {
            router.push("/login");
            toast.add({
                title: "Success",
                description: "You have been signed out.",
            })
        }
    }
    return (
        <button
            onClick={handleSignOut}
            className="w-full rounded-lg bg-red-600 px-4 py-2 text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
        >
            Sign Out
        </button>
    );
}