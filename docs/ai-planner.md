# AI Workout Planner

## Overview
The AI Planner uses OpenAI GPT-4 to generate personalized workout plans and suggestions based on user history, goals, and feedback.

## Integration
- Code: `lib/ai/openai.ts`
- Uses OpenAI API via `openai` npm package
- API route: `/api/ai-planner/generate`
- Hook: `use-ai-planner`

## Usage
- User requests a plan via the UI
- The hook calls the API route, which calls OpenAI
- The response is streamed or returned to the UI

## Example
```ts
import { generateAIPlan } from '@/lib/ai/openai'

const plan = await generateAIPlan({
  messages: [
    { role: 'system', content: 'You are a fitness coach.' },
    { role: 'user', content: 'Plan a 3-day split for a beginner.' }
  ]
})
```

## Error Handling
- Handles missing API key
- Returns user-friendly error messages
- Logs errors to console 