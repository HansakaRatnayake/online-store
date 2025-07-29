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
    mobileNo: {
        type: String,
    },
    country: {
        type: String,
    },
    dob: {
        type: Date,
    },
    status: {
        type: String,
        enum: ['Active', 'Inactive', 'Blocked'],
        default: 'Active',
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

export const User = mongoose.model('User', userSchema);