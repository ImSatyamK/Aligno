import CreatePostForm from '@/components/createPost.component'
import { getCurrentUser } from '@/api/auth'



export default async function CreatePostPage() {
    const currentUser = await getCurrentUser()
    const currentUsername = currentUser?.data.username || null
    const currentUserImg = currentUser?.data.profileImg || null

    return (
        <div className="max-w-xl mx-auto p-4">
            <h1 className="text-xl font-semibold mb-4">Create Post</h1>
            <CreatePostForm 
                currentUsername={currentUsername}
                currentUserImg={currentUserImg}
            />
        </div>
    )
}