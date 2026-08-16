import express from 'express'

import { protectRoute } from '../middleware/protectRoute'
import { getUserProfileById, getUserProfile, followUnfollowUser, getSuggestedUsers, updateUser } from '../controllers/user.controller'

export const userRouter = express.Router()

userRouter.get('/:id', protectRoute, getUserProfileById)
userRouter.get('/username/:username', protectRoute, getUserProfile)
userRouter.get('/suggested', protectRoute, getSuggestedUsers)
userRouter.post('/followUnfollow/:id', protectRoute, followUnfollowUser)
userRouter.post('/update', protectRoute, updateUser)