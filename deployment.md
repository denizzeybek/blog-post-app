# 🚀 Production Deployment Guide

## ⭐ Render + MongoDB Atlas + Cloudflare (with Custom Domain)

**Why this method is the best:**
- ✅ Completely free (except domain: ~$10/year)
- ✅ Automatic SSL certificates
- ✅ Automatic deployment with GitHub
- ✅ Custom domain support
- ✅ Professional appearance
- ✅ Single platform - easy management
- ✅ Scalable

**Total Cost:** ~$10/year (domain only)

---

## 📋 Requirements

- GitHub account
- Render account (free with GitHub)
- MongoDB Atlas account (free)
- Domain (~$10/year - Cloudflare Registrar recommended)

---

## STEP 1: MongoDB Atlas Setup (5 minutes)

### 1.1. Create Account
```
1. Go to https://www.mongodb.com/cloud/atlas/register
2. Sign up with Google or GitHub
3. Verify email
```

### 1.2. Create Free Cluster
```
1. Click "Create a Deployment" button
2. Deployment Type: Select M0 (Free)
3. Cloud Provider: AWS
4. Region: eu-north-1 (Stockholm) - Closest region
5. Cluster Name: blog-post-cluster
6. Click "Create Deployment" button
7. Wait (2-3 minutes)
```

### 1.3. Create Database User
```
1. From left menu "Security" → "Database Access"
2. Click "Add New Database User" button
3. Authentication Method: Password
4. Username: blogpostuser (or any name you want)
5. Password: Create a strong password and SAVE! (you'll need it later)
6. Database User Privileges: "Read and write to any database"
7. Click "Add User" button
```

### 1.4. Configure Network Access
```
1. From left menu "Security" → "Network Access"
2. Click "Add IP Address" button
3. Select "Allow Access from Anywhere" (0.0.0.0/0)
4. Click "Confirm" button

⚠️ This is secure because MongoDB is protected by username/password
```

### 1.5. Get Connection String
```
1. From left menu "Database" → "Clusters"
2. Click "Connect" button next to your cluster
3. Select "Drivers"
4. Driver: Node.js, Version: 5.5 or later
5. Copy connection string:
   mongodb+srv://blogpostuser:<password>@blog-post-cluster.xxxxx.mongodb.net/

6. Edit connection string:
   - Replace <password> with your actual password
   - Add database name at the end: /blog-post

Example:
mongodb+srv://blogpostuser:MyStr0ngP@ss@blog-post-cluster.abc123.mongodb.net/blog-post

⚠️ Save this string! You'll need it for backend deployment.
```

---

## STEP 2: Backend Deploy (Render Web Service) - 10 minutes

### 2.1. Create Render Account
```
1. Go to https://render.com/
2. Click "Get Started for Free" button
3. Sign up with GitHub
4. Grant access to GitHub repositories
```

### 2.2. Create Web Service
```
1. Click "New +" button in Dashboard
2. Select "Web Service"
3. Select GitHub repository: blog-post-app
4. Click "Connect" button
```

### 2.3. Service Configuration
```
Name: blog-post-app
Region: Frankfurt (EU Central)
Branch: main
Root Directory: blog-post-server
Runtime: Node
Build Command: npm install
Start Command: node app.js
Instance Type: Free
```

### 2.4. Add Environment Variables
```
In "Environment" tab, add these variables:

NODE_ENV=production

PORT=3000

MONGO_URI=mongodb+srv://blogpostuser:PASSWORD@cluster.xxxxx.mongodb.net/blog-post
(Paste connection string from MongoDB Atlas)

JWT_SECRET=super_secret_production_key_change_this_to_random_string
(Use a secure, long, random string)

FRONTEND_URL=https://blog-post-frontend-xxxxx.onrender.com
(Leave empty for now, we'll add it after frontend deployment)

# If using AWS S3 (optional):
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
AWS_REGION=eu-north-1
AWS_BUCKET_NAME=your_bucket_name
```

### 2.5. Deploy
```
1. Click "Create Web Service" button
2. Deployment will start (5-10 minutes)
3. Follow logs:
   - "npm install" running
   - "node app.js" running
   - You should see "MongoDB connected successfully"

4. When deployment completes:
   URL: https://blog-post-app-xxxxx.onrender.com
```

### 2.6. Test Backend
```bash
# Test in terminal
curl https://blog-post-app-xxxxx.onrender.com/api/categories

# First request may take ~30-60 seconds (Render free tier cold start)
```

---

