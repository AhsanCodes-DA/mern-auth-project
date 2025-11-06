import express from "express";
import { isAuthenticated, login, logOut, register, resetPassword, sendResetOtp, sendVerifyOtp, verifyEmail } from "../Controllers/authController.js";
import userAuth from "../middleware/userAuth.js";

const authRouter = express.Router();


authRouter.post('/register', register); // for creating new user
authRouter.post('/login', login); // user login
authRouter.post('/logout', logOut); // user logout

authRouter.post('/send-verify-otp', userAuth, sendVerifyOtp); //verify otp
authRouter.post('/verify-account', userAuth, verifyEmail); //verify email  
authRouter.get('/is-auth', userAuth, isAuthenticated); // if user authentication

authRouter.post('/send-reset-otp', sendResetOtp); //otp for a password to reset
authRouter.post('/reset-password', resetPassword); // resetting a password by newpassword , otp,email by a req.body


export default authRouter;