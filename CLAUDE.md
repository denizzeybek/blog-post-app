# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Claude Code Directives

**Context7 Integration:**
Always use Context7 MCP tools when code generation, setup or configuration steps, or library/API documentation is needed. This means automatically using the Context7 MCP tools to resolve library id and get library docs without explicit user request.

## Project Overview

This is a full-stack modular furniture website built as a monorepo with separate client and server applications. The project supports modular product creation where users can combine multiple products into packages (e.g., assembling a wardrobe from related components). Images are managed via AWS S3 integration.

## Project Structure

```
blog-post-app/
├── blog-post-client/     # Vue.js frontend application
└── blog-post-server/     # Express.js backend API
```

## Development Commands

### Client (blog-post-client)

```bash
cd blog-post-client

# Development
npm run dev              # Start dev server on port 3001

# Building
npm run build            # Full build with type checking (vue-tsc + vite)
npm run build-only       # Build without type checking
npm run preview          # Preview production build

# Code Quality
npm run lint             # ESLint with auto-fix
npm run format           # Prettier formatting
npm run type-check       # TypeScript type checking without emit

# Testing
npm run test:unit        # Run Vitest unit tests

# Utilities
npm run generate-icon-names  # Generate icon name types
npm run sync            # Deploy to AWS S3
```

### Server (blog-post-server)

```bash
cd blog-post-server

# Development
npm run dev             # Start with nodemon (auto-reload)
npm start               # Production start (node app.js)
```

## Technology Stack

### Frontend (blog-post-client)
- **Framework**: Vue 3 with TypeScript
- **UI Library**: PrimeVue (auto-imported components)
- **Styling**: Tailwind CSS + Sass
- **State Management**: Pinia stores
- **Routing**: Vue Router with auth guards
- **Forms**: Vee-Validate + Yup schemas
- **i18n**: Vue-i18n for translations
- **Build Tool**: Vite with JSX support
- **Testing**: Vitest + Vue Test Utils

### Backend (blog-post-server)
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT tokens (Bearer auth in headers)
- **Image Processing**: Sharp + Multer
- **Storage**: AWS S3 SDK v3
- **Security**: bcrypt for passwords, cookie-parser

## Architecture Patterns

### Client Architecture

**Store Structure** (`src/stores/`):
- Pinia stores manage global state with enum-based naming (`storeNames.enum.ts`)
- Key stores: `auth.ts`, `blogs.ts`, `categories.ts`, `users.ts`
- Stores handle API calls and state synchronization

**Routing** (`src/router/`):
- Route names defined in `routeNames.enum.ts` for type safety
- Auth guards check JWT token from localStorage (`EStorageKeys.TOKEN`)
- Meta fields: `requiresAuth`, `requiresUnAuth`, `isPublic`
- Axios Authorization header set automatically on token presence

**Component Organization**:
- `views/`: Page-level components (auth, blogs, categories, dashboard, products, contact, about)
- `components/ui/`: Reusable UI components
- `layouts/`: Layout wrappers
- PrimeVue components auto-imported via `unplugin-vue-components`

**Helpers** (`src/helpers/`):
- `auth.ts`: Auth utilities
- `customValidators.ts`: Custom Yup validators
- `date.ts`: Date formatting with dayjs
- `utils.ts`: General utility functions
- `veeValidateI18n.ts`: i18n integration for validation messages

**Type Safety**:
- `interfaces/`: TypeScript interfaces
- `types/`: Type definitions
- `enums/`: Enum constants for type-safe values
- Path alias `@/` points to `src/`

### Server Architecture

**MVC Pattern**:
- `models/`: Mongoose schemas (`user.model.js`, `blog.model.js`, `category.model.js`)
- `controllers/`: Business logic handlers (auth, blog, category)
- `routes/`: Express route definitions
- `middleware/`: Auth middleware for JWT verification

**Authentication Flow**:
- JWT tokens created with 3-day expiration (`maxAge = 3 * 24 * 60 * 60`)
- `requireAuth` middleware extracts Bearer token from `Authorization` header
- Token verification uses `JWT_SECRET` from environment
- User lookup excludes password field in responses

**CORS Configuration** (`app.js:26-45`):
- Allowed origins: `localhost:3001` and production S3 static site
- Credentials enabled for cookie support
- Origin validation in CORS middleware

**Database**:
- **Local MongoDB** (localhost:27017)
- Database name: `blog-post`
- Connection via `configs/database.js`
- Mongoose for schema validation and queries
- **Prerequisites**: MongoDB must be installed and running locally

## Environment Configuration

### Client `.env` (blog-post-client)
Required environment variables should follow Vite naming (`VITE_*`):
```
VITE_API_URL=http://localhost:5000
```

### Server `.env` (blog-post-server)
```
PORT=3000
MONGO_URI=mongodb://localhost:27017/blog-post
JWT_SECRET=your-secret-key
AWS_ACCESS_KEY_ID=...
AWS_SECRET_ACCESS_KEY=...
AWS_REGION=eu-north-1
AWS_BUCKET_NAME=...
```

## Common Workflows

### Adding a New Feature

1. **API Endpoint** (server):
   - Add route in `blog-post-server/routes/`
   - Create controller in `blog-post-server/controllers/`
   - Update model if needed in `blog-post-server/models/`
   - Add auth middleware if protected: `router.post('/path', requireAuth, controller.action)`

2. **Frontend Integration** (client):
   - Add API call in appropriate Pinia store (`blog-post-client/src/stores/`)
   - Create/update view component in `blog-post-client/src/views/`
   - Add route in `blog-post-client/src/router/routes.ts`
   - Update TypeScript interfaces in `src/interfaces/`

### Authentication Pattern

**Client Side**:
```typescript
// Store token in localStorage
localStorage.setItem(EStorageKeys.TOKEN, token);

// Set axios default header
axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

// Router guard fetches user if token exists (router/index.ts:23-30)
```

**Server Side**:
```javascript
// Protect routes with middleware
const { requireAuth } = require('../middleware/auth.middleware');
router.post('/protected', requireAuth, controller.action);

// Token extracted from: req.headers.authorization (Bearer token)
```

### Working with AWS S3

- Image uploads processed through Sharp for optimization
- Multer handles multipart form data
- S3 client configured with AWS SDK v3
- Presigned URLs generated for secure access

### Type-Safe Development

- Use enum-based constants (route names, storage keys, store names)
- Define interfaces for all data structures
- Components auto-imported (no manual imports needed for PrimeVue)
- Run `npm run type-check` before commits

## Deployment

**Frontend Deployment**:
- Build: `cd blog-post-client && npm run build`
- Output: `dist/` directory
- Deploy: `npm run sync` (syncs to S3 bucket)
- Current production: `nazlikacar.com.s3-website.eu-north-1.amazonaws.com`

**Backend Deployment**:
- Ensure all environment variables are set
- Run: `npm start` (production) or configure process manager (PM2)
- Default port: 5000

## Important Notes

- Frontend dev server runs on port **3001** (not 3000)
- Backend default port is **5000**
- JWT tokens expire after 3 days
- All protected API routes require Bearer token in Authorization header
- Client router checks token validity on each navigation
- PrimeVue components are auto-imported via resolver (no manual imports needed)
- The project name mentions "blog-post" but actually implements a furniture e-commerce platform
