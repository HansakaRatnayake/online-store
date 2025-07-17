import express, { Request, Response } from "express";
import Stripe from "stripe";
import connectToDatabase from "@/utils/mongodb";
import { Payment } from "@/models/Payment";
import { AuthUser } from "@/types/auth";
import {authenticate, isCustomer} from "@/middleware/auth";

const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_51RlsgVR0RiESnN3nKU1rfe0ax05DdaIa5RdidxyTd4TG002GyaXACniMdsXSGeu22RY3yPHmozeOxk9qwDURufAS001Ts7nepf', { apiVersion: "2025-06-30.basil"});

// POST /api/payments/create-payment-intent - Create Stripe payment intent
router.post("/create-payment-intent", authenticate, isCustomer, async (req: Request, res: Response) => {
    try {
        await connectToDatabase();
        const { amount } = req.body;
        const userId = (req.user as AuthUser).userId;

        if (!amount || amount < 50) {
            return res.status(400).json({ error: "Invalid amount" });
        }

        const paymentIntent = await stripe.paymentIntents.create({
            amount,
            currency: "usd",
            metadata: { userId },
        });

        await Payment.create({
            userId,
            paymentIntentId: paymentIntent.id,
            amount: amount / 100,
            currency: "usd",
            status: paymentIntent.status,
        });

        res.json({ clientSecret: paymentIntent.client_secret });
    } catch (error) {
        console.error("Error creating payment intent:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// POST /api/payments/webhook - Handle Stripe webhook
router.post(
    "/webhook",
    express.raw({ type: "application/json" }),
    async (req: Request, res: Response) => {
        const sig = req.headers["stripe-signature"] as string;
        const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET! || 'whsec_AR4M2qL8sqE84Yge5XAVSAa1L8Y8hUH8';

        try {
            const event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
            await connectToDatabase();

            if (event.type === "payment_intent.succeeded") {
                const paymentIntent = event.data.object as Stripe.PaymentIntent;
                await Payment.updateOne(
                    { paymentIntentId: paymentIntent.id },
                    { status: paymentIntent.status }
                );
            } else if (event.type === "payment_intent.payment_failed") {
                const paymentIntent = event.data.object as Stripe.PaymentIntent;
                await Payment.updateOne(
                    { paymentIntentId: paymentIntent.id },
                    { status: paymentIntent.status }
                );
            }

            res.json({ received: true });
        } catch (error) {
            console.error("Webhook error:", error);
            res.status(400).json({ error: "Webhook error" });
        }
    }
);

export default router;