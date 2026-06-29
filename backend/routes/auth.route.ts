import express from 'express';

import { signup, login, logout, getMe } from '../controllers/auth.controller';
import { protectRoute } from '../middleware/protectRoute';

export const authRouter = express.Router()

authRouter.get('/me', protectRoute, getMe)
authRouter.post('/signup', signup)
authRouter.post('/login', login)
authRouter.post('/logout', logout)