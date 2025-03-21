"use client"
import { login } from "@/lib/actions"
import { useState } from "react"
// import { useRouter } from "next/navigation"

export default function LoginPage() {
    const [error, setError] = useState<string>("")
    // const router = useRouter()

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setError("")
        const formData = new FormData(e.currentTarget)

        try {
            const result = await login(
                formData.get("username") as string,
                formData.get("password") as string
            )

            if (!result.success) {
                setError(result.error || "Login failed")
            }
        } catch {
            setError("An unexpected error occurred")
        }
    }

    return (
        <form onSubmit={handleSubmit}>
            {error && (
                <div style={{ color: 'red', marginBottom: '1rem' }}>
                    {error}
                </div>
            )}
            <input name="username" type="text" required />
            <input name="password" type="password" required />
            <button type="submit">Login</button>
        </form>
    )
}