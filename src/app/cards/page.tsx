"use client"
import { Card } from "@/utils/interface/card.interface";
import useAuthApi from "@/lib/axiosClientAuthApi";
import { REWARDS_CARD_GETALL } from "@/services";
import { useSession } from "next-auth/react";
import { useCards } from "@/utils/useCards";

export default function CardsPage() {
    const { data: session, status } = useSession();
    const api = useAuthApi({ session, status });
    const { data: cards, isLoading, error } = useCards<Card[]>(
        api,
        REWARDS_CARD_GETALL,
        status === 'authenticated'
    );

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
                    {card.cardNumber}
                </div>
            ))}
        </div>
    );
}