'use client'

import Image from "next/image";
import { Heart, MessageCircle, MoreHorizontal, Flag, Pencil, Trash2 } from "lucide-react";
import { likeUnlikePost, commentOnPost, deletePost } from "@/api/post";
import { useState, useRef } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import { toast } from "./ui/toast";
import { timeAgo } from "@/lib/timeAgo";

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

function PostMenu({
    isOwnPost,
    onReport,
    onEdit,
    onDelete,
    deleting,
    onClose,
    anchorRect,
}: {
    isOwnPost: boolean;
    onReport: () => void;
    onEdit: () => void;
    onDelete: () => void;
    deleting: boolean;
    onClose: () => void;
    anchorRect: DOMRect;
}) {
    const menuStyle: React.CSSProperties = {
        position: "fixed",
        top: anchorRect.bottom + 4,
        right: window.innerWidth - anchorRect.right,
    };

    return createPortal(
        <>
            <div className="fixed inset-0 z-40" onClick={onClose} />
            <div
                style={menuStyle}
                className="z-50 w-44 rounded-xl border border-foreground/10 bg-background shadow-lg overflow-hidden"
            >
                <button
                    onClick={onReport}
                    className="flex w-full items-center gap-2.5 px-3 py-2.5 text-sm text-foreground hover:bg-foreground/5 transition-colors"
                >
                    <Flag className="h-4 w-4 text-muted-foreground" />
                    Report
                </button>

                {isOwnPost && (
                    <>
                        <button
                            onClick={onEdit}
                            className="flex w-full items-center gap-2.5 px-3 py-2.5 text-sm text-foreground hover:bg-foreground/5 transition-colors"
                        >
                            <Pencil className="h-4 w-4 text-muted-foreground" />
                            Edit
                        </button>

                        <button
                            onClick={onDelete}
                            disabled={deleting}
                            className="flex w-full items-center gap-2.5 px-3 py-2.5 text-sm text-red-500 hover:bg-red-500/5 disabled:opacity-50 transition-colors"
                        >
                            <Trash2 className="h-4 w-4" />
                            {deleting ? "Deleting..." : "Delete"}
                        </button>
                    </>
                )}
            </div>
        </>,
        document.body
    );
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
    const router = useRouter();
    const isOwnPost = currentUserId != null && post.user?._id === currentUserId;

    const [liked, setLiked] = useState(currentUserId ? post.likes.includes(currentUserId) : false);
    const [likesCount, setLikesCount] = useState(post.likes.length);

    const [showComments, setShowComments] = useState(false);
    const [comments, setComments] = useState(post.comments);
    const [commentText, setCommentText] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const [showMenu, setShowMenu] = useState(false);
    const [menuRect, setMenuRect] = useState<DOMRect | null>(null);
    const [deleting, setDeleting] = useState(false);
    const menuButtonRef = useRef<HTMLButtonElement>(null);

    const toggleMenu = () => {
        if (!showMenu && menuButtonRef.current) {
            setMenuRect(menuButtonRef.current.getBoundingClientRect());
        }
        setShowMenu((v) => !v);
    };

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

    const handleDelete = async () => {
        setDeleting(true);
        const result = await deletePost(post._id);

        if (result.success) {
            toast.add({ title: "Post deleted", type: "success" });
            setShowMenu(false);
            router.refresh();
        } else {
            toast.add({
                title: "Error",
                description: typeof result.error === "string" ? result.error : "Failed to delete post",
                type: "error",
            });
        }
        setDeleting(false);
    };

    const handleEdit = () => {
        toast.add({ title: "Coming soon", description: "Editing posts isn't available yet.", type: "info" });
        setShowMenu(false);
    };

    const handleReport = () => {
        toast.add({ title: "Coming soon", description: "Reporting isn't available yet.", type: "info" });
        setShowMenu(false);
    };

    return (
        <article className="border-b border-foreground/10 px-4 py-4 overflow-hidden">
            <div className="flex gap-3">
                <Image
                    src={post.user?.profileImg || "/default_profile.webp"}
                    alt={post.user?.username || "User"}
                    width={40}
                    height={40}
                    className="h-10 w-10 shrink-0 rounded-full object-cover"
                />

                <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5 text-sm min-w-0">
                            <span className="font-semibold text-foreground truncate">
                                @{post.user?.username || "unknown"}
                            </span>
                            <span className="text-muted-foreground">·</span>
                            <span className="text-muted-foreground shrink-0">{timeAgo(post.createdAt)}</span>
                        </div>

                        <div className="shrink-0">
                            <button
                                ref={menuButtonRef}
                                onClick={toggleMenu}
                                aria-label="Post options"
                                className="flex h-7 w-7 items-center justify-center rounded-full text-muted-foreground hover:text-foreground hover:bg-foreground/5 transition-colors"
                            >
                                <MoreHorizontal className="h-4 w-4" />
                            </button>

                            {showMenu && menuRect && (
                                <PostMenu
                                    isOwnPost={isOwnPost}
                                    onReport={handleReport}
                                    onEdit={handleEdit}
                                    onDelete={handleDelete}
                                    deleting={deleting}
                                    onClose={() => setShowMenu(false)}
                                    anchorRect={menuRect}
                                />
                            )}
                        </div>
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
                            className={`flex items-center gap-1.5 text-sm transition-colors cursor-pointer ${liked ? "text-red-500" : "text-muted-foreground hover:text-red-500"
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
                                <div key={comment._id} className="flex gap-2 min-w-0">
                                    <Image
                                        src={comment.user?.profileImg || "/default_profile.webp"}
                                        alt={comment.user?.username || "User"}
                                        width={28}
                                        height={28}
                                        className="h-7 w-7 shrink-0 rounded-full object-cover"
                                    />
                                    <div className="text-sm min-w-0 [overflow-wrap:anywhere] break-all">
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