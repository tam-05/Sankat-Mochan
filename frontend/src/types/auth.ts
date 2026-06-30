export interface LoginData {
    email: string;
    password: string;
    rememberMe?: boolean;
}

export interface LoginResponse {
    access_token: string;
    token_type: string;
    name: string;
    email: string;
}

export interface RegisterData {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
}