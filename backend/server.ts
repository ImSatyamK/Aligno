import express from 'express'
import dotenv from 'dotenv'
import cookieParser from "cookie-parser"
import {v2 as cloudinary} from 'cloudinary'
import cors from 'cors'

import connectDB from './db/connect.db'
import { authRouter } from './routes/auth.route'
import { userRouter } from './routes/user.route'
import { postRouter } from './routes/post.route'
import { notificationRouter } from './routes/notification.route'
import { testRouter } from './routes/test.route'

dotenv.config()
const app = express()

app.use(cors({
    origin: process.env.NODE_ENV === 'production' 
        ? process.env.FRONTEND_URL 
        : 'http://localhost:3000',
    credentials: true,
}))

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})

app.use('/api/auth', authRouter)
app.use('/api/user', userRouter)
app.use('/api/post', postRouter)
app.use('/api/notification', notificationRouter)
app.use('/api/test', testRouter)

const PORT = process.env.PORT || 5000

const startServer = async () => {
    try {
        await connectDB()
        
        app.listen(PORT, () => {
            console.log(`Server running on PORT ${PORT}`)
        })
    } catch (error) {
        console.error(`Error starting server: ${error instanceof Error? error.message: error }`)
        process.exit(1)
    }
    
}

startServer()