import "next-auth"

declare module "next-auth" {
    interface User {
        id: string
        email: string
        name: string
        accessToken: string
        refreshToken: string
    }

    interface Session {
        accessToken: string
        refreshToken: string
        user: User
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        accessToken: string
        refreshToken: string
        iat: number
        exp: number
    }
}