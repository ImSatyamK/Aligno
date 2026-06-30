import { Request, Response } from "express";

import User from '../models/user.model'


export async function getUserProfile(req:Request, res: Response) {
    const { username } = req.params

    try {
       const user = await User.findOne({username}).select('-password')
       if (!user){
        return res.status(404).json({error: `No user found of username: ${username}`})
       }
       res.status(200).json(user)
    } catch (error) {
        console.log({error: error})
        return res.status(500).json({error: 'Internal server error'})
    }
}