import User from "../models/user.model"

import jwt from "jsonwebtoken"
import { JwtPayload } from "jsonwebtoken"
import { Request, Response, NextFunction } from "express"

interface MyJwtPayload extends JwtPayload {
    userId: string;
}

export async function protectRoute (req: Request, res: Response, next: NextFunction){
    try{
        const token = req.cookies.jwt
        if (!token) {
            return res.status(401).json({error: "Unauthorised: No token provided"})
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as MyJwtPayload
        if (!decoded){
            return res.status(401).json({ error: "Unauthorized: Invalid Token" })
        }

        const user = await User.findById(decoded.userId).select("-password")
        
        if (!user){
            return res.status(404).json({error: "User not found"})
        }

        req.user = user
        next()
        
    } catch (error){
        console.log("Error in protectRoute middleware", error);
		return res.status(500).json({ error: "Internal Server Error" });
    }
}