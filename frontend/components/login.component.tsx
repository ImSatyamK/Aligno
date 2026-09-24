'use client'

import { useRouter } from "next/navigation";
import { useState } from "react";
import { signIn } from "../api/auth";
import { toast } from "./ui/toast";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";

const FIELDS = [
    { key: "username", label: "Username", type: "text", placeholder: "johndoe" },
];

export function LoginComponent() {
    const router = useRouter();
    const [submitting, setSubmitting] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const handleSubmit = async (event: React.SubmitEvent<HTMLFormElement>) => {
        event.preventDefault();

        const formData = new FormData(event.currentTarget);

        const data = {
            username: formData.get("username") as string,
            password: formData.get("password") as string,
        };

        setSubmitting(true);

        const result = await signIn(
            data.username,
            data.password
        );

        if (result.success) {
            toast.add({ title: "Logged in successfully", type: "success" });
            router.push("/");
        } else {
            toast.add({
                title: "Error",
                description: result.message,
                type: "error",
            });
        }

        setSubmitting(false);
    };

    return (
        <div>
            <h2 className="text-2xl font-semibold text-center mb-6 text-foreground">
                Login to your account<br></br>
                <span className="text-sm text-[#C08A2E]">Be your best with us</span>
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
                {FIELDS.map((field) => (
                    <div key={field.key} className="flex flex-col gap-1">
                        <label className="text-sm font-medium text-foreground">
                            {field.label}
                        </label>

                        <input
                            name={field.key}
                            type={field.type}
                            placeholder={field.placeholder}
                            required
                            className="w-full rounded-md border border-input bg-background text-foreground px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-[#C08A2E]"
                        />
                    </div>
                ))}
                <div className="flex flex-col gap-1 col-span-2">
                    <label className="text-sm font-medium text-foreground">
                        Password
                    </label>

                    <div className="relative">
                        <input
                            name="password"
                            type={showPassword ? "text" : "password"}
                            placeholder="Enter your password"
                            required
                            className="w-full rounded-md border border-input bg-background text-foreground px-3 py-2 pr-10 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-[#C08A2E]"
                        />

                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        >
                            {showPassword ? (
                                <EyeOff className="h-5 w-5" />
                            ) : (
                                <Eye className="h-5 w-5" />
                            )}
                        </button>
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={submitting}
                    className="mt-4 w-full rounded-md bg-[#C08A2E] px-4 py-3 text-sm font-semibold text-white hover:opacity-90 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#C08A2E] focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed transition"
                >
                    {submitting ? "Logging in..." : "Login"}
                </button>

                <p className="text-center text-sm text-muted-foreground">
                    Don't have an account?{" "}
                    <Link href={"/signup"} className="font-medium text-foreground underline underline-offset-2 hover:text-[#C08A2E]">
                        Create One
                    </Link>
                </p>
            </form>
        </div>
    );
}