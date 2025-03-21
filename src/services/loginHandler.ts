import { LoginResponse, RequestLogin } from "@/interfaces/auth.interface";
import { REWARDS_LOGIN } from ".";
import axios, { AxiosError } from "axios";
import { Wrapper } from "@/interfaces/wrapper.interface";

const BASE_PUBLIC_URL = process.env.BASE_PUBLIC_URL || '';

export default async function loginHandler(request: RequestLogin) {
    try {
        const url = `${BASE_PUBLIC_URL}${REWARDS_LOGIN}`;

        let loginResponse: Wrapper<LoginResponse> | null = null;

        const data = JSON.stringify({
            "email": request.username,
            "password": request.password
        });

        const config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: url,
            headers: {
                'Content-Type': 'application/json'
            },
            data: data
        };

        try {
            const response = await axios.request(config);

            if (response.status === 200 && response.data) {
                loginResponse = response.data as Wrapper<LoginResponse>;

                loginResponse.code = response.status.toString();

                return loginResponse;
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