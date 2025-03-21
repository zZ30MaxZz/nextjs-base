"use client";

import { ReactNode } from "react";
import { SessionProvider } from "next-auth/react";
interface Props {
    children: ReactNode;
}

const NextSession = ({ children }: Props) => {
    return <SessionProvider>{children}</SessionProvider>;
};

export default NextSession;