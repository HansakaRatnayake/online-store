import express, { Request, Response } from "express";
import {sendEmail} from "@/utils/emailservice";
import {newsletterThankYouTemplate} from "@/utils/templates/newsletterthanking";
import multer from "multer";

const upload = multer();

const router = express.Router();

// POST /api/subscribetonewsletter
router.post("/",upload.none(), async (req: Request, res: Response) => {
    try {

        const { email } = req.body;

        sendEmail(email, 'Thank You For Subscribing!', '', newsletterThankYouTemplate(email));

        res.status(201).json("Email Sent");
    } catch (error) {
        console.error("Error submitting to newsletter:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

export default router;