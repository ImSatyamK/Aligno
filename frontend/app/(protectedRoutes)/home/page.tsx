'use client';

import { signOut } from "@/api/auth";

export default function HomePage() {
    return (
        <>
            <h1>Home Page</h1>
            <p>Welcome to the home page!</p>
            <button onClick={signOut}>Logout</button>
        </>
    )
}