## STEP 3: Frontend Deploy (Render Static Site) - 5 minutes

### 3.1. Create Static Site
```
1. Click "New +" button in Render Dashboard
2. Select "Static Site"
3. Select same repository: blog-post-app
4. Click "Connect" button
```

### 3.2. Static Site Configuration
```
Name: blog-post-frontend
Branch: main
Root Directory: (leave empty - monorepo)
Build Command: cd blog-post-client && npm install && npm run build
Publish Directory: blog-post-client/dist
Auto-Deploy: Yes
```

### 3.3. Add Environment Variables
```
In "Environment" tab:

VITE_API_URL=https://blog-post-app-xxxxx.onrender.com/api
(Paste your backend URL here - note /api at the end!)

VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
(Optional)
```

### 3.4. Deploy
```
1. Click "Create Static Site" button
2. Build will start (2-5 minutes)
3. Follow logs

4. When deployment completes:
   URL: https://blog-post-frontend-xxxxx.onrender.com
```

### 3.5. Update Backend FRONTEND_URL
```
1. Render Dashboard → blog-post-app (backend service)
2. Go to "Environment" tab
3. Add/update FRONTEND_URL variable:
   FRONTEND_URL=https://blog-post-frontend-xxxxx.onrender.com

4. "Save Changes" → Automatic redeploy will start
```

### 3.6. SPA Routing Setup (IMPORTANT!)
```
In frontend static site:
1. Settings → Redirects/Rewrites
2. Click "Add Rule" button
3. Add this rule:
   - Type: Rewrite
   - Source: /*
   - Destination: /index.html
   - Action: Rewrite (NOT Redirect!)
4. "Save"

This allows Vue Router to handle client-side routing.
```

---

## STEP 4: Custom Domain Setup (~$10/year)

### 4.1. Buy Domain (Cloudflare Registrar - Recommended)
```
1. Go to https://www.cloudflare.com/products/registrar/
2. Create account or login
3. Search for domain (e.g., yourdomain.com)
4. Add to cart and purchase
5. Price: ~$9-10/year (.com)
6. WHOIS privacy included automatically
```

### 4.2. Connect Frontend Domain (yourdomain.com)
```
RENDER SIDE:
1. Render Dashboard → blog-post-frontend → Settings
2. Find "Custom Domains" section
3. Click "+ Add Custom Domain" button
4. Add two domains:
   - yourdomain.com
   - www.yourdomain.com
5. Render will show you CNAME records

CLOUDFLARE SIDE:
1. Cloudflare Dashboard → Your Domain → DNS → Records
2. Add two DNS records:

For root domain:
Type: CNAME
Name: @
Target: blog-post-frontend-xxxxx.onrender.com
Proxy status: OFF (gray cloud) - Very important!
TTL: Auto

For WWW subdomain:
Type: CNAME
Name: www
Target: blog-post-frontend-xxxxx.onrender.com
Proxy status: OFF (gray cloud)
TTL: Auto

3. Click "Save" button

VERIFY IN RENDER:
1. Wait 5-10 minutes (DNS propagation)
2. Click "Verify" button in Render Dashboard
3. Wait until you see "Certificate Issued"
```

### 4.3. Connect Backend Domain (api.yourdomain.com)
```
RENDER SIDE:
1. Render Dashboard → blog-post-app → Settings
2. Find "Custom Domains" section
3. Click "+ Add Custom Domain" button
4. Add domain: api.yourdomain.com

CLOUDFLARE SIDE:
1. Cloudflare Dashboard → DNS → Records
2. Add DNS record:

Type: CNAME
Name: api
Target: blog-post-app-xxxxx.onrender.com
Proxy status: OFF (gray cloud)
TTL: Auto

3. "Save"

VERIFY IN RENDER:
1. Wait 5-10 minutes
2. Click "Verify" button
3. Wait until you see "Certificate Issued"
```

### 4.4. Update Environment Variables
```
BACKEND:
1. Render → blog-post-app → Environment
2. Update FRONTEND_URL:
   FRONTEND_URL=https://yourdomain.com
3. Save Changes → Redeploy

FRONTEND:
1. Render → blog-post-frontend → Environment
2. Update VITE_API_URL:
   VITE_API_URL=https://api.yourdomain.com/api
3. Save Changes → Redeploy
```

### 4.5. Update Backend CORS
```
Open blog-post-server/app.js locally:

const allowedOrigins = [
  'http://localhost:3001',
  'https://yourdomain.com',
  'https://www.yourdomain.com'
];

Git commit and push → Render will auto-deploy
```

