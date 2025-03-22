import { useState } from 'react';
import { AxiosInstance } from 'axios';
import { REWARDS_CARD_REGISTER } from '@/services';
import { CardCreate } from '../../interfaces/cardCreate.interface';

interface PostCardState {
    isLoading: boolean;
    error: string | null;
}

export const useCardPost = (api: AxiosInstance | null, isAuthenticated: boolean) => {
    const [state, setState] = useState<PostCardState>({
        isLoading: false,
        error: null
    });

    const registerCard = async (card: CardCreate) => {
        if (!api || !isAuthenticated) return false;

        setState({ isLoading: true, error: null });

        try {
            await api.post(REWARDS_CARD_REGISTER, card);
            setState({ isLoading: false, error: null });
            return true;
        } catch {
            setState({ isLoading: false, error: "Failed to create card" });
            return false;
        }
    };

    return {
        registerCard,
        isLoading: state.isLoading,
        error: state.error
    };
};