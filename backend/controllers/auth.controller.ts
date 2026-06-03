import { Request, Response } from "express"

export async function signup(req: Request, res: Response) {
    const { name, username, email, password } = req.body
    res.json('you hit the signup endpoint')
}

export async function login(req: Request, res: Response) {
    const { email, password } = req.body
    res.json('you hit the login endpoint')
}

export async function logout(req: Request, res: Response) {
    const { name, username, email, password } = req.body
    res.json('you hit the logout endpoint')
}