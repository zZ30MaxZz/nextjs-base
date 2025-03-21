import axios from "axios";
const BASE_URL = process.env.NEXT_PUBLIC_BASE_PUBLIC_URL || '';

export const axiosBase = axios.create({
    baseURL: BASE_URL,
    headers: { "Content-Type": "application/json" },
});