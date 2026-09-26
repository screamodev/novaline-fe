export type AssistantAction = 'lead' | 'callback' | 'coverage'
export const ASSISTANT_ACTIONS: readonly AssistantAction[] = ['lead', 'callback', 'coverage'] as const

export interface AssistantFallbackReply {
  keywords: string[]
  answer: string
}

/** Full CMS settings; `promptAddendum` and `fallbackReplies` never leave the server. */
export interface AssistantSettingsVM {
  title: string
  subtitle: string
  greeting: string
  quickQuestions: string[]
  fallbackMessage: string
  fallbackReplies: AssistantFallbackReply[]
  promptAddendum: string | null
}

/** What the widget receives from `/api/cms/assistant`. */
export type AssistantPublicVM = Pick<AssistantSettingsVM, 'title' | 'subtitle' | 'greeting' | 'quickQuestions'>

export interface AssistantMessage {
  role: 'user' | 'assistant'
  content: string
}

/** Non-streaming reply used when OpenAI is not configured or fails before the first token. */
export interface AssistantFallbackResponse {
  mode: 'fallback'
  text: string
}
