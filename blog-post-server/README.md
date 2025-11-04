# Blog Post Server (Backend API)

Express.js + MongoDB backend API for furniture e-commerce platform.

## Quick Start

```bash
# Install dependencies
npm install

# Development (with auto-reload)
npm run dev

# Production
npm start
```

Server runs on port **5000** (configurable via `PORT` env var).

## Environment Variables

Create `.env` file:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/blog-post-db
JWT_SECRET=your-secret-key-here
AWS_ACCESS_KEY_ID=your-aws-key
AWS_SECRET_ACCESS_KEY=your-aws-secret
AWS_REGION=eu-north-1
AWS_BUCKET_NAME=your-bucket-name
```

## Project Structure

```
blog-post-server/
├── app.js              # Express app entry point
├── configs/
│   └── database.js     # MongoDB connection
├── models/             # Mongoose schemas
│   ├── user.model.js
│   ├── blog.model.js
│   └── category.model.js
├── controllers/        # Business logic
│   ├── auth.controller.js
│   ├── blog.controller.js
│   └── category.controller.js
├── routes/             # Route definitions
│   ├── index.js        # Route aggregator
│   ├── auth.route.js
│   ├── blog.route.js
│   └── category.route.js
├── middleware/
│   └── auth.middleware.js  # JWT verification
└── migrations/         # Database migrations
```

## API Architecture

### Authentication Flow

**JWT Token Generation** (`controllers/auth.controller.js:36-42`):
- Token expires in 3 days (`maxAge = 3 * 24 * 60 * 60`)
- Signed with `JWT_SECRET` from environment
- Returned in response body and set as httpOnly cookie

**Protected Routes**:
```javascript
const { requireAuth } = require('../middleware/auth.middleware');

router.post('/protected', requireAuth, controller.action);
```

**Token Format**:
- Client must send: `Authorization: Bearer <token>`
- Middleware extracts token from header (`auth.middleware.js:6-13`)

### CORS Configuration

Allowed origins (`app.js:26-31`):
- `http://localhost:3001` - Local development
- Production S3 static site URL
- Credentials enabled for cookies

### Controllers Pattern

**Standard CRUD Operations**:
- `getAll` - List all resources with optional population
- `getById` - Single resource by ID
- `filter` - Query with filters (name, category, etc.)
- `create` - Create new resource
- `update` - Update existing resource (partial updates supported)
- `delete` - Remove resource

**Example** (`blog.controller.js`):
```javascript
exports.getAllBlogs = async (req, res) => {
  const blogs = await getBlogs();
  res.status(201).json(blogs);
};

exports.filterBlogs = async (req, res) => {
  const { name, category } = req.body;
  const blogs = await getBlogs({ name, category });
  res.status(200).json(blogs);
};
```

### Models

**User Model** (`models/user.model.js`):
- Email/password authentication
- Password hashed with bcrypt
- Static method `User.login(email, password)` for authentication
- Validation via Mongoose validators

**Blog Model** (`models/blog.model.js`):
- Fields: `name`, `enName`, `documentUrl`, `enDocumentUrl`, `category` (ref)
- Category is ObjectId reference to Category collection
- Populated in queries: `.populate('category')`

**Category Model** (`models/category.model.js`):
- Stores blog categories
- Referenced by Blog model

## API Endpoints

### Auth Routes (`/api/auth`)
- `POST /signup` - Register new user
- `POST /login` - Login and get JWT token
- `GET /logout` - Clear JWT cookie
- `GET /fetch-user` - Get current user from token

### Blog Routes (`/api/blogs`)
- `GET /` - Get all blogs
- `GET /:id` - Get blog by ID
- `POST /filter` - Filter blogs by name/category
- `POST /` - Create blog (protected)
- `PUT /:id` - Update blog (protected)
- `DELETE /:id` - Delete blog (protected)

### Category Routes (`/api/categories`)
- Similar CRUD pattern as blogs
- Also supports filtering and population

## AWS S3 Integration

Dependencies:
- `@aws-sdk/client-s3` - S3 client v3
- `@aws-sdk/s3-request-presigner` - Generate presigned URLs
- `multer` - Handle file uploads
- `sharp` - Image processing/optimization

Typical upload flow:
1. Multer receives file
2. Sharp processes/optimizes image
3. Upload to S3 bucket
4. Return S3 URL or presigned URL

## Error Handling

**Auth Controller Error Handler** (`auth.controller.js:4-34`):
- Mongoose validation errors mapped to field-specific messages
- Duplicate email detection (code 11000)
- Custom error messages for incorrect email/password

**Standard Error Responses**:
```javascript
// 400 - Bad Request (validation errors)
res.status(400).json({ message: error.message });

// 401 - Unauthorized (invalid/missing token)
res.status(401).json({ message: 'Unauthorized' });

// 404 - Not Found
res.status(404).json({ message: 'Resource not found' });

// 500 - Internal Server Error
res.status(500).json({ message: error.message });
```

## Database Connection

MongoDB connection via Mongoose (`configs/database.js`):
- Auto-connect on app startup
- Connection string from `MONGODB_URI` env variable
- Mongoose handles connection pooling

## Adding New Features

### 1. Create Model
```javascript
// models/feature.model.js
const mongoose = require('mongoose');

const featureSchema = new mongoose.Schema({
  name: { type: String, required: true },
  // ... other fields
}, { timestamps: true });

module.exports = mongoose.model('Feature', featureSchema);
```

### 2. Create Controller
```javascript
// controllers/feature.controller.js
const Feature = require('../models/feature.model');

exports.getAllFeatures = async (req, res) => {
  try {
    const features = await Feature.find();
    res.status(200).json(features);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
```

### 3. Create Routes
```javascript
// routes/feature.route.js
const router = require('express').Router();
const controller = require('../controllers/feature.controller');
const { requireAuth } = require('../middleware/auth.middleware');

router.get('/', controller.getAllFeatures);
router.post('/', requireAuth, controller.createFeature);

module.exports = router;
```

### 4. Register Routes
```javascript
// routes/index.js
const featureRoutes = require('./feature.route');
router.use('/features', featureRoutes);
```

## Security Notes

- JWT tokens stored in httpOnly cookies (XSS protection)
- Passwords never returned in responses (`.select('-password')`)
- CORS restricted to allowed origins
- Bearer token validation on protected routes
- Bcrypt for password hashing (automatic in User model)

## Common Issues

**Token not working**:
- Verify `JWT_SECRET` is set in `.env`
- Check token format: `Bearer <token>` (note the space)
- Token expires after 3 days - user must re-login

**CORS errors**:
- Add origin to `allowedOrigins` array in `app.js:26-31`
- Ensure credentials: true in CORS config

**MongoDB connection fails**:
- Check `MONGODB_URI` format
- Ensure MongoDB server is running
- Verify network access to MongoDB instance
