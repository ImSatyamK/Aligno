import { Request, Response } from 'express'
import bcryptjs from 'bcryptjs'

import User from '../models/user.model'
import { genTokenAndSetCookie } from '../lib/utils/generateToken'
import { error } from 'node:console'

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const USERNAME_REGEX = /^[a-zA-Z0-9_]{3,20}$/

function isValidEmail(email: string): boolean {
    return EMAIL_REGEX.test(email)
}

function isValidUsername(username: string): boolean {
    return USERNAME_REGEX.test(username)
}

interface SignupBody {
    name?: unknown
    username?: unknown
    email?: unknown
    password?: unknown
}

export async function signup(req: Request, res: Response): Promise<void> {
    try {
        const body = req.body as SignupBody

        if (
            typeof body.name !== 'string' ||
            typeof body.username !== 'string' ||
            typeof body.email !== 'string' ||
            typeof body.password !== 'string'
        ) {
            res.status(400).json({ error: 'Invalid input types' })
            return
        }

        const name     = body.name.trim().replace(/\s+/g, ' ')
        const username = body.username.trim().replace(/\s/g, '')
        const email    = body.email.trim().toLowerCase().replace(/\s/g, '')
        const password = body.password

        if (!name || !username || !email || !password) {
            res.status(400).json({ error: 'Please provide all required fields' })
            return
        }

        if (!isValidEmail(email)) {
            res.status(400).json({ error: 'Please provide a valid email address' })
            return
        }

        if (!isValidUsername(username)) {
            res.status(400).json({
                error: 'Username must be 3–20 characters and contain only letters, numbers, or underscores',
            })
            return
        }

        if (password.length < 6) {
            res.status(400).json({ error: 'Password must be at least 6 characters long' })
            return
        }

        const [emailExists, usernameExists] = await Promise.all([
            User.findOne({ email }).lean(),
            User.findOne({ username }).lean(),
        ])

        if (emailExists) {
            res.status(400).json({ error: 'Email already exists' })
            return
        }

        if (usernameExists) {
            res.status(400).json({ error: 'Username already taken' })
            return
        }

        const hashedPassword = await bcryptjs.hash(password, 10)

        const newUser = new User({
            name,
            username,
            email,
            password: hashedPassword,
        })

        await newUser.save()

        try {
            genTokenAndSetCookie(newUser._id, res)
        } catch (tokenError) {
            console.error('Token generation failed after signup:', tokenError)
            res.status(500).json({ error: 'Account created but authentication failed. Please log in.' })
            return
        }

        res.status(201).json({
            _id:       newUser._id,
            name:      newUser.name,
            username:  newUser.username,
            email:     newUser.email,
            profileImg: newUser.profileImg,
            coverImg:   newUser.coverImg,
            bio:        newUser.bio,
            link:       newUser.link,
            likes:      newUser.likes,
            followers:  newUser.followers,
            following:  newUser.following,
        })
    } catch (error) {
        console.error('Signup error:', error)
        res.status(500).json({ error: 'Internal server error' })
    }
}

export async function login(req:Request, res: Response) {
    try {
        let { username, password } = req.body
        if (
            typeof username !== 'string' ||
            typeof password !== 'string'
        ) {
            res.status(400).json({ error: 'Invalid input types' })
            return
        }
        username = username.trim().replace(/\s/g, '')

        if (!username || !password) {
            return res.status(400).json({error: 'Please enter username and password!'})
        }
        const user = await User.findOne({ username })
        if (!user) {
            return res.status(400).json({error: 'Invalid username or password!'})
        }
        const isPassword = await bcryptjs.compare(password, user.password)
        if (!isPassword) {
            return res.status(400).json({error: 'Invalid username or password!'})
        }

        try {
            genTokenAndSetCookie(user._id, res)
        } catch (tokenError) {
            console.error('Token generation failed:', tokenError)
            res.status(500).json({ error: 'Authentication failed. Please try again.' })
            return
        }

        res.status(200).json({
            _id:       user._id,
            name:      user.name,
            username:  user.username,
            email:     user.email,
            profileImg: user.profileImg,
            coverImg:   user.coverImg,
            bio:        user.bio,
            link:       user.link,
            likes:      user.likes,
            followers:  user.followers,
            following:  user.following,
        })
    } catch (error) {
        console.error('Login error:', error)
        res.status(500).json({ error: 'Internal server error' })
    }
}

export async function logout(req:Request, res: Response) {
    try{
        res.cookie('jwt', '', {maxAge:0})
        res.status(200).json('Logged out successfully')
    } catch (error) {
        console.log("Error logging out user", error)
        res.status(500).json({error: "Internal server error"})
    }
}