# Study Planner AI 🎓

An AI-powered study planner that helps students create personalized study schedules based on their syllabus and exam dates.

## Features

### For Students
- 📝 **Personalized Study Plans**: AI-generated study schedules based on your specific needs
- 📊 **Progress Tracking**: Visual progress bar showing completion percentage
- ✅ **Task Management**: Mark tasks as complete, skip with reason, or upload evidence
- 📅 **Date-based Organization**: Tasks grouped by date for easy planning
- 🔄 **Real-time Updates**: Instant synchronization across devices

### For Admins
- 👥 **Student Management**: View all registered students
- 📋 **Task Oversight**: Monitor all student tasks and submissions
- ✔️ **Verification System**: Approve or reject student evidence
- 📈 **Progress Monitoring**: Track individual student progress

## Tech Stack

- **Framework**: Next.js 14+ (App Router)
- **Styling**: Tailwind CSS + Shadcn UI
- **Authentication**: Firebase Auth (Email/Password)
- **Database**: Firebase Firestore
- **AI**: Google Gemini (Flash 2.0)
- **Deployment**: Vercel (Free Tier Compatible)

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Firebase account
- Google Gemini API key

### Installation

1. **Clone the repository**
   ```bash
   cd Zentrix
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**

   Create a `.env.local` file in the root directory:

   ```env
   # Firebase
   NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-auth-domain
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-storage-bucket
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
   NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id

   # Firebase Admin (for API routes)
   FIREBASE_CLIENT_EMAIL=your-service-account-email
   FIREBASE_PRIVATE_KEY=your-service-account-private-key

   # Google Gemini
   GEMINI_API_KEY=your-gemini-api-key
   ```

4. **Firebase Setup**

   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Create a new project or use existing one
   - Enable **Authentication** > Email/Password
   - Create a **Firestore Database** in production mode
   - Download service account key from Project Settings > Service Accounts
   - Add the credentials to `.env.local`

5. **Run the development server**
   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000)

## Firestore Security Rules

Add these security rules to your Firestore:

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

## Usage

### For Students

1. **Sign Up**: Create an account with email and password (select "Student" role)
2. **Onboarding**: Fill out your class, subjects, syllabus completion %, and exam date
3. **Generate Plan**: Click "Generate AI Study Plan" to create your personalized schedule
4. **Manage Tasks**: 
   - Mark tasks as complete
   - Skip tasks with a reason
   - Upload evidence (links or notes)
5. **Track Progress**: Monitor your completion percentage

### For Admins

1. **Sign Up**: Create an account with "Admin" role
2. **View Students**: See all registered students in the sidebar
3. **Monitor Tasks**: Click on a student to view their tasks
4. **Verify Evidence**: Approve or reject student submissions

## Deployment to Vercel

1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Deploy to Vercel**
   - Go to [Vercel](https://vercel.com/)
   - Import your repository
   - Add environment variables from `.env.local`
   - Deploy!

3. **Important**: Make sure to add all environment variables in Vercel's project settings

## Project Structure

```
Zentrix/
├── src/
│   ├── app/
│   │   ├── admin/          # Admin dashboard
│   │   ├── api/            # API routes
│   │   │   └── generate-plan/  # AI plan generation
│   │   ├── dashboard/      # Student dashboard
│   │   ├── login/          # Login page
│   │   ├── onboarding/     # Student onboarding
│   │   ├── signup/         # Signup page
│   │   ├── layout.tsx      # Root layout
│   │   └── page.tsx        # Home page
│   ├── components/
│   │   └── ui/             # Shadcn UI components
│   ├── contexts/
│   │   └── AuthContext.tsx # Authentication context
│   └── lib/
│       ├── firebase.ts     # Firebase config
│       └── utils.ts        # Utility functions
├── .env.local              # Environment variables
└── package.json
```

## Database Schema

### Users Collection
```typescript
{
  uid: string;
  email: string;
  role: "student" | "admin";
  profile?: {
    class?: string;
    subjects?: string[];
    syllabusCompleted?: number;
    examDate?: string;
  };
}
```

### Tasks Collection
```typescript
{
  id: string;
  userId: string;
  subject: string;
  description: string;
  date: Timestamp;
  status: "pending" | "completed" | "verified";
  evidence?: string;
  createdAt: Timestamp;
}
```

## API Routes

### POST `/api/generate-plan`

Generates an AI study plan based on student information.

**Request Body:**
```json
{
  "class": "10th Grade",
  "subjects": ["Mathematics", "Physics", "Chemistry"],
  "syllabusCompleted": 50,
  "examDate": "2026-03-15"
}
```

**Authentication:** Requires Firebase ID token in Authorization header

## Customization

### AI Prompt
Edit the prompt in `src/app/api/generate-plan/route.ts` to customize how the AI generates study plans.

### Styling
- Theme colors are defined in `tailwind.config.ts`
- CSS variables in `src/app/globals.css`

## Troubleshooting

**Issue**: API routes fail with Firebase Admin errors
- **Solution**: Make sure service account credentials are properly set in `.env.local`

**Issue**: OpenAI rate limits
- **Solution**: Consider implementing request throttling or upgrading your OpenAI plan

**Issue**: Firestore permission denied
- **Solution**: Check your Firestore security rules match the ones provided above

## License

MIT

## Support

For issues and questions, please open an issue on GitHub.

---

Built with ❤️ using Next.js, Firebase, and OpenAI
