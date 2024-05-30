import mongoose , { Schema } from "mongoose";
import cron from 'node-cron';

const userSchema = new Schema({
    username:{
        required: true,
        type: String,
        unique: true,
        lowercase: true
    },
    email:{
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    password:{
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    isLoggedIn:{
        type: Boolean,
        default: false
    },
    wordlimit:{
        type: Number,
        default: 0
    }
},{timestamps: true})

export const User = mongoose.model("User",userSchema)

cron.schedule('0 0 * * *', async () => {
    try {
        // Update all users to reset wordlimit to 0
        await User.updateMany({}, { $set: { wordlimit: 0 } });
        console.log('Word limit reset successfully!');
    } catch (error) {
        console.error('Error resetting word limit:', error);
    }
}, {
    timezone: "Asia/Kolkata"
});