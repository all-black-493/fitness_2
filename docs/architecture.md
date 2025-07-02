# Architecture

## Overview
This app is a modular, type-safe, real-time fitness social platform. It uses Next.js App Router, Supabase (Postgres, Auth, RLS), Tailwind CSS, shadcn/ui, Zustand, OpenAI, GetStream.io, and Stripe.

## GetStream.io Video & Chat Setup

### 1. Install Packages
- `@stream-io/video-react-sdk` (video)
- `stream-chat` and `stream-chat-react` (chat)

### 2. Environment Variables
- `NEXT_PUBLIC_STREAM_API_KEY` — Your Stream project public API key (required in `.env.local`)

### 3. User Tokens
- For dev, use Stream's dev token generator (see Stream docs)
- For production, generate user tokens securely on your backend (never expose secret keys to the client)

### 4. Quickstart
- Video: See `components/dashboard/live-stream-section.tsx` for usage of `StreamVideoClient`, `Call`, and UI components.
- Chat: See `components/communities/community-chat.tsx` for usage of `StreamChat`, `Chat`, `Channel`, and UI components.
- Both video and chat require the same API key and user token for the authenticated user.

### 5. References
- [Stream Video React SDK Docs](https://getstream.io/video/docs/react/)
- [Stream Chat React SDK Docs](https://getstream.io/chat/docs/sdk/react/)

## Folder Structure
- `/app` - Next.js App Router pages, layouts, API routes
- `/components` - UI and feature components
- `/hooks` - React hooks for data/state
- `/lib` - Integrations (Supabase, OpenAI, Stream, Stripe), actions, utils
- `/supabase` - DB config, migrations
- `/public` - Static assets
- `/styles` - Tailwind/global CSS
- `/docs` - Documentation

## Data Flow
- **Client**: Uses hooks to fetch/mutate data via Supabase, OpenAI, Stream, Stripe
- **Server**: API routes for server actions, validation, and secure data access
- **State**: Zustand for global UI state, Supabase real-time for sync

## Key Conventions
- TypeScript everywhere
- RLS enforced in DB
- Use hooks/services for all data access
- Modular, composable components
- Use Tailwind + shadcn/ui for styling
- All secrets in env vars

## See Also
- [AI Planner](./ai-planner.md)
- [Notifications](./notifications.md)

# Stripe Integration

## Environment Variables
- `STRIPE_SECRET_KEY` — Your Stripe secret key (server only)
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` — Your Stripe publishable key (client)

## Local Testing
- Use Stripe test mode and test cards (see below)
- Use `4242 4242 4242 4242` for a successful payment
- Use `4000 0000 0000 9995` for a declined payment
- See [Stripe test cards](https://docs.stripe.com/payments/dashboard-payment-methods#cards) for more

## Security
- Never expose your secret key to the client
- All payment actions must be server-side only
- Use webhooks to handle post-payment events (e.g., order fulfillment)

## References
- [Stripe Docs](https://docs.stripe.com/)

# Achievements

## Overview
- Achievements are stored in the `achievements` table, linked to each user profile by `profile_id`.
- Each achievement typically has: `id`, `profile_id`, `title`, `description`, `icon`, `category`, `unlocked` (boolean), `unlocked_at` (timestamp), and any custom fields.

## Unlocking Achievements
- Achievements are unlocked automatically based on user activity (e.g., workout streaks, milestones, challenge completions).
- The logic for unlocking is handled in Supabase triggers/functions or in the backend services.
- The UI displays unlocked and locked achievements with distinct styles and ARIA labels for accessibility.

## Adding New Achievements
1. Add a new row to the `achievements` table (or update your achievement definitions if using a static table).
2. Update any logic (triggers, backend, or client) that awards achievements based on new criteria.
3. Optionally, add a new icon or badge to the UI.

## Type Safety & Local Supabase Development
- To ensure type safety, always regenerate your Supabase types after schema changes:

```sh
supabase gen types typescript --project-id <your-project-id> --schema public > database.types.ts
```
- If using the default local instance, you can omit `--project-id`.
- This will update `database.types.ts` with the latest schema, including the `achievements` table.

## References
- See `hooks/use-profile.ts` for how achievements are fetched.
- See the Profile page for how achievements are displayed and styled. 