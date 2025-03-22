"use client";
import { useEffect, useRef } from "react";
import { axiosBase } from "./axios";
import { Session } from "next-auth";

interface AuthApiProps {
    session: Session | null;
    status: string;
}

const useApiClientAuth = ({ session, status }: AuthApiProps) => {
    const interceptorRef = useRef<number | null>(null);

    useEffect(() => {
        if (interceptorRef.current !== null) {
            axiosBase.interceptors.request.eject(interceptorRef.current);
        }
        interceptorRef.current = axiosBase.interceptors.request.use(
            (config) => {
                if (!config.headers["Authorization"] && session?.accessToken) {
                    config.headers["Authorization"] = `Bearer ${session.accessToken}`;
                }
                return config;
            },
            (error) => Promise.reject(error)
        );

        return () => {
            if (interceptorRef.current !== null) {
                axiosBase.interceptors.request.eject(interceptorRef.current);
            }
        };
    }, [session]);

    if (status === "loading" || !session?.accessToken) {
        return null;
    }

    return axiosBase;
};

export default useApiClientAuth;