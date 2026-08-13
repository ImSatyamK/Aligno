import { Types } from 'mongoose'
import { Response } from 'express'

import jwt from 'jsonwebtoken'

export function genTokenAndSetCookie(userId: Types.ObjectId, res: Response) {
    const token = jwt.sign({userId}, process.env.JWT_SECRET!, {
        expiresIn: '15d'
    })

    return token
}