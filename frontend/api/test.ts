'use server'

import { instance } from "./base";
import axios from "axios";

export interface ITest {
    _id?: string,
    title: string,
    description?: string,
    instructions?: string,
    duration: number,
    questions: {
        question: string,
        options: string[],
        correctOption: number
    }[],
    questionCount?: number,
    correctMarks: number,
    negativeMarks: number,
    visibility?: "PUBLIC" | "PRIVATE",
}


export async function createTest(payload: ITest) {
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
        const response = await instance.get("/api/test/mine");
        return { success: true, data: response.data };
    }catch(error){
        if (axios.isAxiosError(error)) {
            return { success: false, error: error.response?.data || error.message };
        }
        return { success: false, error: 'An unexpected error occurred' };
    }
}

export async function getPublicTests() {
    try{
        const response = await instance.get("/api/test/public");
        return { success: true, data: response.data };
    }catch(error){
        if (axios.isAxiosError(error)) {
            return { success: false, error: error.response?.data || error.message };
        }
        return { success: false, error: 'An unexpected error occurred' };
    }
}

export async function getTestDetail(testId: string) {
    try{
        const response = await instance.get(`/api/test/${testId}`);
        return { success: true, data: response.data };
    }catch(error){
        if (axios.isAxiosError(error)) {
            return { success: false, error: error.response?.data || error.message };
        }
        return { success: false, error: 'An unexpected error occurred' };
    }
}

export async function updateTest(testId: string, payload: ITest) {
    try{
        const response = await instance.put(`/api/test/${testId}`, payload);
        return { success: true, data: response.data };
    }catch(error){
        if (axios.isAxiosError(error)) {
            return { success: false, error: error.response?.data || error.message };
        }
        return { success: false, error: 'An unexpected error occurred' };
    }
}

export async function deleteTest(testId: string) {
    try{
        const response = await instance.delete(`/api/test/${testId}`);
        return { success: true, data: response.data };
    }catch(error){
        if (axios.isAxiosError(error)) {
            return { success: false, error: error.response?.data || error.message };
        }
        return { success: false, error: 'An unexpected error occurred' };
    }
}