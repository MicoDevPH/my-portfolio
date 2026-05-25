import portfolioContext from '/.mokusei/ganymede_context.md?raw'

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000'
const AGENT = 'ganymede'

export async function sendMessage(userMessage, messageHistory) {
  const context = messageHistory
    .filter(m => !(m.role === 'ai' && messageHistory.indexOf(m) === 0))
    .map(m => `${m.role === 'user' ? 'Visitor' : 'Ganymede'}: ${m.text}`)
    .join('\n\n')

  const res = await fetch(`${API_BASE}/api/agents/${AGENT}/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      message: userMessage,
      context,
      portfolio: portfolioContext,
      api_key: import.meta.env.VITE_MOKUSEI_API_KEY || null,
    }),
  })

  if (!res.ok) {
    throw new Error(`API error: ${res.status}`)
  }

  const data = await res.json()
  return data.response
}
