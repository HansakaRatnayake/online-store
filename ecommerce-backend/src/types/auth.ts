export interface AuthUser {
    userId: string;
    email: string;
    role: "customer" | "admin" | "seller";
}

declare module "express" {
    interface Request {
        user?: AuthUser;
    }
}