### 4.6. Test
```bash
# Frontend test
curl https://yourdomain.com

# Backend API test
curl https://api.yourdomain.com/api/categories

# In browser:
https://yourdomain.com
```

---

## STEP 5: Load Database Data

### 5.1. Run Migration Locally
```bash
cd blog-post-server

# Update .env file with MongoDB Atlas connection string
MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/blog-post

# Run migration
node migrations/seed-blog-data.js

# Output:
# ✓ MongoDB connected
# ✓ Created 5 categories
# ✓ Created 25 blogs
```

---

## STEP 6: Create First Admin User

### 6.1. Signup with Postman (Temporary)
```
POST https://api.yourdomain.com/api/auth/signup

Body (JSON):
{
  "email": "admin@yourdomain.com",
  "password": "SecurePassword123!@#"
}
```

### 6.2. Disable Signup Endpoint
```
For security, we'll disable signup (already disabled):

In blog-post-server/routes/auth.route.js:
// router.post('/signup', ...) → Commented out

Git push → Render will redeploy

Now nobody can create new accounts!
```

---

## 🎉 COMPLETED!

**Now working:**
- ✅ Frontend: https://yourdomain.com
- ✅ Backend: https://api.yourdomain.com
- ✅ Database: MongoDB Atlas (cloud)
- ✅ SSL: Automatic (everywhere)
- ✅ Auto-Deploy: GitHub push → Automatic deploy

**Total Cost:**
- Domain: ~$10/year
- Render: $0/month (free tier)
- MongoDB Atlas: $0/month (free tier)
- **TOTAL: ~$10/year**

---

## 🚨 Troubleshooting

### Problem 1: Backend 503 Service Unavailable
```
Cause: Render free tier sleeps after 15 minutes of inactivity
Solution: First request takes 30-60 seconds (cold start)

Permanent solution:
- Use UptimeRobot (free)
- Ping every 14 minutes
```

### Problem 2: MongoDB Connection Failed
```
Cause: IP whitelist or connection string error
Solution:
1. MongoDB Atlas → Network Access → Is 0.0.0.0/0 added?
2. Is connection string correct? (special characters must be encoded)
3. Is database user created?
```

### Problem 3: CORS Error
```
Cause: Frontend URL not in backend allowedOrigins
Solution:
1. blog-post-server/app.js → Add to allowedOrigins array
2. Git push
3. Render will auto-redeploy
```

### Problem 4: Frontend 404 on /blogs Route
```
Cause: SPA routing not configured
Solution:
1. Render Dashboard → Static Site → Settings
2. Redirects/Rewrites → Add Rule
3. Type: Rewrite, Source: /*, Destination: /index.html
```

### Problem 5: Custom Domain SSL Not Working
```
Cause: DNS propagation or Cloudflare proxy
Solution:
1. Turn off Cloudflare proxy (gray cloud - DNS only)
2. Wait 10-15 minutes
3. Click "Verify" button again in Render
```

---

## 📊 Monitoring and Maintenance

### Log Monitoring
```
Render Dashboard:
- Frontend: Static Site → Logs
- Backend: Web Service → Logs (Realtime)

MongoDB Atlas:
- Dashboard → Monitoring
- Query performance
- Connection stats
```

### Automatic Deployment
```
When you push to GitHub:
- Frontend: ~2-3 minutes rebuild
- Backend: ~5-10 minutes rebuild
- Both automatic
```

### Database Backup
```
⚠️ IMPORTANT: No automatic backup in free tier!

Manual backup:
1. Connect with MongoDB Compass
2. Export collections
3. Backup weekly
```

---

## 💡 Pro Tips

1. **Environment Variables**: After every change "Save Changes" → Automatic redeploy
2. **Cold Start**: Backend takes ~30-60 seconds on first request (free tier)
3. **Custom Domain**: Cloudflare proxy must be OFF (for Render SSL)
4. **Security**: Signup disabled, only admin can add users manually
5. **Monitoring**: Keep backend awake with UptimeRobot

---

## 🔐 Security Checklist

- ✅ Signup endpoint disabled
- ✅ CORS only allows production domains
- ✅ JWT_SECRET is strong and random
- ✅ MongoDB password is strong
- ✅ Environment variables not in git (.gitignore)
- ✅ Rate limiting active (express-rate-limit)
- ✅ Helmet.js security headers active

---

**Good luck! 🚀**

For questions: Check GitHub Issues or project README.
