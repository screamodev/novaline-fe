import type { AssistantAction, AssistantFallbackReply, AssistantSettingsVM } from '../types/assistant'
import { ASSISTANT_ACTIONS } from '../types/assistant'
import { normalizeQuery } from './coverage'

type Raw = Record<string, any>
const str = (v: unknown) => (typeof v === 'string' ? v.trim() : '')

export function normalizeAssistantSettings(raw: Raw | null | undefined): AssistantSettingsVM {
  const s = raw ?? {}
  return {
    title: str(s.title),
    subtitle: str(s.subtitle),
    greeting: str(s.greeting),
    quickQuestions: (s.quickQuestions ?? []).map((q: Raw) => str(q?.text)).filter(Boolean),
    fallbackMessage: str(s.fallbackMessage),
    fallbackReplies: (s.fallbackReplies ?? [])
      .map((r: Raw) => ({
        keywords: str(r?.keywords).split(',').map((k) => normalizeQuery(k)).filter(Boolean),
        answer: str(r?.answer),
      }))
      .filter((r: AssistantFallbackReply) => r.keywords.length && r.answer),
    promptAddendum: str(s.promptAddendum) || null,
  }
}

/** Keyword-stem matching used in demo mode: the reply with the most matching stems wins. */
export function matchFallback(question: string, replies: AssistantFallbackReply[]): string | null {
  const q = normalizeQuery(question)
  let best: { answer: string; score: number } | null = null
  for (const r of replies) {
    const score = r.keywords.filter((k) => q.includes(k)).length
    if (score && (!best || score > best.score)) best = { answer: r.answer, score }
  }
  return best?.answer ?? null
}

const TOKEN = /\[\[(\w+)\]\]/g
/** A token still being streamed, e.g. "[[le" at the very end. */
const PARTIAL_TOKEN = /\[\[?\w*\]?$/

/** Splits an answer into display text and action buttons (`[[lead]]`, `[[callback]]`, `[[coverage]]`). */
export function parseActions(text: string, { streaming = false } = {}): { text: string; actions: AssistantAction[] } {
  const actions: AssistantAction[] = []
  let clean = text.replace(TOKEN, (_, name: string) => {
    if ((ASSISTANT_ACTIONS as readonly string[]).includes(name) && !actions.includes(name as AssistantAction)) {
      actions.push(name as AssistantAction)
    }
    return ''
  })
  if (streaming) clean = clean.replace(PARTIAL_TOKEN, '')
  return { text: clean.replace(/[ \t]+\n/g, '\n').replace(/\n{3,}/g, '\n\n').trim(), actions }
}
