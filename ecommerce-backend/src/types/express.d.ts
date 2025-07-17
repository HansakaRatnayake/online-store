import { AuthUser } from "./auth";

declare module "express" {
    interface Request {
        user?: AuthUser;
    }
}