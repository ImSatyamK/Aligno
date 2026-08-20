import 'server-only'
import axios from 'axios';
import { cookies } from 'next/headers';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export const instance = axios.create({
    baseURL: BASE_URL,
    timeout: 10000
    
});

instance.interceptors.request.use(async (config) => {
    const cookieStore = await cookies();
    const token = cookieStore.get('jwt')?.value;

    if (token) {
        config.headers.Cookie = `jwt=${token}`;
    }

    return config;
});