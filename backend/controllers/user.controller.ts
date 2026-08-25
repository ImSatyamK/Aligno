import { Request, Response } from "express";
import bcryptjs from 'bcryptjs'
import { v2 as cloudinary } from 'cloudinary'

import User from '../models/user.model'
import Notification from '../models/notification.model'

export async function getUserProfileById(req: Request, res: Response) {
    const { id } = req.params
    try {
        const user = await User.findById(id).select('-password')
        if (!user) {
            return res.status(404).json({ error: `No user found of id: ${id}` })
        }
        res.status(200).json(user)
    } catch (error) {
        console.log({ error: error })
        return res.status(500).json({ error: 'Internal server error' })
    }
}

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
            await User.findByIdAndUpdate(currentUser._id, { $pull: { following: userToModify._id } })
            await User.findByIdAndUpdate(userToModify._id, { $pull: { followers: currentUser._id } })
            res.status(200).json({ message: "User unfollowed successfully" })
        } else {
            await User.findByIdAndUpdate(currentUser._id, { $push: { following: userToModify._id } })
            await User.findByIdAndUpdate(userToModify._id, { $push: { followers: currentUser._id } })
            const newNotification = new Notification({
                from: currentUser._id,
                to: userToModify._id,
                message: `${currentUser.username} started following you`
            })
            await newNotification.save()

            res.status(200).json({ message: "User followed successfully" })
        }
    } catch (error) {
        console.log({ error: error })
        return res.status(500).json({ error: 'Internal server error' })
    }

}

export async function getSuggestedUsers(req: Request, res: Response) {
    try {
        if (!req.user) {
            return res.status(400).json('Login first')
        }
        const currentUser = await User.findById(req.user._id).select('-password')
        if (!currentUser) {
            return res.status(404).json('User not found')
        }
        const suggestedUsers = await User.aggregate([
            { $match: { _id: { $nin: [...currentUser.following, currentUser._id] } } },
            { $sample: { size: 5 } },
            { $project: { password: 0 } }
        ])
        res.status(200).json(suggestedUsers)
    } catch (error) {
        console.log({ error: error })
        return res.status(500).json({ error: 'Internal server error' })
    }
}

export async function updateUser(req: Request, res: Response) {
    try {
        if (!req.user) {
            return res.status(400).json('Login first')
        }

        const currentUser = await User.findById(req.user._id)
        if (!currentUser) {
            return res.status(404).json('User not found')
        }

        const { name, username, email, currPassword, newPassword, bio, link } = req.body
        const f = req.files as { profileImg?: Express.Multer.File[], coverImg?: Express.Multer.File[] }
        let profileImg = f.profileImg?.[0]?.buffer
        let coverImg = f.coverImg?.[0]?.buffer

        let hashedPassword: string | undefined

        if (currPassword || newPassword) {
            if (!currPassword || !newPassword) {
                return res.status(400).json({ error: 'Both current and new password are required to change password' })
            }

            const isMatch = await bcryptjs.compare(currPassword, currentUser.password)
            if (!isMatch) {
                return res.status(400).json({ error: 'Incorrect Password' })
            }

            if (currPassword === newPassword) {
                return res.status(400).json({ error: 'New password cannot be the same as the current password' })
            }

            if (newPassword.length < 6) {
                return res.status(400).json({ error: 'New password must be at least 6 characters long' })
            }

            hashedPassword = await bcryptjs.hash(newPassword, 10)
        }

        if (profileImg) {
            if (currentUser.profileImg) {
                const publicId = getCloudinaryPublicId(currentUser.profileImg, 'profile_images')
                await cloudinary.uploader.destroy(publicId)
            }
            const upload = await new Promise<any>((resolve, reject) => {
                cloudinary.uploader.upload_stream(
                    { folder: 'profile_images' },
                    (err, result) => err ? reject(err) : resolve(result)
                ).end(profileImg)
            })
            profileImg = upload.secure_url
        }

        if (coverImg) {
            if (currentUser.coverImg) {
                const publicId = getCloudinaryPublicId(currentUser.coverImg, 'cover_images')
                await cloudinary.uploader.destroy(publicId)
            }
            const upload = await new Promise<any>((resolve, reject) => {
                cloudinary.uploader.upload_stream(
                    { folder: 'cover_images' },
                    (err, result) => err ? reject(err) : resolve(result)
                ).end(coverImg)
            })
            coverImg = upload.secure_url
        }

        const updatedUser = await User.findByIdAndUpdate(
            currentUser._id,
            {
                name: name || currentUser.name,
                username: username || currentUser.username,
                email: email || currentUser.email,
                password: hashedPassword || currentUser.password,
                bio: bio || currentUser.bio,
                link: link || currentUser.link,
                profileImg: profileImg || currentUser.profileImg,
                coverImg: coverImg || currentUser.coverImg
            },
            { returnDocument: 'after' }
        ).select('-password')

        res.status(200).json(updatedUser)
    } catch (error) {
        console.log({ error: error })
        return res.status(500).json({ error: 'Internal server error' })
    }
}

function getCloudinaryPublicId(url: string, folder: string): string {
    const filename = url.split("/").pop()!.split(".")[0]
    return `${folder}/${filename}`
}