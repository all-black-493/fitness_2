# Notifications System

## Overview
Notifications alert users to important activity (likes, comments, friend requests, challenge updates, etc.) in real time.

## How It Works
- **DB Table**: `notifications` (see Supabase schema)
- **Generation**: Created by triggers (e.g., like, comment) or server actions
- **Delivery**: Real-time via Supabase subscriptions
- **UI**: Displayed in notifications panel, badge, and toast

## Real-Time Flow
1. User action (like, comment, etc.) triggers a notification row in DB
2. Supabase subscription pushes update to client
3. Zustand store updates notification state
4. UI panel/toast displays new notification

## Example Schema
```sql
CREATE TABLE notifications (
  id uuid PRIMARY KEY,
  user_id uuid REFERENCES profiles(id),
  type text,
  data jsonb,
  read boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);
```

## UI Integration
- Hook: `use-notifications`
- Store: Zustand (`app-store.ts`)
- Components: `notifications-panel.tsx`, badge, toast 