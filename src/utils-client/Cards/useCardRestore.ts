import { useState } from 'react';
import { AxiosInstance } from 'axios';
import { REWARDS_CARD_RESTORE } from '@/services';

interface RestoreCardState {
    isLoading: boolean;
    error: string | null;
}

export const useCardRestore = (api: AxiosInstance | null, isAuthenticated: boolean) => {
    const [state, setState] = useState<RestoreCardState>({
        isLoading: false,
        error: null
    });

    const restoreCard = async (cardId: string) => {
        if (!api || !isAuthenticated) return false;

        setState({ isLoading: true, error: null });
        
        const url = REWARDS_CARD_RESTORE.replace('_cardId', cardId);

        try {
            await api.patch(url);
            setState({ isLoading: false, error: null });
            return true;
        } catch {
            setState({ isLoading: false, error: "Failed to delete card" });
            return false;
        }
    };

    return {
        restoreCard: restoreCard,
        isLoading: state.isLoading,
        error: state.error
    };
};