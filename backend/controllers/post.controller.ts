import { Request, Response } from 'express'
import { v2 as claudinary } from 'cloudinary'

import User from '../models/user.model'
import Post from '../models/post.model'
import Notification from '../models/notification.model'


export async function createPost(req: Request, res: Response) {
    try {
        const { text } = req.body
        let { img } = req.body

        if (!req.user){
            return res.status(404).json({error: 'User not found'})
        }
        const user = await User.findById(req.user._id)
        if (!user){
            return res.status(404).json({error: 'User not found'})
        }

        if (!text && !img){
            return res.status(400).json('Post must have text or image')
        }

        if(img){
            const uploaded = await claudinary.uploader.upload(img, {folder: 'post_images'})
            img = uploaded.secure_url
        }

        const newPost = new Post({
            user: req.user._id,
            text,
            img
        })
        await newPost.save()
        res.status(200).json({message: 'Post created successfully'})
        
    } catch (error) {
        console.log(error)
        res.status(500).json({error: 'Internal server error'})
    }
}

export async function deletePost(req: Request, res: Response){
    try {
        const post = await Post.findById(req.params.id)
        if (!post) {
            return res.status(404).json({error: 'Post not found'})
        }
        if (!req.user){
            return res.status(404).json({error: 'User not found'})
        }
        if (post.user.toString() !== req.user._id.toString()){
            return res.status(404).json({error: "You are not authorized to delete this post"})
        }

        if (post.img){
            const publicId = getCloudinaryPublicId(post.img, 'post_images')
            await claudinary.uploader.destroy(publicId)
        }

        const { id } = req.params
        await Post.findByIdAndDelete(id)

        res.status(200).json({message: "Post deleted successfully"})

    } catch (error) {
        console.log(error)
        res.status(500).json({error: 'Internal server error'})
    }
}

function getCloudinaryPublicId(url: string, folder: string): string {
    const filename = url.split("/").pop()!.split(".")[0]
    return `${folder}/${filename}`
}

export async function likeUnlikePost(req: Request, res: Response){
    try {
        const { postId } = req.params
        const post = await Post.findById(postId)
        if (!post) {
            return res.status(404).json({error: 'Post not found'})
        }

        const user = await User.findById(req.user!._id)
        if (!user) {
            return res.status(404).json({error: 'User not found'})
        }

        const isLiked = post.likes.includes(req.user!._id)
        if (isLiked) {
            await Post.updateOne({_id: postId}, {$pull: {likes: req.user!._id}})
            await User.updateOne({_id: req.user!._id}, {$pull: {likes: postId}})
            res.status(200).json({message: 'Post unliked successfully'})
            
        } else {
            await Post.updateOne({_id: postId}, {$push: {likes: req.user!._id}})
            await User.updateOne({_id: req.user!._id}, {$push: {likes: postId}})

            const newNotification = new Notification({
                from: req.user!._id,
                to: post.user,
                message: `${user.username} liked your post`,
            })
            await newNotification.save()

            res.status(200).json({message: 'Post liked successfully'})
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({error: 'Internal server error'})
    }
}

export async function commentOnPost(req: Request, res: Response){
    try {
        const { postId } = req.params
        const { text } = req.body

        const post = await Post.findById(postId)
        if (!post) {
            return res.status(404).json({error: 'Post not found'})
        }

        const user = await User.findById(req.user!._id)
        if (!user) {
            return res.status(404).json({error: 'User not found'})
        }

        await Post.updateOne({_id: postId}, {$push: {comments: {text: text, user: req.user!._id}}})

        const newNotification = new Notification({
            from: req.user!._id,
            to: post.user,
            message: `${user.username} commented on your post`,
        })

        await newNotification.save()
        res.status(200).json({message: 'Comment added successfully'})
        
    } catch (error) {
        console.log(error)
        res.status(500).json({error: 'Internal server error'})
    }
}

export async function getAllPosts(req: Request, res: Response){
    try {
        const userId = req.user!._id
        const user = await User.findById(userId)
        if (!user) {
            return res.status(404).json({error: 'User not found'})
        }

        const posts = await Post.find().sort({ createdAt: -1 }).populate({
            path: 'user',
            select: 'username profileImg'
        }).populate({
            path: 'comments.user',
            select: 'username profileImg'
        })

        if (!posts) {
            return res.status(200).json([])
        }

        res.status(200).json({ posts })
    } catch (error) {
        console.log(error)
        res.status(500).json({error: 'Internal server error'})
    }
}

export async function getLikedPosts(req: Request, res: Response){
    try {
        const { userId } = req.params
        const user = await User.findById(userId)
        if (!user) {
            return res.status(404).json({error: 'User not found'})
        }

        const likedPosts = await Post.find({ _id: { $in: user.likes } }).sort({ createdAt: -1 }).populate({
            path: 'user',
            select: 'username profileImg'
        }).populate({
            path: 'comments.user',
            select: 'username profileImg'
        })

        res.status(200).json({ posts: likedPosts })
    } catch (error) {
        console.log(error)
        res.status(500).json({error: 'Internal server error'})
    }
}