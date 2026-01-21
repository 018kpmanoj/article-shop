# Netlify Environment Variables Setup

## Required Environment Variables

For the site to work properly on Netlify, you need to set up the following environment variables:

### 1. Firebase Configuration (Required for Authentication & Database)

Go to **Netlify Dashboard** → **Site Settings** → **Environment Variables** and add:

```
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

### How to Get Firebase Credentials:
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project (or create a new one)
3. Go to **Project Settings** (gear icon) → **General**
4. Scroll down to **Your apps** section
5. Click on your web app (or create one if not exists)
6. Copy the `firebaseConfig` values

### 2. Resend API Key (Required for Newsletter Emails)

```
RESEND_API_KEY=re_your_api_key_here
```

### How to Get Resend API Key:
1. Go to [resend.com](https://resend.com)
2. Sign up or log in
3. Go to **API Keys** in the dashboard
4. Create a new API key
5. Copy the key (starts with `re_`)

---

## Setting Environment Variables in Netlify

1. Go to [app.netlify.com](https://app.netlify.com)
2. Select your site: **kpmtechworld**
3. Go to **Site configuration** → **Environment variables**
4. Click **Add a variable**
5. Add each variable with its key and value
6. **Important**: After adding variables, trigger a new deploy:
   - Go to **Deploys** → **Trigger deploy** → **Deploy site**

---

## Firebase Security Rules

Make sure your Firestore has proper security rules. Go to Firebase Console → Firestore → Rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users collection
    match /users/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Newsletter subscribers
    match /newsletter_subscribers/{docId} {
      allow read: if request.auth != null;
      allow create: if true; // Allow public subscriptions
      allow update, delete: if request.auth != null && request.auth.token.email == '018kpmanoj@gmail.com';
    }
    
    // Activities (page views, etc.)
    match /activities/{docId} {
      allow read: if request.auth != null && request.auth.token.email == '018kpmanoj@gmail.com';
      allow create: if true;
    }
    
    // Visitors
    match /visitors/{docId} {
      allow read: if request.auth != null && request.auth.token.email == '018kpmanoj@gmail.com';
      allow create: if true;
    }
    
    // Product interests
    match /product_interests/{docId} {
      allow read: if request.auth != null && request.auth.token.email == '018kpmanoj@gmail.com';
      allow create: if true;
    }
  }
}
```

---

## Troubleshooting

### "auth/api-key-not-valid" Error
- Check that `NEXT_PUBLIC_FIREBASE_API_KEY` is correctly set in Netlify
- Make sure there are no extra spaces or quotes around the value
- Trigger a new deploy after adding the variable

### Newsletter emails not sending
- Verify `RESEND_API_KEY` is set in Netlify
- Check that you've verified your domain in Resend (or use their sandbox domain)
- For testing, emails will be sent from `onboarding@resend.dev`

### Sign-in popup blocked
- Make sure your domain is added to Firebase Console → Authentication → Settings → Authorized domains
- Add both `kpmtechworld.netlify.app` and `localhost`
