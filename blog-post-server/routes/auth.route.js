const { Router } = require('express');
const authController = require('../controllers/auth.controller');
const rateLimit = require('express-rate-limit');

const router = Router();

// Strict rate limiter for auth endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 attempts
  skipSuccessfulRequests: true,
  message: {
    error: 'Too many authentication attempts',
    retryAfter: '15 minutes'
  },
  handler: (req, res) => {
    console.warn(`[SECURITY] Rate limit exceeded for auth on IP: ${req.ip}`);
    res.status(429).json({
      error: 'Too many authentication attempts',
      message: 'Please try again after 15 minutes.',
    });
  }
});

router.get('/signup', authController.signup_get);
router.post('/signup', authLimiter, authController.signup_post);
router.get('/login', authController.login_get);
router.post('/login', authLimiter, authController.login_post);
router.get('/logout', authController.logout_get);
router.get('/me', authController.fetchUser);

module.exports = router;