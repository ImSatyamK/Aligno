import express from 'express'
import multer from 'multer'

import { protectRoute } from '../middleware/protectRoute'
import { getUserProfileById, getUserProfile, followUnfollowUser, getSuggestedUsers, updateUser } from '../controllers/user.controller'

const upload = multer({storage: multer.memoryStorage()})

export const userRouter = express.Router()

userRouter.get('/:id', protectRoute, getUserProfileById)
userRouter.get('/username/:username', protectRoute, getUserProfile)
userRouter.get('/suggested', protectRoute, getSuggestedUsers)
userRouter.post('/followUnfollow/:id', protectRoute, followUnfollowUser)
userRouter.post('/update', protectRoute, upload.fields([{ name: 'profileImg', maxCount: 1 }, { name: 'coverImg', maxCount: 1 }]), updateUser)