import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import {User} from '@/models/User';
import * as process from "node:process";
import {sendEmail} from "../utils/emailservice"
import {generateWelcomeEmail} from "@/utils/templates/welcomeemail";

const router = express.Router();

const jwt_secret = process.env.JWT_SECRET as string || 'MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAz5lLZU+B2W3Sj1O92WOFxdU1HgMfiqAXgCYv4DuiAUW2hB8nkrh6BQL4sw47B+ENqAFCeZp9/PNVgtefmDRRfL4e5US/P6qogJVPhZqQMB069hqrJH9CwuWm9CfxQOicO2Fwaswqp779nj6IspxdLj65qS1F4HKXvKjA1z9eZviBzImQULqCwzW6a6nRZSSvhE7l9be9jel47ePf/rzVvLsfWSK8ZfZC0Fatoh6/vlyhr';

// Register route
router.post('/register', async (req, res) => {
    try {
        const { name, email, password, avatar } = req.body;

        // Validate input
        if (!name || !email || !password) {
            return res.status(400).json({ message: 'Name, email, and password are required' });
        }

        if (password.length < 6) {
            return res.status(400).json({ message: 'Password must be at least 6 characters long' });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ message: 'User already exists with this email' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        //get Random Avatar
        const profileImage = `https://api.dicebear.com/9.x/adventurer/svg?seed=${name}`;

        // Create new user
        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            role: 'customer',
            avatar: profileImage || '/placeholder.svg?height=40&width=40',
        });

        await newUser.save();

        // Generate JWT token
        const token = jwt.sign(
            {
                userId: newUser._id,
                email: newUser.email,
                role: newUser.role,
            },
            jwt_secret,
            { expiresIn: '7d' }
        );

        // Return user data and token
        const userResponse = {
            id: newUser._id,
            name: newUser.name,
            email: newUser.email,
            role: newUser.role,
            avatar: newUser.avatar,
        };

        sendEmail(email,"🎉 Welcome to Smart Cart!","",generateWelcomeEmail(name));

        res.status(201).json({
            user: userResponse,
            token,
            message: 'Registration successful',
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Login route
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate input
        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }

        // Find user
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // Verify password
        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // Generate JWT token
        const token = jwt.sign(
            {
                userId: user._id,
                email: user.email,
                role: user.role,
            },
            jwt_secret,
            { expiresIn: '7d' }
        );

        // Return user data and token
        const userResponse = {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            avatar: user.avatar,
        };

        res.json({
            user: userResponse,
            token,
            message: 'Login successful',
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

export default router;