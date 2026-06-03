import express from 'express';

import { signup, login, logout } from '../controllers/auth.controller';

export const authRouter = express.Router()

authRouter.post('/signup', signup)
authRouter.post('/login', login)
authRouter.post('/logout', logout)