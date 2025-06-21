//middlewares/authMiddlewares.js
const jwt = require('jsonwebtoken');
const User = require('../Models/User');
const { UnauthorizedError } = require('../Utils/errors');

const authenticateUser = async ( req, res, next) => {
    const authHeader = req.headers.authorization || req.header('Authorization');
    if(!authHeader || !authHeader.startsWith('Bearer ')){
        throw new UnauthorizedError('Authentication invalid. No token provided.');
    }

    const token = authHeader.split(' ')[1];
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.userId).select('-password -emailVerificationCode -emailVerificationExpires -resetPasswordToken -resetPasswordExpires');
        if(!user){
            throw new UnauthorizedError('User not found.');
        }
        req.user = {
            userId: user._id,
            name: user.name,
            email: user.email,
            profilePic: user.profilePic
        };
        next();
    }
    catch(error){
        console.error('Authentication error:', error);
        throw new UnauthorizedError('Authentication invalid. Token verification failed.');
    }
}

module.exports = {
    authenticateUser
};