import { RefreshTokenResponse, RequestRefreshToken } from "@/interfaces/auth.interface";
import { REWARDS_REFRESH } from ".";
import axios, { AxiosError } from "axios";
import { Wrapper } from "@/interfaces/wrapper.interface";

const NEXT_PUBLIC_BASE_PUBLIC_URL = process.env.NEXT_PUBLIC_BASE_PUBLIC_URL || '';

export default async function refreshTokenHandler(request: RequestRefreshToken) {
    try {
        const url = `${NEXT_PUBLIC_BASE_PUBLIC_URL}${REWARDS_REFRESH}`;

        let refreshResponse: Wrapper<RefreshTokenResponse> | null = null;

        const config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: url,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${request?.refreshToken}`
            },
        };

        try {
            const response = await axios.request(config);

            if (response.status === 200 && response.data) {
                refreshResponse = response.data as Wrapper<RefreshTokenResponse>;

                refreshResponse.code = response.status;

                return refreshResponse;
            } else {
                console.warn(`Respuesta inesperada con código: ${response.status}`);

                return null;
            }
        } catch (e) {
            const error = e as AxiosError;

            if (axios.isAxiosError(error)) {
                if (error && error.response) {
                    const data = error.response.data as Wrapper<string>;

                    console.error(`Error HTTP ${error.response.status}:`, error.response.data);

                    if (error.response.status === 400) {
                        const jsonResponse = {
                            code: data.code,
                            message: data.message,
                            data: data.data
                        }

                        return jsonResponse;
                    }

                    if (error.response.status === 401) {
                        throw new Error("Unauthorized: Invalid credentials");
                    }
                } else {
                    console.error("Error sin respuesta del servidor:", error.message);
                }
            } else {
                console.error("Error desconocido:", error);
            }

            return null;
        }
    } catch (e) {
        const error = e as AxiosError;
        console.log(error)

        return null
    }
}