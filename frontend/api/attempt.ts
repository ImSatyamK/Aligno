'use server'

import { instance } from "./base";
import axios from 'axios'

export async function startAttempt(testId: string) {
    try {
        const response = await instance.post(`/api/attempt/${testId}`);
        return { success: true, data: response.data };
    } catch (error) {
        if (axios.isAxiosError(error)) {
            return { success: false, error: error.response?.data || error.message };
        }
        return { success: false, error: 'An unexpected error occurred' };
    }
}

export async function getAttempt(attemptId: string) {
    try {
        const response = await instance.get(`/api/attempt/${attemptId}`);
        return { success: true, data: response.data };
    } catch (error) {
        if (axios.isAxiosError(error)) {
            return { success: false, error: error.response?.data || error.message };
        }
        return { success: false, error: 'An unexpected error occurred' };
    }
}

export async function saveAnswer(attemptId: string, questionIndex: number, answer: number, currentQuestion: number) {
    try {
        const response = await instance.put(`/api/attempt/${attemptId}`, { questionIndex, answer, currentQuestion });
        return { success: true, data: response.data };
    } catch (error) {
        if (axios.isAxiosError(error)) {
            return { success: false, error: error.response?.data || error.message };
        }
        return { success: false, error: 'An unexpected error occurred' };
    }
}

export async function clearAnswer(attemptId: string, questionIndex: number) {
    try {
        const response = await instance.delete(`/api/attempt/${attemptId}`, { data: { questionIndex } });
        return { success: true, data: response.data };
    } catch (error) {
        if (axios.isAxiosError(error)) {
            return { success: false, error: error.response?.data || error.message };
        }
        return { success: false, error: 'An unexpected error occurred' };
    }
}

export async function submitAttempt(attemptId: string, testId: string) {
    try {
        const response = await instance.put(`/api/attempt/${attemptId}/submit`, { testId });
        return { success: true, data: response.data };
    } catch (error) {
        if (axios.isAxiosError(error)) {
            return { success: false, error: error.response?.data || error.message };
        }
        return { success: false, error: 'An unexpected error occurred' };
    }
}