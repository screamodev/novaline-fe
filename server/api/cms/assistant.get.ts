import type { AssistantPublicVM } from '#shared/types/assistant'

/** Widget texts only; the prompt addendum and fallback replies stay on the server. */
export default defineEventHandler(async (event): Promise<AssistantPublicVM> => {
  const { title, subtitle, greeting, quickQuestions } = await getAssistantSettings(parseLocale(getQuery(event).locale))
  return { title, subtitle, greeting, quickQuestions }
})
