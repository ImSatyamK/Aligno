'use server'

import { instance } from "./base";
import axios from 'axios'

export async function getAllPosts() {
    try {
        const response = await instance.get('/api/post/all');
        return { success: true, data: response.data };
    } catch (error) {
        if (axios.isAxiosError(error)) {
            return { success: false, error: error.response?.data || error.message };
        }
        return { success: false, error: 'An unexpected error occurred' };
    }
}

export async function likeUnlikePost(id: string) {
    try {
        const response = await instance.post(`/api/post/like/${id}`);
        return { success: true, data: response.data };
    } catch (error) {
        if (axios.isAxiosError(error)) {
            return { success: false, error: error.response?.data || error.message };
        }
        return { success: false, error: 'An unexpected error occurred' };
    }
}

export async function commentOnPost(postId: string, text: string) {
    try {
        const response = await instance.post(`/api/post/comment/${postId}`, { text });
        return { success: true, data: response.data };
    } catch (error) {
        if (axios.isAxiosError(error)) {
            return { success: false, error: error.response?.data || error.message };
        }
        return { success: false, error: 'An unexpected error occurred' };
    }
}

export async function getUserPosts(userId: string){
    try{
        const response = await instance.get(`/api/post/userPosts/${userId}`);
        return { success: true, data: response.data };
    } catch (error) {
        if (axios.isAxiosError(error)) {
            return { success: false, error: error.response?.data || error.message };
        }
        return { success: false, error: 'An unexpected error occurred' };
    }
}