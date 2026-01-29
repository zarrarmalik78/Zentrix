# Setup Guide - Study Planner AI

## 🚀 Quick Start

Follow these steps to get your Study Planner AI up and running.

### 1. Prerequisites

- Node.js 18+ installed
- A Firebase account (free tier works!)
- An OpenAI API key ([Get one here](https://platform.openai.com/api-keys))

### 2. Install Dependencies

```bash
npm install
```

### 3. Firebase Setup

#### 3.1 Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project"
3. Follow the wizard to create your project

#### 3.2 Enable Authentication

1. In your Firebase project, go to **Build** > **Authentication**
2. Click "Get started"
3. Enable **Email/Password** sign-in method
4. Click "Save"

#### 3.3 Create Firestore Database

1. Go to **Build** > **Firestore Database**
2. Click "Create database"
3. Start in **production mode**
4. Choose a location close to your users
5. Click "Enable"

#### 3.4 Set Security Rules

Click on the **Rules** tab and paste:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users collection
    match /users/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Tasks collection
    match /tasks/{taskId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && 
        (resource.data.userId == request.auth.uid || 
         get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin');
    }
  }
}
```

Click "Publish"

#### 3.5 Get Firebase Config

1. Go to **Project Settings** (gear icon) > **General**
2. Scroll to "Your apps" and click the **Web** icon (`</>`)
3. Register your app with a nickname like "Study Planner Web"
4. Copy the `firebaseConfig` object

#### 3.6 Get Service Account Key (for API routes)

1. In **Project Settings**, go to the **Service accounts** tab
2. Click "Generate new private key"
3. Click "Generate key" - a JSON file will download
4. Open the JSON file and copy:
   - `client_email`
   - `private_key`

### 4. Environment Variables

Create a `.env.local` file in the root directory:

```env
# Firebase Client Config (from Web app config)
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key-here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-auth-domain.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id

# Firebase Admin (from service account JSON)
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYourPrivateKeyHere\n-----END PRIVATE KEY-----\n"

# OpenAI
OPENAI_API_KEY=sk-your-openai-api-key-here
```

**Important**: The `FIREBASE_PRIVATE_KEY` must be wrapped in quotes and include the `\n` characters as shown.

### 5. Update Firebase Config File

Edit `src/lib/firebase.ts` with your Firebase config:

```typescript
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY!,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN!,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET!,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID!,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID!,
};
```

### 6. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 7. Test the Application

1. **Sign Up**: Create a student account
2. **Onboarding**: Fill in your class, subjects, exam date
3. **Generate Plan**: Click the button to generate your AI study plan
4. **Dashboard**: View and manage your tasks

## 🎯 Troubleshooting

### Build Errors

If you get TypeScript errors, run:
```bash
npm run build
```

### Firebase Permission Errors

- Make sure Firestore security rules are properly set
- Verify environment variables are correctly configured

### API Route Errors

- Check that `OPENAI_API_KEY` is valid
- Ensure Firebase Admin credentials are correct
- Private key must include `\n` characters

### "Module not found" Errors

```bash
rm -rf node_modules .next
npm install
npm run dev
```

## 📦 Deployment to Vercel

1. Push your code to GitHub

2. Go to [Vercel](https://vercel.com/) and import your repository

3. In the deployment settings, add all environment variables from `.env.local`

4. Deploy!

**Note**: Make sure to add the environment variables in Vercel's project settings under "Environment Variables"

## 🔐 Security Notes

- Never commit `.env.local` to version control
- Keep your Firebase service account key secure
- Rotate API keys regularly
- For production, consider additional security measures

## 📚 Next Steps

- Customize the AI prompt in `/api/generate-plan/route.ts`
- Adjust theme colors in `tailwind.config.ts`
- Add more features like notifications
- Implement password reset functionality

## 💡 Tips

- The app works on the free tiers of all services
- OpenAI GPT-4o-mini is cost-effective for this use case
- Firebase Spark plan allows 50k reads/day - enough for MVP
- Vercel Hobby plan is perfect for personal projects

---

Need help? Check the README.md or open an issue on GitHub!
