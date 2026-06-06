import Anthropic from '@anthropic-ai/sdk'
import { PHILOSOPHERS, TOPIC_CONTEXT, TOPIC_FALLBACK } from '../../../shared/philosophersData.js'
import { getLibraryQuotesForPhilosopher } from './BookProcessor.js'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

// Gather quotes from static data + uploaded books, searching across relevant categories
function buildMergedQuotes(philosopher, topic) {
  const merged = {}
  const relevantCategories = TOPIC_FALLBACK[topic] || Object.keys(philosopher.quotes)
  const allCategories = new Set([...Object.keys(philosopher.quotes), ...relevantCategories])

  allCategories.forEach(cat => {
    if (philosopher.quotes[cat]) merged[cat] = [...philosopher.quotes[cat]]
  })

  const libraryQuotes = getLibraryQuotesForPhilosopher(philosopher.id)
  Object.entries(libraryQuotes).forEach(([cat, quotes]) => {
    if (!merged[cat]) merged[cat] = []
    quotes.forEach(q => {
      const exists = merged[cat].some(e => e.text.slice(0, 40) === q.text.slice(0, 40))
      if (!exists) merged[cat].push(q)
    })
  })

  return merged
}

function buildQuoteSection(philosopher, topic) {
  const relevantCategories = TOPIC_FALLBACK[topic] || Object.keys(philosopher.quotes)
  const merged = buildMergedQuotes(philosopher, topic)

  // Relevant categories first
  const ordered = [
    ...relevantCategories.filter(c => merged[c]),
    ...Object.keys(merged).filter(c => !relevantCategories.includes(c))
  ]

  return ordered
    .map(cat => {
      const quotes = merged[cat]
      if (!quotes || quotes.length === 0) return null
      return `## ${cat.toUpperCase()}\n${quotes
        .map(q => `- "${q.text}" — ${q.source}${q.year ? ` (${q.year})` : ''}`)
        .join('\n')}`
    })
    .filter(Boolean)
    .join('\n\n')
}

function buildSystemPrompt(philosopher, topic, topicLabel) {
  const topicContext = TOPIC_CONTEXT[topic] || 'A topic of deep philosophical importance.'
  const quoteSection = buildQuoteSection(philosopher, topic)

  const libraryCount = Object.values(getLibraryQuotesForPhilosopher(philosopher.id))
    .reduce((s, a) => s + a.length, 0)
  const libraryNote = libraryCount > 0 ? `\n[${libraryCount} additional quotes from uploaded texts]` : ''

  return `You are ${philosopher.name} (${philosopher.years}), ${philosopher.nationality} philosopher.
Your philosophical focus: ${philosopher.bio}${libraryNote}

TOPIC: ${topicLabel || topic}
CONTEXT: ${topicContext}

Rules:
- Respond ONLY with actual quotes from your works listed below
- Also write a "bridge" — one short reaction sentence (under 15 words) in your philosophical voice, connecting what the other philosopher said to your quote. Make it feel like a live debate — tension, agreement, or provocation.
- When no previous statement exists (you speak first), set bridge to null
- The bridge is YOUR voice; the text must be a real quote

Your authentic words:
${quoteSection}

Return ONLY valid JSON, no extra text:
{"bridge": "short reaction or null", "text": "exact quote", "source": "book title", "year": number_or_null}`
}

export async function getPhilosopherResponse(philosopherId, topic, topicLabel, otherPhilosopherStatement, conversationHistory) {
  const philosopher = PHILOSOPHERS.find(p => p.id === philosopherId)
  if (!philosopher) throw new Error(`Philosopher ${philosopherId} not found`)

  function randomQuote() {
    const cats = TOPIC_FALLBACK[topic] || Object.keys(philosopher.quotes)
    for (const cat of cats) {
      const pool = philosopher.quotes[cat]
      if (pool && pool.length > 0) return pool[Math.floor(Math.random() * pool.length)]
    }
    const all = Object.values(philosopher.quotes).flat()
    return all[Math.floor(Math.random() * all.length)] || { text: '...', source: 'Unknown', year: null }
  }

  if (!process.env.ANTHROPIC_API_KEY) {
    const quote = randomQuote()
    return { bridge: null, ...quote, philosopherId, philosopherName: philosopher.name }
  }

  try {
    const systemPrompt = buildSystemPrompt(philosopher, topic, topicLabel)
    const userMessage = otherPhilosopherStatement
      ? `Topic: ${topicLabel || topic}\nThe other philosopher just said: "${otherPhilosopherStatement}"\n\nRespond with your most fitting quote, and a bridge reacting to their statement.`
      : `Topic: ${topicLabel || topic}\nOpen the conversation with your most fitting quote (bridge = null).`

    const response = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 400,
      system: systemPrompt,
      messages: [{ role: 'user', content: userMessage }]
    })

    const raw = response.content[0].text.trim()
    const cleaned = raw.replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/```\s*$/i, '').trim()
    const parsed = JSON.parse(cleaned)
    return {
      bridge: parsed.bridge || null,
      text: parsed.text,
      source: parsed.source,
      year: parsed.year ?? null,
      philosopherId,
      philosopherName: philosopher.name
    }
  } catch (err) {
    console.error(`Agent error for ${philosopherId}:`, err.message)
    const quote = randomQuote()
    return { bridge: null, ...quote, philosopherId, philosopherName: philosopher.name }
  }
}
