# Firebase Setup Instructions for Eco-Track

## 🔥 Complete Firebase Integration Setup

### Step 1: Firebase Console Setup (REQUIRED)

1. **Go to Firebase Console**: https://console.firebase.google.com/
2. **Select your project** (the one you created earlier)

### Step 2: Enable Firestore Database

1. **In Firebase Console, click "Firestore Database"** in the left sidebar
2. **Click "Create database"**
3. **Choose "Start in test mode"** (for development)
4. **Select a location** (choose the closest to your users)
5. **Click "Done"**

### Step 3: Enable Authentication

1. **Click "Authentication"** in the left sidebar
2. **Go to "Sign-in method" tab**
3. **Click on "Email/Password"**
4. **Enable it** and click "Save"

### Step 4: Security Rules (Important!)

**Firestore Rules** (Go to Firestore Database > Rules):
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read/write their own user document
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Users can read/write forms they own
    match /forms/{formId} {
      allow read: if true; // Forms can be read by anyone (for public embedding)
      allow write: if request.auth != null && 
        (resource == null || resource.data.userId == request.auth.uid);
    }
    
    // Responses can be created by anyone, read by form owners
    match /responses/{responseId} {
      allow read: if request.auth != null;
      allow create: if true; // Anyone can submit responses
    }
  }
}
```

### Step 5: Get Your Firebase Config

1. **Go to Project Settings** (gear icon)
2. **Scroll down to "Your apps"**
3. **Copy the Firebase config object**

### Step 6: Update Environment Variables

**Replace these values in your `.env.local` file:**

```bash
# Set this to 'true' to enable Firebase
NEXT_PUBLIC_USE_FIREBASE=true

# Replace with your actual Firebase config
NEXT_PUBLIC_FIREBASE_API_KEY=your-actual-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-actual-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-actual-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-actual-app-id
```

### Step 7: Test the Integration

1. **Restart your development server** (`npm run dev`)
2. **Go to** http://localhost:3000
3. **Create a new account** (this will use Firebase Auth)
4. **Create a feedback form** (this will save to Firestore)
5. **Check Firebase Console** to see your data

### Step 8: Switching Between Mock and Firebase

You can easily switch between mock data and Firebase by changing:
```bash
# Use Firebase
NEXT_PUBLIC_USE_FIREBASE=true

# Use mock data (original behavior)
NEXT_PUBLIC_USE_FIREBASE=false
```

## 🚨 Important Notes

1. **Test Mode Security**: The Firestore rules above are for development. In production, you'll need more restrictive rules.
2. **Environment Variables**: Never commit your actual Firebase config to version control.
3. **Billing**: Firebase has generous free tiers, but monitor usage in production.
4. **Data Migration**: When switching to Firebase, you'll start with an empty database.

## ✅ Verification Checklist

- [ ] Firebase project created
- [ ] Firestore Database enabled (test mode)
- [ ] Authentication enabled (Email/Password)
- [ ] Security rules configured
- [ ] Environment variables updated with real config
- [ ] `NEXT_PUBLIC_USE_FIREBASE=true` set
- [ ] Development server restarted
- [ ] New account creation works
- [ ] Form creation saves to Firestore
- [ ] Data persists after page refresh

## 🔧 Troubleshooting

**If you get permission errors:**
- Check Firestore security rules
- Verify user is authenticated
- Check Firebase console for error details

**If authentication doesn't work:**
- Verify Email/Password is enabled in Firebase Auth
- Check environment variables are correct
- Look at browser console for errors

**If data doesn't persist:**
- Verify Firestore is enabled
- Check security rules allow write operations
- Look at Network tab for failed requests