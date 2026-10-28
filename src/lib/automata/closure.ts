import { AutomatonSpec, Transition } from '@/types/automata';

// Bare 'e'/'E' is deliberately not an alias: it would collide with alphabets like {a..e}.
export const isEpsilon = (symbol: string): boolean => {
  const normalized = symbol.trim().toLowerCase();
  return symbol === '' || symbol === 'ε' || normalized === 'eps' || normalized === 'epsilon';
};

export function epsilonClosure(machine: AutomatonSpec, initialStates: string[]): string[] {
  const closureSet = new Set<string>(initialStates);
  const stack = [...initialStates];

  while (stack.length > 0) {
    const currentState = stack.pop()!;
    for (const t of machine.transitions) {
      if (t.from === currentState && isEpsilon(t.symbol) && !closureSet.has(t.to)) {
        closureSet.add(t.to);
        stack.push(t.to);
      }
    }
  }

  return Array.from(closureSet).sort();
}

export function getTransitions(
  machine: AutomatonSpec,
  activeStates: string[],
  symbol: string
): Transition[] {
  const activeSet = new Set(activeStates);
  return machine.transitions.filter(
    (t) => activeSet.has(t.from) && t.symbol === symbol
  );
}