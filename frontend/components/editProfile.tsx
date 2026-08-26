'use client'

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Camera } from "lucide-react";
import { compressImage } from "@/lib/compressImage";
import { updateUserProfile } from "@/api/user";
import { toast } from "./ui/toast";
import Link from "next/link";

interface User {
    name: string;
    username: string;
    email: string;
    bio?: string;
    link?: string;
    profileImg?: string;
    coverImg?: string;
}

export function EditProfileForm({ user, from }: { user: User; from: string }) {
    const router = useRouter();

    const [name, setName] = useState(user.name || "");
    const [username, setUsername] = useState(user.username || "");
    const [email, setEmail] = useState(user.email || "");
    const [bio, setBio] = useState(user.bio || "");
    const [link, setLink] = useState(user.link || "");
    const [currPassword, setCurrPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");

    const [profileImgFile, setProfileImgFile] = useState<File | null>(null);
    const [profileImgPreview, setProfileImgPreview] = useState<string | null>(user.profileImg || null);
    const [coverImgFile, setCoverImgFile] = useState<File | null>(null);
    const [coverImgPreview, setCoverImgPreview] = useState<string | null>(user.coverImg || null);

    const profileInputRef = useRef<HTMLInputElement>(null);
    const coverInputRef = useRef<HTMLInputElement>(null);

    const [submitting, setSubmitting] = useState(false);

    function handleProfileImgChange(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (!file) return;
        if (profileImgPreview) URL.revokeObjectURL(profileImgPreview);
        setProfileImgFile(file);
        setProfileImgPreview(URL.createObjectURL(file));
    }

    function handleCoverImgChange(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (!file) return;
        if (coverImgPreview) URL.revokeObjectURL(coverImgPreview);
        setCoverImgFile(file);
        setCoverImgPreview(URL.createObjectURL(file));
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        if ((currPassword && !newPassword) || (!currPassword && newPassword)) {
            toast.add({
                title: "Missing field",
                description: "Both current and new password are required to change your password.",
                type: "error",
            });
            return;
        }

        setSubmitting(true);

        try {
            const formData = new FormData();
            formData.append("name", name);
            formData.append("username", username);
            formData.append("email", email);
            formData.append("bio", bio);
            formData.append("link", link);
            if (currPassword && newPassword) {
                formData.append("currPassword", currPassword);
                formData.append("newPassword", newPassword);
            }

            if (profileImgFile) {
                const compressed = await compressImage(profileImgFile);
                formData.append("profileImg", compressed);
            }
            if (coverImgFile) {
                const compressed = await compressImage(coverImgFile, 1500);
                formData.append("coverImg", compressed);
            }

            const result = await updateUserProfile(formData);

            if (result.success) {
                toast.add({ title: "Profile updated", type: "success" });
                setCurrPassword("");
                setNewPassword("");
                router.push("/");
            } else {
                toast.add({
                    title: "Error",
                    description: typeof result.error === "string" ? result.error : "Failed to update profile",
                    type: "error",
                });
            }
        } catch (err) {
            console.error(err);
            toast.add({ title: "Error", description: "Something went wrong.", type: "error" });
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <form onSubmit={handleSubmit} className="mt-6 space-y-6 px-10 w-full max-w-2xl mx-auto mb-10">
            {from === '/signup' && (
                <Link href={"/"}>
                    <button
                        type="button"
                        className="mb-4 flex items-center gap-1.5 rounded-md bg-foreground/10 px-3 py-1.5 text-sm font-medium text-foreground/70 hover:bg-foreground/10 hover:text-foreground transition-colors"
                    >
                        {"Skip"}
                </button>
            </Link>)}
            <h3 className="text-lg font-semibold text-foreground">
                {from === "/profile" ? `Hi ${user.name.split(" ")[0]}, edit your profile` : `Hii ${user.name.split(" ")[0]}, let's configure your profile`}
            </h3>
            <div className="relative">
                <div
                    className="h-32 w-full rounded-md bg-foreground/5 overflow-hidden cursor-pointer group"
                    onClick={() => coverInputRef.current?.click()}
                >
                    {coverImgPreview && (
                        <Image
                            src={coverImgPreview}
                            alt="Cover"
                            width={800}
                            height={300}
                            unoptimized={coverImgFile !== null}
                            className="w-full h-full object-cover"
                        />
                    )}
                    <div className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/30 transition-colors">
                        <Camera className="h-6 w-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                </div>
                <input
                    ref={coverInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleCoverImgChange}
                    className="hidden"
                />

                <div
                    className="absolute -bottom-8 left-4 cursor-pointer group"
                    onClick={() => profileInputRef.current?.click()}
                >
                    <div className="h-20 w-20 rounded-full border-4 border-background overflow-hidden bg-foreground/10">
                        <Image
                            src={profileImgPreview || "/default_profile.webp"}
                            alt="Profile"
                            width={80}
                            height={80}
                            unoptimized={profileImgFile !== null}
                            className="h-full w-full object-cover"
                        />
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/0 group-hover:bg-black/30 transition-colors">
                        <Camera className="h-5 w-5 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                </div>
                <input
                    ref={profileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleProfileImgChange}
                    className="hidden"
                />
            </div>

            <div className="pt-8 space-y-4">
                {from === "/profile" && (<div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">Name</label>
                    <input
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full rounded-md border border-input bg-background text-foreground px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#C08A2E]"
                    />
                </div>)}

                {from === "/profile" && (<div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">Username</label>
                    <input
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="w-full rounded-md border border-input bg-background text-foreground px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#C08A2E]"
                    />
                </div>)}

                {from === "/profile" && (<div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">Email</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full rounded-md border border-input bg-background text-foreground px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#C08A2E]"
                    />
                </div>)}

                <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">Bio</label>
                    <textarea
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        rows={3}
                        className="w-full resize-none rounded-md border border-input bg-background text-foreground px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#C08A2E]"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">Link</label>
                    <input
                        value={link}
                        onChange={(e) => setLink(e.target.value)}
                        placeholder="https://..."
                        className="w-full rounded-md border border-input bg-background text-foreground px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-[#C08A2E]"
                    />
                </div>
            </div>

            {from === "/profile" && (
                <div className="border-t border-foreground/10 pt-5 space-y-4">
                    <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                        Change password
                    </h2>

                <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">Current password</label>
                    <input
                        type="password"
                        value={currPassword}
                        onChange={(e) => setCurrPassword(e.target.value)}
                        className="w-full rounded-md border border-input bg-background text-foreground px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#C08A2E]"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">New password</label>
                    <input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full rounded-md border border-input bg-background text-foreground px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#C08A2E]"
                    />
                </div>
            </div>)}
            <button
                type="submit"
                disabled={submitting}
                className="w-full rounded-md bg-[#C08A2E] py-3 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
                {submitting ? "Saving..." : "Save changes"}
            </button>
        </form>
    );
}