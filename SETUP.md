# Setup Guide for Vibe Coding Lifestyle

## Required Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Firebase Configuration
REACT_APP_FIREBASE_API_KEY=your_api_key_here
REACT_APP_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your_project_id_here
REACT_APP_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_sender_id_here
REACT_APP_FIREBASE_APP_ID=your_app_id_here

# Razorpay Configuration
REACT_APP_RAZORPAY_KEY_ID=your_razorpay_key_id_here
REACT_APP_RAZORPAY_KEY_SECRET=your_razorpay_key_secret_here

# Firebase Functions URL (for production)
REACT_APP_FUNCTIONS_URL=https://your-region-your-project.cloudfunctions.net
```

## Firebase Setup Steps

1. **Initialize Firebase in your project:**
   ```bash
   firebase login
   firebase init
   ```

2. **Deploy Firestore rules:**
   ```bash
   firebase deploy --only firestore:rules
   ```

3. **Deploy Cloud Functions:**
   ```bash
   cd functions
   npm install
   cd ..
   firebase deploy --only functions
   ```

## Current Issues to Fix

Based on the console errors, you need to:

1. **Set up environment variables** - Create `.env` file with your Firebase and Razorpay credentials
2. **Deploy Firestore rules** - Run `firebase deploy --only firestore:rules`
3. **Enable Authentication** - Enable Email/Password and Google sign-in in Firebase Console
4. **Create Firestore collections** - The app will create them automatically when users interact

## Testing the Application

Once the environment variables are set up:

1. Restart the development server: `npm start`
2. Open http://localhost:3000
3. Test the following features:
   - User registration/login
   - Subscription payments
   - Webinar registration
   - Analytics tracking

## Permissions Required

The Firestore rules allow:
- Users to read/write their own data
- Anyone to create contact forms and webinar registrations
- Anyone to create analytics events
- Authenticated users to read course content
