import 'server-only'

import { REWARDS_CARD_GETALL } from "@/services";
import { Card } from "@/utils/interface/card.interface";
import { apiServer } from "@/utils/server/apiServer";
import { FC, PropsWithChildren } from "react";

const Layout: FC<PropsWithChildren> = async ({ children }) => {
    const response = await apiServer(REWARDS_CARD_GETALL);
    const cards = response?.code === 200 ? response.data as Card[] : [];

    if (response?.code !== 200) {
        console.error(response.message);
        return <div>Error: {response.message}</div>;
    }

    return (
        <main>
            {cards?.map(card => (
                <div key={card.cardId}>
                    {card.cardNumber}
                </div>
            ))}
            {children}
        </main>
    )
};

export default Layout;