import express from 'express'

import { protectRoute } from '../middleware/protectRoute'
import { getUserProfile, followUnfollowUser } from '../controllers/user.controller'

export const userRouter = express.Router()

userRouter.get('/profile/:username', protectRoute, getUserProfile)
// userRouter.get('/suggested', protectRoute, getSuggestedUsers)
userRouter.post('/followUnfollow/:id', protectRoute, followUnfollowUser)
// userRouter.post('/update', protectRoute, updateUserProfile)