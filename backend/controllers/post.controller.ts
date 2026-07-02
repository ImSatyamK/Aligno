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
            const uploaded = await claudinary.uploader.upload(img)
            img = uploaded.secure_url
        }

        const newPost = new Post({
            user: req.user._id,
            text,
            img
        })
        await newPost.save()
        res.status(200).json('Post create successfully')
        
    } catch (error) {
        console.log(error)
        res.status(500).json({error: 'Internal server error'})
    }
}