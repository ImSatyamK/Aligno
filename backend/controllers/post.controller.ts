import { Request, Response } from 'express'
import { v2 as claudinary } from 'cloudinary'

import User from '../models/user.model'
import Post from '../models/post.model'


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