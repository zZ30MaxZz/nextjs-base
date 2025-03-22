export interface RequestLogin {
    username: string;
    password: string;
    remember?: boolean;
}

export interface RequestRefreshToken {
    refreshToken: string;
}

export interface LoginResponse {
    accessToken: string
    refreshToken: string
    tokenType: string
    expiresIn: number
    username: string
}

export interface RefreshTokenResponse {
    accessToken: string
    refreshToken: string
}