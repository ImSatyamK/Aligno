import { Request, Response } from "express";

import User from '../models/user.model'


export async function getUserProfile(req: Request, res: Response) {
    const { username } = req.params

    try {
        const user = await User.findOne({ username }).select('-password')
        if (!user) {
            return res.status(404).json({ error: `No user found of username: ${username}` })
        }
        res.status(200).json(user)
    } catch (error) {
        console.log({ error: error })
        return res.status(500).json({ error: 'Internal server error' })
    }
}

export async function followUnfollowUser(req: Request, res: Response) {
    try {
        const { id } = req.params
        if (!req.user) {
            return res.status(400).json('Login first')
        }
        const currentUser = await User.findById(req.user._id).select('-password')
        const userToModify = await User.findById(id).select('-password')

        if (!userToModify || !currentUser) {
            return res.status(404).json('User not found')
        }
        if (currentUser._id.toString() === userToModify._id.toString()) {
            return res.status(400).json({ error: "You can't follow/unfollow yourself" })
        }

        const isFollowing = currentUser.following.includes(userToModify._id)
        if (isFollowing) {
            await User.findByIdAndUpdate(currentUser._id, {$pull: {following: userToModify._id}})
            await User.findByIdAndUpdate(userToModify._id, {$pull: {followers: currentUser._id}})
            res.status(200).json({ message: "User unfollowed successfully" })
        } else {
            await User.findByIdAndUpdate(currentUser._id, {$push: {following: userToModify._id}})
            await User.findByIdAndUpdate(userToModify._id, {$push: {followers: currentUser._id}})
            res.status(200).json({ message: "User followed successfully" })
        }
    } catch (error) {
        console.log({ error: error })
        return res.status(500).json({ error: 'Internal server error' })
    }

}