import { getCurrentUser } from "@/api/auth";
import Image from "next/image";
import Link from "next/link";
import { Settings, Link as LinkIcon } from "lucide-react";
import { getUserPosts } from "@/api/post";
import { PostCard } from "@/components/post-card";

export default async function ProfilePage() {
    const result = await getCurrentUser();
    const postsResult = await getUserPosts(result.data?._id ?? "");
    const posts = postsResult.success ? postsResult.data.posts : [];

    if (!result.success) {
        return (
            <div className="px-4 py-10 text-center text-muted-foreground">
                Couldn't load your profile.
            </div>
        );
    }

    const user = result.data;

    return (
        <div className="mx-auto w-full max-w-xl px-4 pt-24">
            {/* Cover */}
            <div className="h-40 w-full overflow-hidden rounded-xl bg-foreground/5">
                {user.coverImg && (
                    <Image
                        src={user.coverImg}
                        alt=""
                        width={800}
                        height={300}
                        className="h-full w-full object-cover"
                    />
                )}
            </div>

            {/* Profile content */}
            <div>
                {/* Avatar + Settings */}
                <div className="-mt-10 flex items-end justify-between">
                    <Image
                        src={user.profileImg || "/default_profile.webp"}
                        alt={user.username}
                        width={88}
                        height={88}
                        className="h-[88px] w-[88px] shrink-0 rounded-full border-4 border-background object-cover"
                    />

                    <Link
                        href="/settings"
                        aria-label="Settings"
                        className="flex h-9 w-9 items-center justify-center rounded-full border border-input text-foreground/70 transition-colors hover:bg-foreground/5 hover:text-foreground"
                    >
                        <Settings className="h-4 w-4" />
                    </Link>
                </div>

                {/* Name */}
                <div className="mt-3 min-w-0">
                    <h1 className="truncate text-xl font-semibold text-foreground">
                        {user.name}
                    </h1>

                    <p className="truncate text-muted-foreground">
                        @{user.username}
                    </p>
                </div>

                {/* Bio */}
                {user.bio && (
                    <p className="mt-3 break-words whitespace-pre-wrap text-[15px] text-foreground [overflow-wrap:anywhere]">
                        {user.bio}
                    </p>
                )}

                {/* Website */}
                {user.link && (
                    <a
                        href={'https://www.youtube.com'}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-2 flex w-fit max-w-full items-center gap-1.5 text-sm text-[#C08A2E] hover:underline"
                    >
                        <LinkIcon className="h-3.5 w-3.5 shrink-0" />

                        <span className="truncate">
                            {'youtube'}
                        </span>
                    </a>
                )}

                {/* Followers */}
                <div className="mt-4 flex gap-6 text-sm">
                    <div>
                        <span className="font-semibold text-foreground">
                            {user.following?.length ?? 0}
                        </span>{" "}
                        <span className="text-muted-foreground">
                            Following
                        </span>
                    </div>

                    <div>
                        <span className="font-semibold text-foreground">
                            {user.followers?.length ?? 0}
                        </span>{" "}
                        <span className="text-muted-foreground">
                            Followers
                        </span>
                    </div>
                </div>

                {/* Posts */}
                <div className="mt-6 border-t border-foreground/10 pb-8 pt-6">
                    <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                        Posts
                    </h2>

                    {posts.map((post: any) => (
                        <PostCard
                            key={post._id}
                            post={post}
                            currentUserId={user?._id ?? null}
                            currentUsername={user?.username}
                            currentUserImg={user?.profileImg}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}