import { auth } from '@/auth';
import { Wrapper } from '@/interfaces/wrapper.interface';
import { axiosBase } from '@/lib/axios';
import { AxiosError, isAxiosError } from 'axios';

export async function apiServer<T>(url: string, method: string = 'GET', data?: T): Promise<Wrapper<T>> {
    const session = await auth();

    const config = {
        method: method,
        maxBodyLength: Infinity,
        url: url,
        headers: {
            'Authorization': `Bearer ${session?.accessToken}`
        },
        data: data
    };

    try {
        const response = await axiosBase.request(config);

        return {
            data: response.data.data,
            message: response.data.message,
            code: response.data.code,
        };
    } catch (e) {
        const error = e as AxiosError;

        if (isAxiosError(error) && error.response) {
            const responseData = error.response.data as Wrapper<string>;

            return {
                data: null,
                message: responseData.message || 'An error occurred',
                code: error.response.status
            };
        }

        return {
            data: null,
            message: 'Unknown error occurred',
            code: 500,
        };
    }
}