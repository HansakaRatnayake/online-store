import { AuthUser } from "./auth";

declare module "express" {
    interface Request {
        user?: AuthUser;
        file?: any; // Add multer file property
    }
}