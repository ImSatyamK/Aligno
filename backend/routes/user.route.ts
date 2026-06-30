import express from 'express'

import { protectRoute } from '../middleware/protectRoute'
import { getUserProfile } from '../controllers/user.controller'

export const userRouter = express.Router()

userRouter.get('/profile/:username', protectRoute, getUserProfile)
// userRouter.get('/suggested', protectRoute, getSuggestedUsers)
// userRouter.post('/followUnfollow/:username', protectRoute, followUnfollowUser)
// userRouter.post('/update', protectRoute, updateUserProfile)