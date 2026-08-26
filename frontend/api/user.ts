'use server'

import { instance } from "./base";
import axios from 'axios'

export async function getUserById(id: string) {
    try {
        const response = await instance.get(`/api/user/${id}`)
        return { success: true, data: response.data };
    } catch (error) {
        if (axios.isAxiosError(error)) {
            return { success: false, error: error.response?.data || error.message };
        }
        return { success: false, error: 'An unexpected error occurred' };
    }
}

export async function updateUserProfile(formData: FormData) {
    try {
        const response = await instance.post('/api/user/update', formData);
        return { success: true, data: response.data };
    } catch (error) {
        if (axios.isAxiosError(error)) {
            return { success: false, error: error.response?.data || error.message };
        }
        return { success: false, error: 'An unexpected error occurred' };
    }
}