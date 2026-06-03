import Anthropic from '@anthropic-ai/sdk'
import { PHILOSOPHERS } from '../../../shared/philosophersData.js'
import { getLibraryQuotesForPhilosopher } from './BookProcessor.js'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

// Merge static quotes with any extracted from uploaded books
function buildMergedQuotes(philosopher) {
  const merged = {}
  // Start with static curated quotes
  Object.entries(philosopher.quotes).forEach(([topic, quotes]) => {
    merged[topic] = [...quotes]
  })
  // Add library quotes extracted from uploaded books
  const libraryQuotes = getLibraryQuotesForPhilosopher(philosopher.id)
  Object.entries(libraryQuotes).forEach(([topic, quotes]) => {
    if (!merged[topic]) merged[topic] = []
    quotes.forEach(q => {
      const exists = merged[topic].some(e => e.text.slice(0, 40) === q.text.slice(0, 40))
      if (!exists) merged[topic].push(q)
    })
  })
  return merged
}

// Build system prompt for each philosopher using their real quotes (static + uploaded)
function buildSystemPrompt(philosopher) {
  const mergedQuotes = buildMergedQuotes(philosopher)
  const allQuotes = Object.entries(mergedQuotes)
    .map(([topic, quotes]) =>
      `## ${topic.toUpperCase()}\n${quotes
        .map(q => `- "${q.text}" — ${q.source}${q.year ? ` (${q.year})` : ''}`)
        .join('\n')}`
    )
    .join('\n\n')

  const libraryCount = Object.values(getLibraryQuotesForPhilosopher(philosopher.id))
    .reduce((s, a) => s + a.length, 0)
  const libraryNote = libraryCount > 0
    ? `\n[${libraryCount} additional quotes loaded from uploaded texts]`
    : ''

  return `You are ${philosopher.name} (${philosopher.years}), ${philosopher.nationality} philosopher.
Your philosophical focus: ${philosopher.bio}${libraryNote}

You speak ONLY in actual quotes from your works. You may select and combine quotes but never invent new statements.

Your authentic words from your works:
${allQuotes}

Rules:
- Always respond with a real quote from your works listed above
- Choose the quote most relevant to the current topic and conversation
- Format: JSON with { "text": "...", "source": "...", "year": number|null }
- Stay true to your philosophical worldview
- Do not use any text other than the JSON response`
}

export async function getPhilosopherResponse(philosopherId, topic, otherPhilosopherStatement, conversationHistory) {
  const philosopher = PHILOSOPHERS.find(p => p.id === philosopherId)
  if (!philosopher) throw new Error(`Philosopher ${philosopherId} not found`)

  // Fallback helper — pick from merged quote pool (static + uploaded books)
  function randomQuote() {
    const merged = buildMergedQuotes(philosopher)
    const pool = merged[topic] || merged.meaning || merged.suffering || []
    return pool[Math.floor(Math.random() * pool.length)] || { text: '...', source: 'Unknown', year: null }
  }

  // Use fallback when no API key is configured
  if (!process.env.ANTHROPIC_API_KEY) {
    const quote = randomQuote()
    return { ...quote, philosopherId, philosopherName: philosopher.name }
  }

  try {
    const systemPrompt = buildSystemPrompt(philosopher)
    const userMessage = [
      `Topic: ${topic}`,
      otherPhilosopherStatement
        ? `The other philosopher just said: "${otherPhilosopherStatement}"`
        : '',
      'Respond with your most fitting quote on this topic as JSON.'
    ]
      .filter(Boolean)
      .join('\n')

    const response = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 300,
      system: systemPrompt,
      messages: [{ role: 'user', content: userMessage }]
    })

    const text = response.content[0].text.trim()
    const parsed = JSON.parse(text)
    return { ...parsed, philosopherId, philosopherName: philosopher.name }
  } catch (err) {
    console.error(`Agent error for ${philosopherId}:`, err.message)
    // Fallback to random quote on any error
    const quote = randomQuote()
    return { ...quote, philosopherId, philosopherName: philosopher.name }
  }
}
