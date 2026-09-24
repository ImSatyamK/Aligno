import { getUserById } from '@/api/user'
import { getUserPosts } from '@/api/post'
import Image from "next/image";
import Link from 'next/link'
import { Link as LinkIcon } from "lucide-react";
import { PostCard } from "@/components/post-card";
import { FollowSection } from "@/components/followSection"
import { getCurrentUser } from "@/api/auth"

export default async function UserPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const result = await getUserById(id)
    const postsResult = await getUserPosts(result.data?._id ?? "");
    const posts = postsResult.success ? postsResult.data.posts : [];
    const currentUser = await getCurrentUser();
    const isFollowing = currentUser.data.following.includes(id)
    if (!result.success) {
        return (
            <div className="px-4 py-10 text-center text-muted-foreground">
                Couldn't load your profile.
            </div>
        );
    }

    const user = result.data.user || result.data;

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
                {/* Avatar */}
                <div className="-mt-10 flex items-end justify-between">
                    <Image
                        src={user.profileImg || "/default_profile.webp"}
                        alt={user.username}
                        width={88}
                        height={88}
                        className="h-[88px] w-[88px] shrink-0 rounded-full border-4 border-background object-cover"
                    />
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
                {user.visibility === 'PUBLIC' || user._id === currentUser?.data?._id || currentUser?.data?.following.includes(id) ? (
                    <>
                        {/* Bio */}
                        {user.bio && (
                            <p className="mt-3 break-words whitespace-pre-wrap text-[15px] text-foreground [overflow-wrap:anywhere]">
                                {user.bio}
                            </p>
                        )}

                        {/* Website */}
                        {user.link && (
                            <Link
                                href={user.link}
                                target="_blank"
                                className="mt-2 flex w-fit max-w-full items-center gap-1.5 text-sm text-[#C08A2E] hover:underline"
                            >
                                <LinkIcon className="h-3.5 w-3.5 shrink-0" />

                                <span className="truncate">
                                    {user.link}
                                </span>
                            </Link>
                        )}

                        <FollowSection
                            followers={user.followers}
                            following={user.following}
                            id={id}
                            isFollowing={isFollowing}
                        />

                        {/* Posts */}
                        <div className="mt-6 border-t border-foreground/10 pb-8 pt-6">
                            <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                                Posts
                            </h2>

                            {posts.length > 0 ? posts.map((post: any) => (
                                <PostCard
                                    key={post._id}
                                    post={post}
                                    currentUserId={user?._id ?? null}
                                    currentUsername={user?.username}
                                    currentUserImg={user?.profileImg}
                                />
                            )) :
                                <span className='flex items-center justify-center mt-10'>No posts here</span>
                            }
                        </div>
                    </>
                    ) :
                    <span className='text-muted-foreground'>This Account is private.</span>
                }
            </div>
        </div>
    );
}