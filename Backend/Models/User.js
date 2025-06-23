//Models/User.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    profilePic:{
        type: String,
        default: 'https://res.cloudinary.com/dz1x5qj3h/image/upload/v1698851234/default_profile_pic.png'
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    isEmailVerified: {
        type: Boolean,
        default: false
    },
    emailVerificationCode: {
        type: String
    },
    emailVerificationExpires: {
        type: Date
    },
    resetPasswordToken: {
        type: String
    },
    resetPasswordExpires: {
        type: Date
    }
}, { timestamps: true });

// Hash password before saving
userSchema.pre('save', async function(next) {
    if(!this.isModified('password'))
        return next();

    try {
        const salt = await bcrypt.genSalt(12);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    }
    catch (error) {
        next(error);
    }
});

// Method to compare passwords
userSchema.methods.comparePassword = async function(candidatePassword) {
    try {
        return await bcrypt.compare(candidatePassword, this.password);
    } catch (error) {
        throw new Error('Password comparison failed');
    }
}

// Method to generate email verification code
userSchema.methods.generateEmailVerificationCode = function() {
    const emailVerificationCode = crypto.randomBytes(32).toString('hex');
    this.emailVerificationCode = emailVerificationCode;
    this.emailVerificationExpires = Date.now() + 24 * 60 * 60 * 1000; // 24 hours
    return emailVerificationCode;
}

// Method to generate reset password token
userSchema.methods.generateResetPasswordToken = function() {
    const resetPasswordToken = crypto.randomBytes(32).toString('hex');
    this.resetPasswordToken = resetPasswordToken;
    this.resetPasswordExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
    return resetPasswordToken;
}

const User = mongoose.model('User', userSchema);
module.exports = User;

