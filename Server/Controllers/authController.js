import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import userModel from '../models/userModels.js';
import transporter from '../config/emailTransporter.js';
import { text } from 'express';

export const register = async(req, res) => {
    console.log(req.body);
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.json({ success: false, message: 'Missing fields' });
    }

    try {
        const existingUser = await userModel.findOne({ email });
        if (existingUser) {
            return res.json({ success: false, message: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new userModel({ name, email, password: hashedPassword });
        await user.save();

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        //Sending email Option

        const mailOptions = ({
            from: process.env.SMTP_EMAIL,
            to: email,
            subject: 'Welcome to the Great Code',
            text: `welcome to  the great code website. Your account has been created with email id:${email}`
        })

        await transporter.sendMail(mailOptions);


        return res.json({ success: true, message: 'User registered successfully', token });

    } catch (error) {
        return res.json({ success: false, message: error.message });
    }
};



export const login = async(req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.json({ success: false, message: 'Missing fields' });
    }

    try {
        const User = await userModel.findOne({ email });
        if (!User) {
            return res.json({ success: false, message: 'Invalid Email' });
        }

        const isMatch = await bcrypt.compare(password, User.password);
        if (!isMatch) {
            return res.json({ success: false, message: 'Invalid Password' });
        }

        const token = jwt.sign({ id: User._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        return res.json({ success: true, message: 'Login successful', token });
    } catch (error) {
        return res.json({ success: false, message: error.message });
    }
};



export const logOut = async(req, res) => {
    try {
        res.clearCookie('token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
        });

        return res.json({ success: true, message: 'Logged Out' });
    } catch (error) {
        return res.json({ success: false, message: error.message });
    }
};



//send verifaction OTP to the User's Email

export const sendVerifyOtp = async(req, res) => {
    try {
        const { userId } = req.body;
        if (!userId) {
            return res.json({ success: false, message: 'User ID is required' });
        }
        const user = await userModel.findById(userId);
        if (!user) {
            return res.json({ success: false, message: 'User not found' });
        }
        if (user.isAccountVerified) {
            return res.json({ success: false, message: 'Account already verified' });
        }
        const otp = String(Math.floor(100000 + Math.random() * 900000));
        user.verifyotp = otp;
        user.verifyotpExpiresAt = Date.now() + 24 * 60 * 60 * 1000;
        const mailOption = {
            from: process.env.SMTP_EMAIL,
            to: user.email,
            subject: 'Account Verification OTP',
            text: `Your OTP is ${otp}. Verify your account using this OTP.`,
        };
        await transporter.sendMail(mailOption);
        await user.save();
        return res.json({ success: true, message: 'Verification OTP sent on Email' });
    } catch (error) {
        return res.json({ success: false, message: error.message });
    }
};




// verifying email user via recived otp by the email

export const verifyEmail = async(req, res) => {
    const { userId, otp } = req.body;

    if (!userId || !otp) {
        return res.json({ success: false, message: 'Missing details' });
    }

    try {
        const user = await userModel.findById(userId);
        if (!user) {
            return res.json({ success: false, message: 'User not found' });
        }

        if (user.verifyotp === '' || user.verifyotp !== otp) {
            return res.json({ success: false, message: 'Invalid OTP' });
        }

        if (user.verifyotpExpiresAt < Date.now()) {
            return res.json({ success: false, message: 'OTP Expired' });
        }

        user.isAccountVerified = true;
        user.verifyotp = '';
        user.verifyotpExpiresAt = 0;
        await user.save();

        // Send updated user data to the frontend
        return res.json({ success: true, message: 'Email Verified Successfully', user });
    } catch (error) {
        return res.json({ success: false, message: error.message });
    }
};

// check if user authenticated
export const isAuthenticated = async(req, res) => {

    try {
        return res.json({ success: true });

    } catch (error) {


        return res.json({ success: false, message: error.message });

    }
}


// Send password reset otp

export const sendResetOtp = async(req, res) => {

    const { email } = req.body;

    if (!email) {
        return res.json({ success: false, message: 'Email is required' });

    }

    try {

        const user = await userModel.findOne({ email });

        if (!user) {
            return res.json({ success: false, message: 'user not found' });

        }

        const otp = String(Math.floor(100000 + Math.random() * 900000));

        user.resetOtp = otp;
        user.resetOtpExpiresAt = Date.now() + 15 * 60 * 1000;

        await user.save();

        const sendingOtp = ({
            from: process.env.SMTP_EMAIL,
            to: user.email,
            subject: 'Password Reset OTP',
            text: `Your OTP for resetting your password is ${otp}. use this OTP tp proceed with resetting your password`,

        })
        await transporter.sendMail(sendingOtp);

        return res.json({ success: true, message: 'OTP sent to your email' });

    } catch (error) {
        return res.json({ success: false, message: error.message });

    }
};

//Reset user Password

export const resetPassword = async(req, res) => {

    const { otp, email, newPassword } = req.body;

    if (!otp || !email || !newPassword) {


        return res.json({ success: false, message: 'Email, OTP And new password are required ' });

    }

    try {
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.json({ success: false, message: 'user not found' });

        }
        if (user.resetOtp === '' || user.resetOtp !== otp) { // comapres both side otp numbers

            return res.json({ success: false, message: 'invalid OTP' });
            // if otp not in the database or not matching
        }


        if (user.resetOtpExpiresAt < Date.now()) {

            return res.json({ success: false, message: ' OTP Expired' });
        }
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        user.password = hashedPassword; //new password  updated
        user.resetOtp = ''; // data updated
        user.resetOtpExpiresAt = 0; //updated

        await user.save(); // saved in the database

        return res.json({ success: true, message: 'password has been reset successfully' });

    } catch (error) {

        return res.json({ success: false, message: error.message });

    }
}