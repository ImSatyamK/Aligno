import { Request, Response, NextFunction } from 'express';
import Attempt from '../models/attempt.model';

export async function verifyDuration(req: Request, res: Response, next: NextFunction) {
    try {
        const { id } = req.params;
        const attempt = await Attempt.findById(id);
        if (!attempt) {
            return res.status(404).json({ message: 'Attempt not found' });
        }
        const endTime = attempt.endsAt;
        const currentTime = new Date();
        if (currentTime > endTime) {
            attempt.status = 'SUBMITTED';
            attempt.submittedAt = endTime;
            await attempt.save();
            return res.status(400).json({ message: 'Attempt duration has expired' });
        }
        next();
    } catch (error) {
        res.status(500).json({ message: 'Error verifying attempt duration' });
    }
}