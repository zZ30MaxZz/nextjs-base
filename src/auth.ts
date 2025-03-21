import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { Session } from "next-auth"
import { JWT } from "next-auth/jwt"
import { LoginResponse, RequestLogin } from "./interfaces/auth.interface";
import loginHandler from "./services/loginHandler";
import { Wrapper } from "./interfaces/wrapper.interface";

export const { handlers, signIn, signOut, auth } = NextAuth({
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                username: { label: "Username", type: "text" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                if (!credentials?.username || !credentials?.password) {
                    console.error("Missing credentials");
                    return null;
                }

                try {
                    const authLogisn: RequestLogin = {
                        username: credentials.username as string,
                        password: credentials.password as string
                    };

                    const result = await loginHandler(authLogisn);

                    if (!result || result.code !== 200) {
                        console.error("Login failed:", result?.message || "No response");
                        return null;
                    }

                    const data = result as Wrapper<LoginResponse>;

                    if (!data.data) {
                        console.error("Login failed:", result?.message || "No response");
                        return null;
                    }
                    return {
                        id: data.data.username,
                        email: data.data.username,
                        name: data.data.username,
                        accessToken: data.data.accessToken,
                        refreshToken: data.data.refreshToken
                    };
                } catch (error) {
                    console.error("Login error:", error);
                    return null;
                }
            }
        })
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.accessToken = user.accessToken ?? "";
                token.refreshToken = user.refreshToken ?? "";
            }
            return token;
        },
        async session({ session, token }: { session: Session, token: JWT }) {
            return {
                ...session,
                user: {
                    ...session.user,
                    email: session.user?.email ?? "", // Asegura que email no sea undefined
                },
                accessToken: token.accessToken ?? "",
                refreshToken: token.refreshToken ?? "",
            };
        }
    },
    pages: {
        signIn: '/login',  // Custom login page path
    },
    session: {
        strategy: "jwt",
    },
    logger: {
        error(error) {
            if ((error)?.message !== "CredentialsSignin") {
                console.error("NextAuth Error:", error);
            }
        },
        warn(code: string) {
            console.warn("NextAuth Warning:", code);
        },
        // debug(code: string) {
        //     console.debug("NextAuth Debug:", code);
        // }
    }
})