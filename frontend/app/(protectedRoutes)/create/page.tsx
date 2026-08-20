import CreatePostForm from '@/components/createPost.component'

export default function CreatePostPage() {
    return (
        <div className="max-w-xl mx-auto p-4">
            <h1 className="text-xl font-semibold mb-4">Create Post</h1>
            <CreatePostForm />
        </div>
    )
}