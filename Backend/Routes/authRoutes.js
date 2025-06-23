//authroutes.js
const express = require('express');
const { registerUser, verifyEmail, loginUser, logoutUser, getUserProfile, resetPassword, requestPasswordReset } = require('../Controllers/authControllers');
const { authenticateUser } = require('../Middlewares/authMiddlewares');
const { loginLimiter, registerLimiter } = require('../Middlewares/rateLimiter');
const router = express.Router();

router.post('/register', registerLimiter, registerUser);
router.get('/verify-email/:emailVerificationCode', verifyEmail);
router.post('/login', loginLimiter, loginUser);
router.post('/request-password-reset', requestPasswordReset);
router.post('/reset-password', resetPassword);
router.get('/me', authenticateUser, getUserProfile);
router.post('/logout', authenticateUser, logoutUser);

module.exports = router;