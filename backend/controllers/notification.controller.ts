import { Request, Response } from "express";

import User from "../models/user.model";
import Notification from "../models/notification.model";

export async function getAllNotifications(req: Request, res: Response){
    try {
        const userId = req.user!._id
        const user = await User.findById(userId)
        if (!user) {
            return res.status(404).json({error: 'User not found'})
        }

        const notifications = await Notification.find({ to: userId }).sort({ createdAt: -1 }).populate({
            path: 'from',
            select: 'username profileImg'
        })

        await Notification.updateMany({ to: userId}, { read: true })

        if (!notifications) {
            return res.status(200).json([])
        }

        res.status(200).json({ notifications })
    } catch (error) {
        console.log(error)
        res.status(500).json({error: 'Internal server error'})
    }
}

export async function deleteNotifications(req: Request, res: Response){
    try {
        const userId = req.user!._id
        const user = await User.findById(userId)
        if (!user) {
            return res.status(404).json({error: 'User not found'})
        }

        await Notification.deleteMany({ to: userId })

        res.status(200).json({ message: 'Notifications deleted successfully' })
    } catch (error) {
        console.log(error)
        res.status(500).json({error: 'Internal server error'})
    }
}