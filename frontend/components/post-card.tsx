'use client'

import Image from "next/image";
import { Heart, MessageCircle } from "lucide-react";
import { likeUnlikePost, commentOnPost } from "@/api/post";
import { useState } from "react";
import { toast } from "./ui/toast";

interface PostUser {
    _id: string;
    username: string;
    profileImg?: string;
}

interface Comment {
    _id: string;
    text: string;
    user: PostUser;
}

interface Post {
    _id: string;
    text: string;
    img?: string;
    likes: string[];
    comments: Comment[];
    createdAt: string;
    user: PostUser;
}

export function PostCard({
    post,
    currentUserId,
    currentUsername,
    currentUserImg,
}: {
    post: Post;
    currentUserId: string | null;
    currentUsername?: string;
    currentUserImg?: string;
}) {
    const [liked, setLiked] = useState(currentUserId ? post.likes.includes(currentUserId) : false);
    const [likesCount, setLikesCount] = useState(post.likes.length);

    const [showComments, setShowComments] = useState(false);
    const [comments, setComments] = useState(post.comments);
    const [commentText, setCommentText] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const handleLike = async () => {
        const result = await likeUnlikePost(post._id);
        if (result.success) {
            setLikesCount((prev) => prev + (liked ? -1 : 1));
            setLiked(!liked);
        }
    };

    const handleAddComment = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!commentText.trim() || !currentUserId) return;

        setSubmitting(true);
        const result = await commentOnPost(post._id, commentText);

        if (result.success) {
            setComments((prev) => [
                ...prev,
                {
                    _id: `temp-${Date.now()}`,
                    text: commentText,
                    user: {
                        _id: currentUserId,
                        username: currentUsername || "you",
                        profileImg: currentUserImg,
                    },
                },
            ]);
            setCommentText("");
            toast.add({ title: "Comment added successfully!", type: "success" });
        }
        setSubmitting(false);
    };

    return (
        <article className="border-b border-foreground/10 px-4 py-4">
            <div className="flex gap-3">
                <Image
                    src={post.user?.profileImg || "/default_profile.webp"}
                    alt={post.user?.username || "User"}
                    width={40}
                    height={40}
                    className="h-10 w-10 shrink-0 rounded-full object-cover"
                />

                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 text-sm">
                        <span className="font-semibold text-foreground truncate">
                            @{post.user?.username || "unknown"}
                        </span>
                        <span className="text-muted-foreground">·</span>
                        <span className="text-muted-foreground">{post.createdAt}</span>
                    </div>

                    <p className="mt-1 text-[15px] text-foreground whitespace-pre-wrap break-words">
                        {post.text}
                    </p>

                    {post.img && (
                        <div className="mt-3 overflow-hidden rounded-xl border border-foreground/10">
                            <Image
                                src={post.img}
                                alt=""
                                width={600}
                                height={400}
                                className="w-full h-auto object-cover"
                            />
                        </div>
                    )}

                    <div className="mt-3 flex items-center gap-6 text-muted-foreground">
                        <button
                            onClick={handleLike}
                            className={`flex items-center gap-1.5 text-sm transition-colors cursor-pointer ${
                                liked ? "text-red-500" : "text-muted-foreground hover:text-red-500"
                            }`}
                        >
                            <Heart className={`h-4 w-4 ${liked ? "fill-red-500" : "fill-none"}`} />
                            {likesCount}
                        </button>

                        <button
                            onClick={() => setShowComments((v) => !v)}
                            className="flex items-center gap-1.5 text-sm hover:text-[#C08A2E] transition-colors cursor-pointer"
                        >
                            <MessageCircle className="h-4 w-4" />
                            {comments.length}
                        </button>
                    </div>

                    {showComments && (
                        <div className="mt-3 border-t border-foreground/10 pt-3 space-y-3">
                            {comments.map((comment) => (
                                <div key={comment._id} className="flex gap-2">
                                    <Image
                                        src={comment.user?.profileImg || "/default_profile.webp"}
                                        alt={comment.user?.username || "User"}
                                        width={28}
                                        height={28}
                                        className="h-7 w-7 shrink-0 rounded-full object-cover"
                                    />
                                    <div className="text-sm">
                                        <span className="font-semibold text-foreground">
                                            @{comment.user?.username || "unknown"}
                                        </span>{" "}
                                        <span className="text-foreground">{comment.text}</span>
                                    </div>
                                </div>
                            ))}

                            {currentUserId && (
                                <form onSubmit={handleAddComment} className="flex gap-2 pt-1">
                                    <input
                                        value={commentText}
                                        onChange={(e) => setCommentText(e.target.value)}
                                        placeholder="Add a comment..."
                                        className="flex-1 rounded-md border border-input bg-background text-foreground px-3 py-1.5 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-[#C08A2E]"
                                    />
                                    <button
                                        type="submit"
                                        disabled={submitting || !commentText.trim()}
                                        className="rounded-md bg-[#C08A2E] px-3 py-1.5 text-sm font-medium text-white disabled:opacity-50 transition"
                                    >
                                        Post
                                    </button>
                                </form>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </article>
    );
}