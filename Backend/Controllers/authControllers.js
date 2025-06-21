//authControllers.js
const User = require('../Models/User');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { NotFoundError, BadRequestError, UnauthorizedError, ForbiddenError, InternalServerError  } = require('../Utils/errors');
const { sendConformationEmail, sendPasswordResetEmail, sendWelcomeEmail } = require('../config/nodemailer');
const { stat } = require('fs');

// Register a new user
const registerUser = async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        throw new BadRequestError('Please provide all required fields.');
    }

    if(!process.env.JWT_SECRET) {
        throw new InternalServerError('JWT secret is not defined.');
    }

    if(!name || name.trim().length === 0 ){
        throw new BadRequestError('Please provided a valid name.');
    }

    if(!email || !/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/.test(email)){
        throw new BadRequestError('Please provide a valid email address.');
    }

    if(!password || password.length < 6){
        throw new BadRequestError('Password must be at least 6 characters long.');
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
        throw new BadRequestError('Email already registered.');
    }

    const emailVerificationCode = crypto.randomBytes(32).toString('hex');

    const newUser =  new User.create({
        name: name.trim(),
        email: email.toLowerCase(),
        password: password,
        emailVerificationCode,
        emailVerificationExpires: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
        isEmailVerified: false
    });

    // Send welcome email
    try{
        await sendConformationEmail(newUser.email, newUser.name, emailVerificationCode);
    }
    catch(error) {
        console.error('Error sending confirmation email:', error);
        throw new InternalServerError('Failed to send confirmation email.');
    }

    res.status(201).json({
        status: 'success',
        message: 'User registered successfully.',
        user: {
            id: newUser._id,
            name: newUser.name,
            email: newUser.email,
            profilePic: newUser.profilePic,
            isEmailVerified: newUser.isEmailVerified
        }
    });
};

// Verify email
const verifyEmail = async (req, res) => {
    try{
        const { emailVerificationCode } = req.params;
        if (!emailVerificationCode) {
            throw new BadRequestError('Email verification code is required.');
        }

        const user = await User.findOne({ emailVerificationCode });

        if (!user) {
            throw new NotFoundError('Invalid or expired verification code.');
        }
        if (user.isEmailVerified) {
            throw new BadRequestError('Email is already verified.');
        }
        if (user.emailVerificationExpires < Date.now()) {
            throw new BadRequestError('Email verification code has expired.');
        }
        user.isEmailVerified = true;
        user.emailVerificationCode = undefined;
        user.emailVerificationExpires = undefined;
        await user.save();

        try {
            await sendWelcomeEmail(user.email, user.name);
        }
        catch (error) {
            console.error('Error sending welcome email:', error);
            throw new InternalServerError('Failed to send welcome email.');
        }

        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET,
            process.env.JWT_EXPIRY || '1d'
        );

        res.status(200).json({
            status: 'success',
            message: 'Email verified successfully.',
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                profilePic: user.profilePic,
                isEmailVerified: user.isEmailVerified
            },
            token
        });
    }
    catch (error) {
        console.error('Error verifying email:', error);
        if (error instanceof NotFoundError || error instanceof BadRequestError) {
            throw error; // Re-throw known errors
        }
        throw new InternalServerError('An error occurred while verifying email.');
    }
}

// Login user
const loginUser = async (req, res) => {
    try{
        const { email, password } = req.body;

        if (!email || !password) {
            throw new BadRequestError('Please provide both email and password.');
        }

        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user) {
            throw new NotFoundError('User not found.');
        }

        if (!user.isEmailVerified) {
            throw new ForbiddenError('Email not verified. Please verify your email first.');
        }

        const isPasswordValid = await user.comparePassword(password);
        if (!isPasswordValid) {
            throw new UnauthorizedError('Invalid email or password.');
        }

        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET,
            process.env.JWT_EXPIRY || '1d'
        );

        res.status(200).json({
            status: 'success',
            message: 'Login successful.',
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                profilePic: user.profilePic
            },
            token
        });
    }
    catch (error) {
        console.error('Error logging in:', error);
        if (error instanceof NotFoundError || error instanceof BadRequestError || error instanceof UnauthorizedError || error instanceof ForbiddenError) {
            throw error; // Re-throw known errors
        }
        throw new InternalServerError('An error occurred while logging in.');
    }
}

// Request password reset
const requestPasswordReset = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            throw new BadRequestError('Email is required.');
        }

        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user) {
            throw new NotFoundError('User not found.');
        }

        const resetToken = crypto.randomBytes(32).toString('hex');
        user.resetPasswordToken = resetToken;
        user.resetPasswordExpires = Date.now() + 15 * 60 * 1000; // 15 minutes
        await user.save();

        try {
            await sendPasswordResetEmail(user.email, user.name, resetToken);
        } catch (error) {
            console.error('Error sending password reset email:', error);
            throw new InternalServerError('Failed to send password reset email.');
        }

        res.status(200).json({
            status: 'success',
            message: 'Password reset email sent successfully.'
        });
    } catch (error) {
        console.error('Error requesting password reset:', error);
        if (error instanceof NotFoundError || error instanceof BadRequestError) {
            throw error; // Re-throw known errors
        }
        throw new InternalServerError('An error occurred while requesting password reset.');
    }
};

// Reset password
const resetPassword = async (req, res) => {
    try {
        const { resetToken, newPassword } = req.body;

        if (!resetToken || !newPassword) {
            throw new BadRequestError('Reset token and new password are required.');
        }

        const user = await User.findOne({ resetPasswordToken: resetToken });
        if (!user) {
            throw new NotFoundError('Invalid or expired reset token.');
        }

        if (user.resetPasswordExpires < Date.now()) {
            throw new BadRequestError('Reset token has expired.');
        }

        user.password = newPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();

        res.status(200).json({
            status: 'success',
            message: 'Password reset successfully.'
        });
    } catch (error) {
        console.error('Error resetting password:', error);
        if (error instanceof NotFoundError || error instanceof BadRequestError) {
            throw error; // Re-throw known errors
        }
        throw new InternalServerError('An error occurred while resetting password.');
    }
};

// Get user profile
const getUserProfile = async (req, res) => {
    try {
        const userId = req.user.userId;

        const user = await User.findById(userId).select('-password -emailVerificationCode -emailVerificationExpires -resetPasswordToken -resetPasswordExpires');
        if (!user) {
            throw new NotFoundError('User not found.');
        }

        res.status(200).json({
            status: 'success',
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                profilePic: user.profilePic,
                isEmailVerified: user.isEmailVerified
            }
        });
    } catch (error) {
        console.error('Error fetching user profile:', error);
        if (error instanceof NotFoundError) {
            throw error; // Re-throw known errors
        }
        throw new InternalServerError('An error occurred while fetching user profile.');
    }
};

// logout user
const logoutUser = async (req, res) => {
    try {
        res.clearCookie('token',{
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'Strict'
        });
        res.status(200).json({
            status: 'success',
            message: 'User logged out successfully.'
        });
    } catch (error) {
        console.error('Error logging out:', error);
        throw new InternalServerError('An error occurred while logging out.');
    }
};

module.exports = {
    registerUser,
    verifyEmail,
    loginUser,
    requestPasswordReset,
    resetPassword,
    getUserProfile,
    logoutUser
};