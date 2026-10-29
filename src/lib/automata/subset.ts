import { AutomatonSpec, Transition } from '@/types/automata';
import { epsilonClosure, getTransitions, isEpsilon } from './closure';

// DFA states produced by the construction are named after the NFA states they
// contain, e.g. "{q0,q1}", with "∅" for the dead state.
export const setName = (states: string[]) => (states.length ? `{${states.join(',')}}` : '∅');

// Subset construction (NFA / ε-NFA → DFA). Only subsets reachable from the
// start set are built, which is the method expected in VTU answers. The DFA's
// explanation narrates each step in the order the sets are processed.
export function subsetConstruction(nfa: AutomatonSpec, sourceName?: string): AutomatonSpec {
  const hasEpsilon = nfa.transitions.some(t => isEpsilon(t.symbol));
  const startSet = epsilonClosure(nfa, [nfa.start]);
  const startName = setName(startSet);

  const discovered = new Map<string, string[]>([[startName, startSet]]);
  const queue = [startSet];
  const transitions: Transition[] = [];
  const narration: string[] = [];

  while (queue.length > 0) {
    const current = queue.shift()!;
    const currentName = setName(current);
    const moves: string[] = [];

    for (const symbol of nfa.alphabet) {
      const moved = [...new Set(getTransitions(nfa, current, symbol).map(t => t.to))].sort();
      const target = epsilonClosure(nfa, moved);
      const targetName = setName(target);
      const isNew = !discovered.has(targetName);
      if (isNew) {
        discovered.set(targetName, target);
        queue.push(target);
      }
      transitions.push({ from: currentName, symbol, to: targetName });

      // Spell out the ε-closure only where it actually adds states.
      const result = hasEpsilon && setName(moved) !== targetName
        ? `move = ${setName(moved)}, ε-closure = ${targetName}`
        : targetName;
      moves.push(`on '${symbol}' → ${result}${isNew ? ' (new)' : ''}`);
    }
    narration.push(`**${currentName}:** ${moves.join('; ')}.`);
  }

  const states = [...discovered.keys()];
  const nfaAccept = new Set(nfa.accept);
  const accept = states.filter(name => discovered.get(name)!.some(s => nfaAccept.has(s)));

  const explanation = [
    `**Method:** Each DFA state is a set of NFA states. Start from ${hasEpsilon ? 'the ε-closure of ' : ''}the start state, then for every new set and every input symbol compute where the NFA can go${hasEpsilon ? ' (followed by ε-closure)' : ''}. Repeat until no new sets appear.`,
    `**Start state:** ${hasEpsilon ? `ε-closure(${nfa.start}) = ` : ''}${startName}.`,
    ...narration,
    `**Accepting states:** Every set that contains an NFA accepting state (${nfa.accept.join(', ')}): ${accept.join(', ') || 'none'}.`,
  ];
  if (discovered.has('∅')) {
    explanation.push("**Dead state ∅:** Reached when no NFA branch survives. It loops on every symbol, which keeps the DFA complete.");
  }

  return {
    type: 'DFA',
    description: `DFA built by subset construction from the ${nfa.type === 'eNFA' ? 'ε-NFA' : 'NFA'}: ${nfa.description ?? ''}`.trim(),
    states,
    alphabet: nfa.alphabet,
    start: startName,
    accept,
    transitions,
    tests: nfa.tests,
    explanation,
    derivedFrom: sourceName ?? 'NFA',
  };
}
