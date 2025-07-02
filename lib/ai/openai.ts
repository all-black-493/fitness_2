import { OpenAI } from 'openai'

export const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
})

export async function generateAIPlan({ messages, model = 'gpt-4o', temperature = 0.7 }: {
    messages: { role: 'system' | 'user' | 'assistant', content: string }[],
    model?: string,
    temperature?: number
}) {
    if (!process.env.OPENAI_API_KEY) {
        throw new Error('Missing OPENAI_API_KEY')
    }
    try {
        const completion = await openai.chat.completions.create({
            model,
            messages,
            temperature
        })
        return completion.choices[0]?.message?.content || ''
    } catch (err) {
        console.error('OpenAI error', err)
        throw new Error('Failed to generate AI plan')
    }
} 