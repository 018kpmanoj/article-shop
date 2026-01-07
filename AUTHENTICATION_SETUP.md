# Authentication & Admin Panel Setup Guide

## Features Implemented

### 1. Authentication System
- **Email/Password Login**: Traditional email and password authentication
- **Google OAuth Login**: One-click Google sign-in
- **Password Reset**: Email-based password recovery
- **Persistent Sessions**: Users stay logged in across browser sessions

### 2. 20-Second Login Prompt
- After 20 seconds of browsing, a non-intrusive login prompt appears
- Users can dismiss it or proceed to login
- Dismissed state persists for the session

### 3. Activity Tracking
- Page views tracking
- Login/logout events
- Article reads
- Search queries
- Newsletter subscriptions

### 4. Admin Dashboard (018kpmanoj@gmail.com)
- User management and insights
- Login statistics and methods breakdown
- Page view analytics
- Security monitoring
- Failed login attempt tracking

### 5. DDoS Protection
- Client-side rate limiting (100 requests/minute)
- Login attempt limiting (5 attempts/minute)
- Honeypot protection for forms
- Security headers via Netlify

---

## Firebase Setup Instructions

### Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add Project"
3. Name it (e.g., "kpmanoj-tech")
4. Enable Google Analytics (optional)
5. Click "Create Project"

### Step 2: Enable Authentication

1. In Firebase Console, go to **Authentication** > **Sign-in method**
2. Enable **Email/Password**
3. Enable **Google** provider
   - Add your domain to authorized domains
   - Configure OAuth consent screen if needed

### Step 3: Create Firestore Database

1. Go to **Firestore Database**
2. Click "Create Database"
3. Choose "Start in production mode"
4. Select a location close to your users

### Step 4: Firestore Security Rules

Go to **Firestore Database** > **Rules** and paste:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users collection - users can only read/write their own data
    match /users/{userId} {
      allow read: if request.auth != null && request.auth.uid == userId;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Activities collection - anyone authenticated can write, only admin can read
    match /activities/{activityId} {
      allow write: if true; // Allow tracking even for non-authenticated users
      allow read: if request.auth != null && 
                    request.auth.token.email == '018kpmanoj@gmail.com';
    }
    
    // Admin-only collections
    match /admin/{document=**} {
      allow read, write: if request.auth != null && 
                           request.auth.token.email == '018kpmanoj@gmail.com';
    }
  }
}
```

### Step 5: Get Firebase Configuration

1. Go to **Project Settings** > **General**
2. Scroll to "Your apps" and click the Web icon (`</>`)
3. Register your app
4. Copy the configuration values

### Step 6: Configure Environment Variables

Create `.env.local` in the project root:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abc123def456
```

---

## Netlify Deployment

### Step 1: Install Netlify CLI

```bash
npm install -g netlify-cli
```

### Step 2: Login to Netlify

```bash
netlify login
```

### Step 3: Initialize Netlify

```bash
netlify init
```

Choose:
- Create & configure a new site
- Select your team
- Enter a site name

### Step 4: Configure Environment Variables in Netlify

1. Go to Netlify Dashboard > Your Site > Site Settings > Environment Variables
2. Add all Firebase environment variables:
   - `NEXT_PUBLIC_FIREBASE_API_KEY`
   - `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
   - `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
   - `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
   - `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
   - `NEXT_PUBLIC_FIREBASE_APP_ID`

### Step 5: Deploy

```bash
netlify deploy --prod
```

Or connect to GitHub for automatic deployments:
1. Go to Netlify Dashboard > Site Settings > Build & Deploy
2. Connect to your GitHub repository
3. Configure build settings:
   - Build command: `npm run build`
   - Publish directory: `.next`

---

## GitHub Deployment

### Step 1: Initialize Git (if not already)

```bash
git init
git remote add origin https://github.com/018kpmanoj/your-repo-name.git
```

### Step 2: Create .gitignore

Make sure these are in `.gitignore`:
```
node_modules/
.next/
out/
.env
.env.local
.env*.local
```

### Step 3: Commit and Push

```bash
git add .
git commit -m "feat: Add authentication system with Firebase"
git push -u origin main
```

---

## Admin Access

The admin email `018kpmanoj@gmail.com` has special privileges:
- Access to `/admin` dashboard
- View all user activities
- See login statistics
- Monitor security events

To access the admin panel:
1. Sign in with 018kpmanoj@gmail.com
2. Click your profile icon
3. Select "Admin Dashboard"

---

## Security Features

### Client-Side Protection
- Rate limiting: 100 requests per minute
- Login attempts: 5 per minute before 15-minute lockout
- Honeypot fields for bot detection
- Form submission speed checks

### Server-Side Protection (via Netlify)
- Security headers (CSP, HSTS, X-Frame-Options)
- Rate limiting headers
- HTTPS enforcement

### Firebase Security
- Firestore rules restrict access
- Authentication state managed securely
- Admin-only access to analytics data

---

## Troubleshooting

### "Firebase not initialized" error
- Ensure all environment variables are set correctly
- Check that Firebase config values match your project

### Google login popup closes immediately
- Add your domain to Firebase authorized domains
- Check browser popup blocker settings

### Admin dashboard not loading
- Verify you're logged in with 018kpmanoj@gmail.com
- Check Firestore rules are deployed

### Rate limit errors
- Wait for the cooldown period
- Clear localStorage to reset client-side limits

---

## File Structure

```
article/
├── app/
│   ├── admin/
│   │   └── page.js          # Admin dashboard
│   ├── layout.js            # Root layout with AuthProvider
│   └── page.js              # Home page
├── components/
│   ├── ActivityTracker.js   # Page view tracking
│   ├── LoginModal.js        # Login/signup modal
│   ├── LoginPrompt.js       # 20-second prompt + user menu
│   └── Header.js            # Updated with auth
├── context/
│   └── AuthContext.js       # Authentication state
├── lib/
│   ├── firebase.js          # Firebase configuration
│   ├── activityTracker.js   # Activity tracking utilities
│   └── rateLimiter.js       # DDoS protection
├── netlify.toml             # Netlify configuration
├── next.config.js           # Next.js configuration
└── package.json             # Dependencies
```
