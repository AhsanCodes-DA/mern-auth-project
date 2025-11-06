import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    verifyotp: { type: String, default: '' }, // consider string for to  have 0 otp
    verifyotpExpiresAt: { type: Number, default: 0 },
    isAccountVerified: { type: Boolean, default: false },
    resetOtp: { type: String, default: '' },
    resetOtpExpiresAt: { type: Number, default: 0 }, // usedfor expire otp default : 0 

})


const userModel = mongoose.models.user || mongoose.model('user', userSchema); //  understand this  & its mandotary

export default userModel;