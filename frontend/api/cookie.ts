'use server';

import { cookies } from 'next/headers';

const cookieOptions = {
    maxAge: 15 * 24 * 60 * 60,
    httpOnly: true,
    sameSite: 'strict' as const,
    secure: process.env.NODE_ENV !== 'development',
    path: '/',
};

export async function getCookie(name: string) {
    const cookieStore = await cookies();
    return cookieStore.get(name)?.value || null;
}

export async function setCookie(name: string, value: string) {
    const cookieStore = await cookies();

    cookieStore.set(name, value, cookieOptions);
}

export async function deleteCookie(name: string) {
    const cookieStore = await cookies();
    cookieStore.delete(name);
}