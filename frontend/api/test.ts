'use server'

import { instance } from "./base";
import axios from "axios";

interface IPayload {
    title: string,
    description?: string,
    duration: number,
    questions: {
        question: string,
        options: string[],
        correctOption: number
    }[],
    correctMarks: number,
    negativeMarks: number
}

export async function createTest(payload: IPayload) {
    try{
        const response = await instance.post("/api/test", payload);
        return { success: true, data: response.data };
    }catch(error){
        if (axios.isAxiosError(error)) {
            return { success: false, error: error.response?.data || error.message };
        } else {
            return { success: false, error: 'An unexpected error occurred' };
        }
    }
}

export async function getMyTests() {
    try{
        const response = await instance.get("/api/test");
        return { success: true, data: response.data };
    }catch(error){
        if (axios.isAxiosError(error)) {
            return { success: false, error: error.response?.data || error.message };
        }
        return { success: false, error: 'An unexpected error occurred' };
    }
}