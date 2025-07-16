import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ['customer', 'admin', 'seller'],
        default: 'customer',
    },
    avatar: {
        type: String,
        default: '/placeholder.svg?height=40&width=40',
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

export const User = mongoose.model('User', userSchema);