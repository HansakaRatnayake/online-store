// backend/routes/admin.ts
import express, { Request, Response, NextFunction } from "express";
import { authenticate, isAdmin } from '../middleware/auth';

const router = express.Router();

router.get('/data', authenticate, isAdmin, async (req:Request, res) => {
    res.json({ message: 'Admin data', user: req.user });
});

export default router;