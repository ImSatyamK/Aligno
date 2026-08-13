'use client'

import { useRouter } from "next/navigation";
import { useState } from "react";
import { signUp } from "../api/auth";
import { toast } from "./ui/toast";
import Link from "next/link"

const FIELDS = [
  { key: "name", label: "Name", type: "text", placeholder: "John Doe" },
  { key: "username", label: "Username", type: "text", placeholder: "johndoe" },
  { key: "email", label: "Email", type: "email", placeholder: "john@example.com" },
  { key: "password", label: "Password", type: "password", placeholder: "••••••••" },
];

export function SignupComponent() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event: React.SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);

    const data = {
      name: formData.get("name") as string,
      username: formData.get("username") as string,
      email: formData.get("email") as string,
      password: formData.get("password") as string,
    };

    setSubmitting(true);

    const result = await signUp(
      data.name,
      data.username,
      data.email,
      data.password
    );

    if (result.success) {
      toast.add({ title: "Account created", type: "success" });
      router.push("/home");
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
    <>
      <h2 className="text-2xl font-semibold text-center mb-6 text-foreground">
        Create your account<br></br>
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

        <button
          type="submit"
          disabled={submitting}
          className="mt-4 w-full rounded-md bg-[#C08A2E] px-4 py-3 text-sm font-semibold text-white hover:opacity-90 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#C08A2E] focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed transition"
        >
          {submitting ? "Creating account..." : "Create account"}
        </button>

        <p className="text-center text-sm text-muted-foreground">
          Already set up?{" "}
          <Link href={"/login"}
            className="font-medium text-foreground underline underline-offset-2 hover:text-[#C08A2E]"
          >
            Log in
          </Link>
        </p>
      </form>
    </>
  );
}