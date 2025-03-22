import { useState } from 'react';
import { AxiosInstance } from 'axios';
import { REWARDS_CARD_DELETE } from '@/services';

interface DeleteCardState {
    isLoading: boolean;
    error: string | null;
}

export const useCardDelete = (api: AxiosInstance | null, isAuthenticated: boolean) => {
    const [state, setState] = useState<DeleteCardState>({
        isLoading: false,
        error: null
    });

    const deleteCard = async (cardId: string) => {
        if (!api || !isAuthenticated) return false;

        setState({ isLoading: true, error: null });
        
        const url = REWARDS_CARD_DELETE.replace('_cardId', cardId);

        console.log(url)
        try {
            await api.delete(url);
            setState({ isLoading: false, error: null });
            return true;
        } catch {
            setState({ isLoading: false, error: "Failed to delete card" });
            return false;
        }
    };

    return {
        deleteCard,
        isLoading: state.isLoading,
        error: state.error
    };
};