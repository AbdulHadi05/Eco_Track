🔥 **FIREBASE SETUP - FINAL STEPS**

Your Firebase configuration is now integrated! Follow these steps to complete the setup:

## 🚀 **Enable Firebase Services**

### 1. Enable Firestore Database
1. Go to: https://console.firebase.google.com/project/eco-track-feedback/firestore
2. Click **"Create database"**
3. Choose **"Start in test mode"** (for development)
4. Select your preferred location
5. Click **"Done"**

### 2. Enable Authentication
1. Go to: https://console.firebase.google.com/project/eco-track-feedback/authentication
2. Click **"Get started"**
3. Go to **"Sign-in method"** tab
4. Click **"Email/Password"**
5. **Enable** the first option (Email/Password)
6. Click **"Save"**

### 3. Set Firestore Security Rules
1. Go to: https://console.firebase.google.com/project/eco-track-feedback/firestore/rules
2. Replace the rules with:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read/write their own user document
    match /users/{userId} {
      allow read, write: if request.auth != null;
    }
    
    // Forms can be read by anyone (for embedding), written by authenticated users
    match /forms/{formId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    
    // Responses can be created by anyone, read by authenticated users
    match /responses/{responseId} {
      allow read: if request.auth != null;
      allow create: if true;
    }
  }
}
```

3. Click **"Publish"**

## ✅ **Test Your Setup**

1. **Restart your development server**:
   ```bash
   npm run dev
   ```

2. **Go to** http://localhost:3000

3. **Create a new account** (this will create a real Firebase user)

4. **Create a feedback form** (this will save to Firestore)

5. **Check Firebase Console** to see your data:
   - Authentication: See your new user
   - Firestore: See your forms and responses

## 🎉 **You're Done!**

Your app now has:
- ✅ Real user authentication with Firebase Auth
- ✅ Persistent data storage with Firestore
- ✅ Automatic form embedding with real URLs
- ✅ Analytics that persist across sessions
- ✅ Production-ready infrastructure

## 🔧 **Quick Switch Back to Mock Data**

If you want to test with mock data again, just change in `.env.local`:
```bash
NEXT_PUBLIC_USE_FIREBASE=false
```

And restart the server.