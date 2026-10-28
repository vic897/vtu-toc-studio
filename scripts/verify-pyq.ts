// Checks every PYQ in the bank: structural sanity, DFA totality, and that each
// listed test string is accepted/rejected as claimed. Run with `npm run verify:pyq`.
import { pyqBank } from '@/data/pyq-bank';
import { simulate } from '@/lib/automata/simulator';
import { isEpsilon } from '@/lib/automata/closure';

let failures = 0;
const fail = (name: string, msg: string) => {
  failures++;
  console.error(`  ✗ ${name}: ${msg}`);
};

for (const [name, m] of Object.entries(pyqBank)) {
  const states = new Set(m.states);
  const before = failures;

  if (!states.has(m.start)) fail(name, `start state '${m.start}' is not in Q`);
  for (const a of m.accept) if (!states.has(a)) fail(name, `accept state '${a}' is not in Q`);

  for (const t of m.transitions) {
    if (!states.has(t.from) || !states.has(t.to)) fail(name, `transition ${t.from} -${t.symbol}-> ${t.to} uses an unknown state`);
    if (!isEpsilon(t.symbol) && !m.alphabet.includes(t.symbol)) fail(name, `symbol '${t.symbol}' is not in Σ`);
    if (isEpsilon(t.symbol) && m.type !== 'eNFA') fail(name, `ε-transition in a machine typed ${m.type}`);
  }

  // A DFA needs exactly one move for every (state, symbol) pair.
  if (m.type === 'DFA') {
    for (const q of m.states) {
      for (const a of m.alphabet) {
        const n = m.transitions.filter(t => t.from === q && t.symbol === a).length;
        if (n !== 1) fail(name, `δ(${q}, ${a}) has ${n} targets (DFA needs exactly 1)`);
      }
    }
  }

  for (const [expected, inputs] of [['accepted', m.tests?.accept ?? []], ['rejected', m.tests?.reject ?? []]] as const) {
    for (const input of inputs) {
      const steps = simulate(m, input);
      const status = steps[steps.length - 1].status;
      const got = status === 'accepted' ? 'accepted' : 'rejected';
      if (got !== expected) fail(name, `"${input || 'ε'}" was ${got}, expected ${expected}`);
    }
  }

  if (!m.tests) fail(name, 'has no test vectors');
  if (failures === before) {
    const count = (m.tests?.accept.length ?? 0) + (m.tests?.reject.length ?? 0);
    console.log(`  ✓ ${name} (${count} test strings)`);
  }
}

console.log(failures ? `\n${failures} problem(s) found.` : '\nAll PYQs verified.');
process.exit(failures ? 1 : 0);
