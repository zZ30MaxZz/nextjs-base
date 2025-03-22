import { useState, useEffect, useRef } from 'react';
import { AxiosInstance } from 'axios';

interface FetchState<T> {
    data: T;
    isLoading: boolean;
    error: string | null;
}

export const useCards = <T>(
    api: AxiosInstance | null,
    url: string,
    isAuthenticated: boolean
) => {
    const [state, setState] = useState<FetchState<T>>({
        data: [] as T,
        isLoading: true,
        error: null
    });
    const fetchedRef = useRef(false);

    const fetchCards = async () => {
        if (!api || !isAuthenticated) return;

        setState(prev => ({ ...prev, isLoading: true, error: null }));
        try {
            const response = await api.get(url);
            setState({ data: response.data.data, isLoading: false, error: null });
        } catch {
            setState(prev => ({ ...prev, error: "Failed to fetch data", isLoading: false }));
        }
    };

    useEffect(() => {
        if (!api || !isAuthenticated || fetchedRef.current) return;

        fetchedRef.current = true;
        fetchCards();

        return () => {
            fetchedRef.current = false;
        };
    }, [api, url, isAuthenticated]);

    return {
        ...state,
        getAllCards: fetchCards
    };
};