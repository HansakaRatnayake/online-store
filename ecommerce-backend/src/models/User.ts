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
        type: Buffer, // Store image as binary data
        default: null,
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
    address: {
        type: String,
    },
    status: {
        type: String,
        enum: ['active', 'inactive', 'blocked'],
        default: 'active',
    },
    notificationPreferences: {
        emailNotifications: { type: Boolean, default: true },
        smsNotifications: { type: Boolean, default: false },
        marketingEmails: { type: Boolean, default: true },
        orderUpdates: { type: Boolean, default: true },
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

export const User = mongoose.model('User', userSchema);