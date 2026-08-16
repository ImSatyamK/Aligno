// app/(protectedRoutes)/page.tsx
import { getCurrentUser } from "@/api/auth";
import { getAllPosts } from "@/api/post";
import { PostCard } from "@/components/post-card";

export default async function HomePage() {
    const [postsResult, userResult] = await Promise.all([
        getAllPosts(),
        getCurrentUser(),
    ]);

    if (!postsResult.success) {
        return <div className="px-4 py-10 text-center text-muted-foreground">Couldn't load posts.</div>;
    }

    const posts = postsResult.data.posts;
    const currentUser = userResult.success ? userResult.data : null;

    if (!posts || posts.length === 0) {
        return <div className="px-4 py-10 text-center text-muted-foreground">No posts yet. Be the first to share something.</div>;
    }

    return (
        <div className="max-w-xl mx-auto">
            {posts.map((post: any) => (
                <PostCard
                    key={post._id}
                    post={post}
                    currentUserId={currentUser?._id ?? null}
                    currentUsername={currentUser?.username}
                    currentUserImg={currentUser?.profileImg}
                />
            ))}
        </div>
    );
}