"use client"
import { Card } from "@/utils/interface/card.interface";
import useAuthApi from "@/lib/axiosClientAuthApi";
import { REWARDS_CARD_GETALL } from "@/services";
import { useSession } from "next-auth/react";
import { useCards } from "@/utils/Cards/useCards";
import { useCardDelete } from "@/utils/Cards/useCardDelete";
import { useState } from "react";
import { useCardRestore } from "@/utils/Cards/useCardRestore";

export default function CardsPage() {
    const { data: session, status } = useSession();
    const api = useAuthApi({ session, status });
    const [deletedId, setDeletedId] = useState<string | null>(null);

    const { data: cards, isLoading, error, getAllCards } = useCards<Card[]>(
        api,
        REWARDS_CARD_GETALL,
        status === 'authenticated'
    );

    const { deleteCard } = useCardDelete(api, status === 'authenticated');
    const { restoreCard } = useCardRestore(api, status === 'authenticated');

    const handleDelete = async (cardId: string) => {
        const success = await deleteCard(cardId);

        if (success) {
            await getAllCards();

            setDeletedId(cardId);
        }
    };

    const handleRestore = async (cardId: string) => {
        console.log(cardId);

        const success = await restoreCard(cardId);

        if (success) {
            await getAllCards();

            setDeletedId(null);
        }
    };

    if (status === "loading" || isLoading) {
        return <div>Loading cards...</div>;
    }

    if (status === "unauthenticated") {
        return <div>Please log in to view cards</div>;
    }

    if (error) {
        return <div className="error">{error}</div>;
    }

    return (
        <div>
            {cards.map(card => (
                <div key={card.cardId}>
                    <div>{card.cardId}</div>
                    <button onClick={() => handleDelete(card.cardId)}>Delete</button >
                </div>
            ))}
            {deletedId &&
                <button onClick={() => handleRestore(deletedId)}>Restore</button >
            }
        </div>
    );
}