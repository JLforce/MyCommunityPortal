# MyCommunityPortal

This is a Next.js project bootstrapped with create-next-app.

# Prerequisites
```
- Node.js 16.x or later
- Git
- npm (comes with Node.js)
```
# Installation Steps

1. Clone the repository
```bash
git clone <repository-url>
cd MyCommunityPortal
```
 
2. Install dependencies
```bash
npm install
```

3. Set up environment variables
- Create a `.env.local` file in the root directory
- Add your environment variables:
```env
# Supabase Configuration (Required)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Google Gemini API Key (Required)
GOOGLE_API_KEY=your_google_api_key

# Optional: Site URL for email redirects
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

**How to get these values:**
- **Supabase**: Go to [supabase.com](https://supabase.com) → Your Project → Settings → API
- **Google API Key**: Go to [Google Cloud Console](https://console.cloud.google.com) → APIs & Services → Credentials → Create API Key
 
4. Build the project
```bash
npm run build
```
 if Module not found: Can't resolve '@supabase/ssr'
```bash
npm install @supabase/ssr
```
then run number 4 again 

5. Start the development server
```bash
npm run dev
```
Or for production:
```bash
npm start
```


Open http://localhost:3000 with your browser to see the result.

You can start editing the page by modifying app/page.js. The page auto-updates as you edit the file.

This project uses next/font to automatically optimize and load Geist, a new font family for Vercel.

Learn More
To learn more about Next.js, take a look at the following resources:

Next.js Documentation - learn about Next.js features and API.
Learn Next.js - an interactive Next.js tutorial.
You can check out the Next.js GitHub repository - your feedback and contributions are welcome!

## 🚀 Deployment

**📖 For detailed deployment instructions, see [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)**

### Quick Deploy Options:

1. **Vercel (Recommended)** - Made by Next.js creators
   - Push code to GitHub
   - Import project on [vercel.com](https://vercel.com)
   - Add environment variables in project settings
   - Deploy automatically

2. **Netlify** - Alternative platform
   - Push code to GitHub
   - Import project on [netlify.com](https://netlify.com)
   - Add environment variables
   - Deploy

### Required Environment Variables for Deployment:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `GOOGLE_API_KEY`

See [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) for step-by-step instructions.


# FILE STRUCTURE FOR NEXT.JS APP ROUTER

```
my-nextjs-app/
│
├── public/                 # Static assets served directly by Next.js
│   ├── images/             # Static image files (logos, backgrounds, etc.)
│   ├── icons/              # SVG or icon files
│   └── fonts/              # Custom font files
│
├── src/
│   ├── app/                # Next.js App Router main directory
│   │   ├── (routes)/       # Grouped routes for logical organization
│   │   │   ├── dashboard/  # Dashboard-specific routes
│   │   │   │   ├── page.js     # Dashboard main page component
│   │   │   │   └── layout.js   # Dashboard-specific layout  
│   │   │   │                   # Not necessary unless you need a separate layout
│   │   │   ├── profile/    # Profile-related routes
│   │   │   │   ├── page.js     # Profile page component
│   │   │   │   └── layout.js   # Profile page layout  
│   │   │   │                   # Not necessary unless you need a separate layout
│   │   │   └── page.js     # Root/home page
│   │   │
│   │   ├── actions/        # Server actions for handling backend logic
│   │   │   ├── auth.js     # Authentication actions (sign in, sign out)
│   │   │   ├── user.js     # User-related actions
│   │   │   └── data.js     # Database actions (fetch, create, update, delete)
│   │   │
│   │   └── layout.js       # Root application layout  
│   │                       # This is usually enough to layout everything in (routes/)
│   │
│   ├── components/         # Reusable React components
│   │   ├── common/         # Basic, generic UI components
│   │   │   ├── Button.js   # Reusable button component
│   │   │   ├── Input.js    # Generic input field component
│   │   │   └── Card.js     # Flexible card/container component
│   │   │
│   │   ├── layout/         # Page structure components
│   │   │   ├── Header.js   # Site-wide header
│   │   │   ├── Footer.js   # Site-wide footer
│   │   │   └── Sidebar.js  # Navigation sidebar
│   │   │
│   │   └── features/       # Complex, feature-specific components
│   │       ├── dashboard/  # Dashboard-specific components
│   │       └── profile/    # Profile page-specific components
│   │
│   ├── lib/                # Utility functions and services
│   │   ├── utils.js        # General utility functions
│   │   ├── hooks/          # Custom React hooks
│   │   │   ├── useAuth.js      # Authentication-related hook (integrates with BaaS)
│   │   │   ├── useDatabase.js  # Hook for interacting with the database
│   │   │   └── useStorage.js   # Hook for handling file storage
│   │   │
│   │   └── services/       # External service integrations
│   │       ├── appwrite.js  # Appwrite setup & API calls
│   │       ├── api.js      # Generic API call helpers/configurations
│   │       └── auth.js     # Authentication service (if using NextAuth)
│   │
│   ├── state/              # Global state management (contexts & stores)
│   │   ├── AuthContext.js  # Authentication state management
│   │   ├── ThemeContext.js # Theme/appearance state management
│   │   ├── useStore.js     # Zustand store for global state
│   │   └── store.js        # Redux store (if using Redux)
│   │
│   ├── styles/             # Styling resources
│   │   ├── globals.css     # Global CSS styles
│   │   └── custom.css      # Additional custom styles
│   │
├── .env.local              # Local environment variables (BaaS API keys)
├── .gitignore              # Git ignore configuration
├── next.config.js          # Next.js configuration
├── tailwind.config.js      # Tailwind CSS configuration
├── postcss.config.js       # PostCSS configuration for Tailwind
└── package.json            # Project dependencies and scripts
```


