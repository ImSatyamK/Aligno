'use server'

import { instance } from "./base";
import axios from 'axios'
import { setCookie, deleteCookie } from "./cookie";

export async function signUp(name: string, username: string, email: string, password: string) {
    try {
        const response = await instance.post('/api/auth/signup', { name, username, email, password });
        const { accessToken, ...userData } = response.data;
        await setCookie('jwt', accessToken);
        return { success: true, data: userData };
    } catch (err) {
        if (axios.isAxiosError(err)) {
            return {
                success: false,
                message: err.response?.data?.error || err.message
            };
        }
        return { success: false, message: "An unexpected error occurred" };
    }
}

export async function signIn(username: string, password: string) {
    try {
        const response = await instance.post('/api/auth/login', { username, password });
        const { accessToken, ...userData } = response.data;
        await setCookie('jwt', accessToken);
        return { success: true, data: userData };
    } catch (err) {
        if (axios.isAxiosError(err)) {
            return {
                success: false,
                message: err.response?.data?.error || err.message
            };
        }
        return { success: false, message: "An unexpected error occurred" };
    }
}

export async function signOut() {
    try {
        await deleteCookie('jwt');
        return { success: true, data: "Logged out successfully" };
    } catch (err) {
        if (axios.isAxiosError(err)) {
            return {
                success: false,
                message: err.response?.data?.error || err.message
            };
        }
        return { success: false, message: "An unexpected error occurred" };
    }
}

export async function getCurrentUser() {
    try {
        const response = await instance.get('/api/auth/me');
        return { success: true, data: response.data };
    } catch (err) {
        if (axios.isAxiosError(err)) {
            return {
                success: false,
                message: err.response?.data?.error || err.message
            };
        }
        return { success: false, message: "An unexpected error occurred" };
    }
}