import { AutomatonSpec } from '@/types/automata';

export type ExplanationSource = 'cache' | 'api';

export interface AiExplanation {
  steps: string[];
  source: ExplanationSource;
}

// Order-independent fingerprint of the machine's formal definition, so the same
// automaton always maps to the same localStorage key however it was written.
export function hashMachine(machine: AutomatonSpec): string {
  const stable = JSON.stringify({
    states: [...machine.states].sort(),
    alphabet: [...machine.alphabet].sort(),
    start: machine.start,
    accept: [...machine.accept].sort(),
    transitions: machine.transitions
      .map(t => `${t.from}|${t.symbol}|${t.to}`)
      .sort(),
  });

  let hash = 0;
  for (let i = 0; i < stable.length; i++) {
    hash = (hash << 5) - hash + stable.charCodeAt(i);
    hash |= 0;
  }
  return `automata:explain:${hash}`;
}

// localStorage can throw (private mode, blocked storage), so the cache is best-effort.
function readCache(key: string): string[] | null {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.every(s => typeof s === 'string') ? parsed : null;
  } catch {
    return null;
  }
}

function writeCache(key: string, steps: string[]) {
  try {
    localStorage.setItem(key, JSON.stringify(steps));
  } catch {
    // Quota exceeded or storage disabled: the explanation still renders, just uncached.
  }
}

export async function getAiExplanation(
  machine: AutomatonSpec,
  signal?: AbortSignal
): Promise<AiExplanation> {
  const cacheKey = hashMachine(machine);
  const cached = readCache(cacheKey);
  if (cached) return { steps: cached, source: 'cache' };

  const res = await fetch('/api/explain', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ machine }),
    signal,
  });
  const data = await res.json().catch(() => ({}));

  if (!res.ok || !Array.isArray(data.steps)) {
    throw new Error(data.error ?? `AI service responded with ${res.status}`);
  }

  writeCache(cacheKey, data.steps);
  return { steps: data.steps, source: 'api' };
}
