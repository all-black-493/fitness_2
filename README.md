# Social Fitness Logger

A production-ready fitness social platform built with Next.js, Supabase, Tailwind CSS, shadcn/ui, OpenAI, GetStream.io, and Stripe.

## Features
- User registration, login, profile
- Workout logging & stats
- Friends, comments, likes, activity feed
- Real-time notifications
- Achievements, milestones, challenges
- Communities & posts
- AI-powered workout planner
- Live stream & chat (GetStream.io)
- Stripe payments (store)

## Tech Stack
- Next.js (App Router, SSR, RSC)
- Supabase (Postgres, Auth, RLS)
- Tailwind CSS, shadcn/ui
- Zustand (state)
- OpenAI (AI planner)
- GetStream.io (live/chat)
- Stripe (payments)

## Getting Started

### 1. Clone the repository
```bash
git clone <repository-url>
cd social-fitness-logger
```

### 2. Install dependencies
```bash
pnpm install
```

### 3. Set up environment variables
Create a `.env.local` file in the root directory with the following variables:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key_here

# OpenAI Configuration
OPENAI_API_KEY=your_openai_api_key_here

# GetStream.io Configuration
NEXT_PUBLIC_STREAM_API_KEY=your_stream_api_key_here
STREAM_SECRET_KEY=your_stream_secret_key_here

# Stripe Configuration (for payments)
STRIPE_SECRET_KEY=your_stripe_secret_key_here
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key_here
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret_here

# Next.js Configuration
NEXTAUTH_SECRET=your_nextauth_secret_here
NEXTAUTH_URL=http://localhost:3000
```

### 4. Set up Supabase
1. Create a new Supabase project at [supabase.com](https://supabase.com)
2. Run the database migrations:
   ```bash
   npx supabase db push
   ```
3. Set up Row Level Security (RLS) policies in your Supabase dashboard

### 5. Set up OpenAI
1. Get an API key from [OpenAI](https://platform.openai.com/api-keys)
2. Add it to your `.env.local` file

### 6. Set up GetStream.io
1. Create an account at [GetStream.io](https://getstream.io)
2. Create a new app for video calls
3. Get your API key and secret
4. Add them to your `.env.local` file

### 7. Set up Stripe (optional)
1. Create a Stripe account at [stripe.com](https://stripe.com)
2. Get your API keys from the dashboard
3. Add them to your `.env.local` file

### 8. Run the development server
```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL | Yes |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anonymous key | Yes |
| `SUPABASE_SERVICE_ROLE_KEY` | Your Supabase service role key | Yes |
| `OPENAI_API_KEY` | Your OpenAI API key | Yes |
| `NEXT_PUBLIC_STREAM_API_KEY` | Your GetStream.io API key | Yes |
| `STREAM_SECRET_KEY` | Your GetStream.io secret key | Yes |
| `STRIPE_SECRET_KEY` | Your Stripe secret key | No |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Your Stripe publishable key | No |
| `STRIPE_WEBHOOK_SECRET` | Your Stripe webhook secret | No |
| `NEXTAUTH_SECRET` | NextAuth.js secret | Yes |
| `NEXTAUTH_URL` | Your application URL | Yes |

## Architecture
- `/app` - Next.js App Router pages & API
- `/components` - UI & feature components
- `/hooks` - React hooks for data/state
- `/lib` - Integrations, actions, utils
- `/supabase` - DB config & migrations
- `/public` - Static assets

## Key Features Implementation

### AI Workout Planner
- Uses OpenAI GPT-4o to generate personalized workout plans
- Saves plans to Supabase database
- Includes nutrition recommendations
- Server actions for secure API calls

### Live Streaming
- Powered by GetStream.io video SDK
- Real-time chat and video streaming
- User authentication and token management
- Active stream discovery

### Real-time Notifications
- Supabase real-time subscriptions
- Push notifications for various events
- Notification preferences and management

### Social Features
- Friend requests and management
- Activity feed with likes and comments
- Community creation and moderation
- Challenge participation and leaderboards

## AI Planner
See `docs/ai-planner.md` for details on OpenAI integration and usage.

## Notifications
See `docs/notifications.md` for real-time notification system details.

## Contributing
PRs welcome! See `docs/architecture.md` for project structure and conventions.

## License
MIT License 