'use client'

import { followUnfollowUser } from "@/api/user"
import { useState } from "react"
import { toast } from './ui/toast'

export function FollowSection({ followers, following, id, isFollowing }: { followers: string[], following: string[], id: string, isFollowing: boolean }) {
    const [follows, setFollows] = useState<boolean>(isFollowing)
    const [followerNums, setFollowerNums] = useState<number>(followers.length)

    const followUser = async (id: string) => {
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
            title: `User ${follows? 'unfollowed' : 'followed'} successfully`,
            type: "success"
        })
        if (follows) setFollowerNums((prev) => prev - 1)
        else setFollowerNums((prev) => prev + 1)
        setFollows(!follows)
    }

    return (
        <>
            <div className="mt-4 flex gap-6 text-sm">
                <div>
                    <span className="font-semibold text-foreground">
                        {following.length ?? 0}
                    </span>{" "}
                    <span className="text-muted-foreground">
                        Following
                    </span>
                </div>

                <div>
                    <span className="font-semibold text-foreground">
                        {followerNums ?? 0}
                    </span>{" "}
                    <span className="text-muted-foreground">
                        Followers
                    </span>
                </div>
            </div>
            <button
                type="button"
                className="w-full mt-3 rounded-md bg-[#C08A2E] py-3 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition"
                onClick={() => followUser(id)}
            >
                {follows ? 'UNFOLLOW' : 'FOLLOW'}
            </button>
        </>
    )
}