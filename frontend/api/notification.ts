'use server'

import { instance } from "./base";
import axios from 'axios'

export async function getNotifications() {
    try {
        const response = await instance.get(`/api/notification/`)
        return { success: true, data: response.data };
    } catch (error) {
        if (axios.isAxiosError(error)) {
            return { success: false, error: error.response?.data || error.message };
        }
        return { success: false, error: 'An unexpected error occurred' };
    }
}