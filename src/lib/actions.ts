"use server";
import { auth, signIn } from "@/auth";
import { AuthError } from "next-auth";

export async function login(username: string, password: string) {
    try {
        await signIn("credentials", {
            username,
            password,
            redirect: false,
        });

        const session = await auth(); // Obtiene la sesión actualizada

        if (!session) {
            return { success: false, error: "Could not retrieve session" };
        }

        return { success: true, session };
    } catch (error) {
        if (error instanceof AuthError && error.type === "CredentialsSignin") {
            return { success: false, error: "Invalid credentials" };
        }

        console.error("Unexpected error in login:", error);
        return { success: false, error: "An unexpected error occurred" };
    }
}
