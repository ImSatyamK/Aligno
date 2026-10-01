'use client'

import { followUnfollowUser } from "@/api/user"
import { useState } from "react"
import { toast } from './ui/toast'

export function FollowSection({ followers, following, id, isFollowing, ownProfile, currentUserId }: { followers: string[], following: string[], id?: string, isFollowing?: boolean, ownProfile: boolean, currentUserId: string }) {
    const [follows, setFollows] = useState<boolean | undefined>(isFollowing)
    const [followerNums, setFollowerNums] = useState<number>(followers.length)
    const [userLabel, setUserLabel] = useState<string>('')
    const [users, setUsers] = useState<any[]>([])

    console.log(isFollowing, follows)
    const followUser = async (id: string | undefined) => {
        if (!id) return
        const result = await followUnfollowUser(id)
        if (!result.success) {
            toast.add({
                title: "Error following user",
                description: `Error: ${result.error}`,
                type: "error"
            })
            return
        }
        toast.add({
            title: `User ${follows ? 'unfollowed' : 'followed'} successfully`,
            type: "success"
        })
        if (follows) setFollowerNums((prev) => prev - 1)
        else setFollowerNums((prev) => prev + 1)
        setFollows(!follows)
    }

    return (
        <>
            <div className="mt-4 flex gap-6 text-sm">
                <div onClick={() => {
                    if (following.length > 0) {
                        setUsers(following)
                        setUserLabel('Following')
                    }
                }}>
                    <span className="font-semibold text-foreground">
                        {following.length ?? 0}
                    </span>{" "}
                    <span className="text-muted-foreground">
                        Following
                    </span>
                </div>

                <div onClick={() => {
                    if (followers.length > 0) {
                        setUsers(followers)
                        setUserLabel('Followers')
                    }
                }
                }>
                    <span className="font-semibold text-foreground">
                        {followerNums ?? 0}
                    </span>{" "}
                    <span className="text-muted-foreground">
                        Followers
                    </span>
                </div>

                {users.length > 0 && (
                    <div className="fixed bg-black/80 inset-0 z-50">
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-background p-6 border rounded-md shadow-lg w-80 flex flex-col items-center gap-4">
                            <div className="w-full flex justify-between items-center">
                                <span className="text-lg font-semibold text-foreground/50">{userLabel}</span>
                                <button onClick={() => {
                                    setUsers([])
                                }} className="text-muted-foreground hover:text-foreground">
                                    X
                                </button>
                            </div>
                            {users.map((user) => (
                                <a href={user._id !== currentUserId ? `/user/${user._id}` : '/profile'} key={user._id} className="w-full">
                                    <div key={user._id} className="flex items-center gap-4 w-full">
                                        <img src={user.profileImg || "/default_profile.webp"} alt={user.username} className="w-10 h-10 rounded-full" />
                                        <span className="text-sm font-medium text-foreground">@{user.username}</span>
                                    </div>
                                </a>
                            ))}
                        </div>
                    </div>
                )}
            </div>
            {!ownProfile && (
                <button
                    type="button"
                    className={`w-full mt-3 rounded-md ${follows ? `bg-background border border-[#C08A2E] text-[#C08A2E]` : `bg-[#C08A2E] text-white`} py-3 text-sm font-semibold hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition`}
                    onClick={() => followUser(id)}
                >
                    {follows ? 'UNFOLLOW' : 'FOLLOW'}
                </button>
            )}
        </>
    )
}