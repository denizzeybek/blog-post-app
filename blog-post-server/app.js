// app.js

const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./configs/database');  // Veritabanı bağlantısını içe aktar
const routes = require('./routes');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const { auditLogger } = require('./middleware/auditLogger');

// env file yükleyin
dotenv.config();

// Express uygulaması başlat
const app = express();

// MongoDB bağlantısını yap
connectDB();

// ========================================
// SECURITY MIDDLEWARE
// ========================================

// Helmet.js - HTTP Security Headers
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'"],
    },
  },
  hsts: {
    maxAge: 31536000, // 1 year
    includeSubDomains: true,
    preload: true
  },
  frameguard: {
    action: 'deny'
  },
  xssFilter: true,
  noSniff: true,
  referrerPolicy: {
    policy: 'strict-origin-when-cross-origin'
  }
}));

// Rate Limiting - Global
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requests per IP
  message: {
    error: 'Too many requests from this IP, please try again later.',
    retryAfter: '15 minutes'
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  handler: (req, res) => {
    res.status(429).json({
      error: 'Too many requests',
      message: 'You have exceeded the request limit. Please try again later.',
      retryAfter: '15 minutes'
    });
  }
});

// Rate Limiting - Auth Routes (stricter)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 login/signup attempts per IP
  skipSuccessfulRequests: true, // Don't count successful requests
  message: {
    error: 'Too many authentication attempts',
    retryAfter: '15 minutes'
  },
  handler: (req, res) => {
    console.warn(`Rate limit exceeded for IP: ${req.ip} on ${req.path}`);
    res.status(429).json({
      error: 'Too many authentication attempts',
      message: 'Please try again after 15 minutes.',
    });
  }
});

// NoSQL Injection Protection
app.use(mongoSanitize({
  replaceWith: '_',
  onSanitize: ({ req, key }) => {
    console.warn(`[SECURITY] Sanitized potentially malicious input: ${key} from IP: ${req.ip}`);
  },
}));

// JSON verilerini işlemek için middleware (with size limit)
app.use(express.json({ limit: '10mb' })); // Prevent large payload attacks
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

app.use(cookieParser());


// ========================================
// CORS Configuration (Secure)
// ========================================
const allowedOrigins = [
  process.env.NODE_ENV === 'development' && 'http://localhost:3001',
  process.env.NODE_ENV === 'development' && 'http://localhost:3000',
  'http://nazlikacar.com.s3-website.eu-north-1.amazonaws.com',
  process.env.FRONTEND_URL, // Add your production frontend URL to .env
  // Add your custom domain when you get it:
  // 'https://yourdomain.com',
  // 'https://www.yourdomain.com'
].filter(Boolean); // Remove falsy values

app.use(cors({
  origin: function(origin, callback) {
    // Allow requests with no origin (like mobile apps, Postman) only in development
    if (!origin && process.env.NODE_ENV === 'development') {
      return callback(null, true);
    }

    // Production: Reject requests without origin
    if (!origin && process.env.NODE_ENV === 'production') {
      return callback(new Error('CORS policy: Origin header required'));
    }

    if (allowedOrigins.includes(origin) || !origin) {
      return callback(null, true);
    } else {
      console.warn(`[SECURITY] CORS blocked request from origin: ${origin}`);
      return callback(new Error('CORS policy: This origin is not allowed.'));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['RateLimit-Limit', 'RateLimit-Remaining', 'RateLimit-Reset'],
}));

// Apply global rate limiter to all API routes
app.use('/api/', globalLimiter);

// Security audit logging
app.use(auditLogger);

// API'ler ve diğer middleware'ler burada tanımlanabilir
app.use(routes);

// Export authLimiter for use in auth routes
module.exports.authLimiter = authLimiter;

// Ana dizine hoş geldiniz mesajı
app.get('/', (req, res) => {
  res.send('Hoş geldiniz! Express + MongoDB API çalışıyor!');
});

// ========================================
// ERROR HANDLING MIDDLEWARE (must be last!)
// ========================================

// 404 Handler
app.use((req, res, next) => {
  res.status(404).json({
    error: 'Not Found',
    message: 'The requested resource was not found',
    path: req.path
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  // Log error details (server-side only)
  console.error('[ERROR]', {
    message: err.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
    path: req.path,
    method: req.method,
    ip: req.ip,
    timestamp: new Date().toISOString()
  });

  // CORS errors
  if (err.message.includes('CORS policy')) {
    return res.status(403).json({
      error: 'Forbidden',
      message: 'CORS policy violation'
    });
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      error: 'Unauthorized',
      message: 'Invalid token'
    });
  }

  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      error: 'Unauthorized',
      message: 'Token expired'
    });
  }

  // Mongoose validation errors
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      error: 'Validation Error',
      message: err.message
    });
  }

  // Mongoose duplicate key error
  if (err.code === 11000) {
    return res.status(409).json({
      error: 'Duplicate Entry',
      message: 'A record with this value already exists'
    });
  }

  // Default error response
  const statusCode = err.status || err.statusCode || 500;

  res.status(statusCode).json({
    error: process.env.NODE_ENV === 'production' ? 'Internal Server Error' : err.message,
    message: process.env.NODE_ENV === 'production'
      ? 'An unexpected error occurred. Please try again later.'
      : err.message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// ========================================
// START SERVER
// ========================================
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`
╔═══════════════════════════════════════════════════════╗
║  🚀 Server Started Successfully                       ║
║  📡 Port: ${PORT}                                    ║
║  🌍 Environment: ${process.env.NODE_ENV || 'development'}              ║
║  🔒 Security: Enabled (Helmet, Rate Limiting, CORS)  ║
║  🛡️  NoSQL Injection Protection: Active              ║
╚═══════════════════════════════════════════════════════╝
  `);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
    process.exit(0);
  });
});
