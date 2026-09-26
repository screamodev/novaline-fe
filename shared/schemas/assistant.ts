import { z } from 'zod'

export const ASSISTANT_MAX_CHARS = 500
export const ASSISTANT_MAX_HISTORY = 10

export const assistantRequestSchema = z.object({
  locale: z.enum(['uk', 'en']).default('uk'),
  messages: z
    .array(
      z.object({
        role: z.enum(['user', 'assistant']),
        content: z.string().trim().min(1).max(ASSISTANT_MAX_CHARS * 4),
      }),
    )
    .min(1)
    .max(ASSISTANT_MAX_HISTORY)
    // The newest message is the visitor's question and is held to the input limit.
    .refine((list) => list.at(-1)?.role === 'user' && list.at(-1)!.content.length <= ASSISTANT_MAX_CHARS),
})

export type AssistantRequest = z.infer<typeof assistantRequestSchema>
