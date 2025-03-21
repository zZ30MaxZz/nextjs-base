export interface RequestLogin {
    username: string;
    password: string;
    remember?: boolean;
}

export interface LoginResponse {
    accessToken: string
    refreshToken: string
    tokenType: string
    expiresIn: number
    username: string
}