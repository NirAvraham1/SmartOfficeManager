export interface User {
    username: string;
    token: string;
    role: string;
}

export interface UserFormValues {
    username: string;
    passwordHash: string;
    role?: string;
}