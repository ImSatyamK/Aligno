import express from 'express'
import dotenv from 'dotenv'

import connectDB from './db/connect.db'
import { authRouter } from './routes/auth.route'

dotenv.config()
const app = express()

app.use(express.json())
app.use('/api/auth', authRouter)

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