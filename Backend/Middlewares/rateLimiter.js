const rateLimit = require('express-rate-limit');

const createRateLimiter = (maxAttempts, message) => {
    return rateLimit({
        windowMs: 15 * 60 * 1000,
        max: maxAttempts,
        message: {
            status: 'error',
            message,
        },
        standardHeaders: true,
        legacyHeaders: false,
        skipSuccessRequests: true,
    });
};

const loginLimiter = createRateLimiter(5, 'Too many login attempts, please try again later.');
const registerLimiter = createRateLimiter(10, 'Too many registration attempts, please try again later.');

module.exports = {
    loginLimiter,
    registerLimiter,
};