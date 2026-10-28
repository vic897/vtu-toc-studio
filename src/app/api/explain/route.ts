import Cerebras from '@cerebras/cerebras_cloud_sdk';
import { AutomatonSpec } from '@/types/automata';

// llama3.1-70b has been retired by Cerebras; override with CEREBRAS_MODEL if needed.
const MODEL = process.env.CEREBRAS_MODEL || 'gpt-oss-120b';

// Caps keep a single request from turning into an oversized prompt.
const MAX_STATES = 50;
const MAX_TRANSITIONS = 500;

// The SDK throws on construction without a key, so build it lazily inside the handler.
let client: Cerebras | null = null;
function getClient(): Cerebras {
  client ??= new Cerebras({ apiKey: process.env.CEREBRAS_API_KEY });
  return client;
}

const isStringArray = (v: unknown): v is string[] =>
  Array.isArray(v) && v.every(s => typeof s === 'string');

function isAutomatonSpec(v: unknown): v is AutomatonSpec {
  if (!v || typeof v !== 'object') return false;
  const m = v as Record<string, unknown>;
  return (
    ['DFA', 'NFA', 'eNFA'].includes(m.type as string) &&
    isStringArray(m.states) && m.states.length > 0 && m.states.length <= MAX_STATES &&
    isStringArray(m.alphabet) &&
    typeof m.start === 'string' &&
    isStringArray(m.accept) &&
    Array.isArray(m.transitions) && m.transitions.length <= MAX_TRANSITIONS &&
    m.transitions.every(
      (t: unknown) =>
        !!t && typeof t === 'object' &&
        ['from', 'symbol', 'to'].every(k => typeof (t as Record<string, unknown>)[k] === 'string')
    )
  );
}

// Models sometimes wrap the array in prose or code fences; take the outermost [...] span.
function parseSteps(text: string): string[] | null {
  const start = text.indexOf('[');
  const end = text.lastIndexOf(']');
  if (start === -1 || end <= start) return null;
  try {
    const parsed: unknown = JSON.parse(text.slice(start, end + 1));
    return isStringArray(parsed) && parsed.length > 0 ? parsed : null;
  } catch {
    return null;
  }
}

export async function POST(req: Request) {
  if (!process.env.CEREBRAS_API_KEY) {
    return Response.json(
      { error: 'AI explanations are not configured. Add CEREBRAS_API_KEY to .env.local and restart the dev server.' },
      { status: 503 }
    );
  }

  const body = await req.json().catch(() => null);
  const machine: unknown = body?.machine;
  if (!isAutomatonSpec(machine)) {
    return Response.json({ error: 'Request body must be { machine: AutomatonSpec }.' }, { status: 400 });
  }

  // Send only the formal definition; any existing explanation would bias the answer.
  const { type, description, states, alphabet, start, accept, transitions } = machine;
  const formal = { type, description, states, alphabet, start, accept, transitions };

  const prompt = `You are an expert Theory of Computation tutor for VTU engineering students.
Analyze the following ${type === 'eNFA' ? 'ε-NFA' : type} (Automaton):
${JSON.stringify(formal, null, 2)}

Provide a clear, step-by-step explanation of its logic in 3 to 5 steps.
Do not write code. Do not use markdown blocks for the outer response.
Return ONLY a valid JSON array of strings, where each string is a step.
Example format: ["**State q0:** explanation...", "**State q1:** explanation..."]`;

  try {
    const completion = await getClient().chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: MODEL,
    });

    // The SDK types `choices` loosely, so narrow the content field by hand.
    const choices = (completion as { choices?: { message?: { content?: unknown } }[] }).choices;
    const content = choices?.[0]?.message?.content;
    const steps = typeof content === 'string' ? parseSteps(content) : null;

    if (!steps) {
      console.error('Cerebras returned an unparseable explanation:', content);
      return Response.json({ error: 'The AI returned an explanation in an unexpected format. Try again.' }, { status: 502 });
    }

    return Response.json({ steps });
  } catch (error) {
    console.error('Cerebras API Error:', error);
    return Response.json({ error: 'Failed to generate explanation.' }, { status: 502 });
  }
}
