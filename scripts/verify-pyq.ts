// Checks every PYQ in the bank: structural sanity, DFA totality, that each
// listed test string is accepted/rejected as claimed, and that the machine
// agrees with its reference definition on every string up to MAX_LEN.
// Run with `npm run verify:pyq`.
import { pyqBank } from '@/data/pyq-bank';
import { simulate } from '@/lib/automata/simulator';
import { isEpsilon } from '@/lib/automata/closure';
import { AutomatonSpec } from '@/types/automata';
import { pyqReference } from './pyq-reference';

const MAX_LEN = 8;

const accepts = (m: AutomatonSpec, w: string) => simulate(m, w).at(-1)!.status === 'accepted';

// All strings over the alphabet of length 0..maxLen, shortest first.
function* allStrings(alphabet: string[], maxLen: number): Generator<string> {
  let layer = [''];
  for (let len = 0; len <= maxLen; len++) {
    yield* layer;
    layer = layer.flatMap(w => alphabet.map(a => w + a));
  }
}

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
      const got = accepts(m, input) ? 'accepted' : 'rejected';
      if (got !== expected) fail(name, `"${input || 'ε'}" was ${got}, expected ${expected}`);
    }
  }

  if (!m.tests) fail(name, 'has no test vectors');

  // Exhaustive check against the reference language; report only the
  // shortest counterexample, which is the easiest one to trace by hand.
  const reference = pyqReference[name];
  let checked = 0;
  if (!reference) {
    fail(name, 'has no reference definition in scripts/pyq-reference.ts');
  } else {
    for (const w of allStrings(m.alphabet, MAX_LEN)) {
      checked++;
      if (accepts(m, w) !== reference(w)) {
        fail(name, `disagrees with its reference on "${w || 'ε'}" (machine ${accepts(m, w) ? 'accepts' : 'rejects'} it)`);
        break;
      }
    }
  }

  if (failures === before) {
    const count = (m.tests?.accept.length ?? 0) + (m.tests?.reject.length ?? 0);
    console.log(`  ✓ ${name} (${count} test strings, ${checked} exhaustive)`);
  }
}

for (const name of Object.keys(pyqReference)) {
  if (!(name in pyqBank)) fail(name, 'has a reference definition but no machine in the PYQ bank');
}

console.log(failures ? `\n${failures} problem(s) found.` : '\nAll PYQs verified.');
process.exit(failures ? 1 : 0);
