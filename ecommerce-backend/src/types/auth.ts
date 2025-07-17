export interface AuthUser {
    userId: string;
    email?: string;
    role: "customer" | "admin" | "seller";
}