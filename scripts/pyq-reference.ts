// Independent, plain-code definition of each PYQ's language. The verifier runs
// every machine against these on all strings up to a fixed length, so a wrong
// transition is caught even if the hand-picked test strings miss it.
// Keys must match the pyqBank keys exactly.

const count = (w: string, c: string) => w.split(c).length - 1;
const binaryMod = (w: string, n: number) => [...w].reduce((r, b) => (2 * r + Number(b)) % n, 0);

export const pyqReference: Record<string, (w: string) => boolean> = {
  "DFA: Substring 001 (July '25)": w => w.includes('001'),
  "DFA: Binary Divisible by 5 (Dec '24)": w => binaryMod(w, 5) === 0,
  "DFA: Even 0s and Even 1s (Jan '24)": w => count(w, '0') % 2 === 0 && count(w, '1') % 2 === 0,
  "NFA: Ends with 00 or 11 (Aug '23)": w => w.endsWith('00') || w.endsWith('11'),
  "DFA: 3 Consecutive 1s (Feb '23)": w => w.includes('111'),
  "ε-NFA: 0*1*2* (Classic Example)": w => /^0*1*2*$/.test(w),

  "DFA: Ends with 01": w => w.endsWith('01'),
  "DFA: Starts with a, Ends with b": w => w.startsWith('a') && w.endsWith('b'),
  "DFA: Does NOT Contain 001": w => !w.includes('001'),
  "DFA: No Two Consecutive 1s": w => !w.includes('11'),
  "DFA: At Most Two 1s": w => count(w, '1') <= 2,
  "DFA: Number of a's Divisible by 3": w => count(w, 'a') % 3 === 0,
  "DFA: Length Divisible by 3": w => w.length % 3 === 0,
  "DFA: Binary Divisible by 3": w => binaryMod(w, 3) === 0,
  "DFA: Ends with abb": w => w.endsWith('abb'),
  "DFA: Second Symbol from Right is 1": w => w.length >= 2 && w[w.length - 2] === '1',
  "NFA: Ends with abb": w => w.endsWith('abb'),
  "NFA: Second Symbol from Right is 1": w => w.length >= 2 && w[w.length - 2] === '1',
  "NFA: Contains 101": w => w.includes('101'),
  "ε-NFA: 0* + 1*": w => /^(0*|1*)$/.test(w),
};
