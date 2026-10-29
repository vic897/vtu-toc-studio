import { AutomatonSpec } from '@/types/automata';

export const pyqBank: Record<string, AutomatonSpec> = {
  "DFA: Substring 001 (July '25)": {
    type: 'DFA',
    description: "Design a DFA to accept strings over {0,1} containing '001' as a substring.",
    states: ["q0", "q1", "q2", "q3"],
    alphabet: ["0", "1"],
    start: "q0",
    accept: ["q3"],
    tests: { accept: ["001", "1001", "00010"], reject: ["00", "0101", "1100"] },
    transitions: [
      { from: "q0", symbol: "0", to: "q1" }, { from: "q0", symbol: "1", to: "q0" },
      { from: "q1", symbol: "0", to: "q2" }, { from: "q1", symbol: "1", to: "q0" },
      { from: "q2", symbol: "0", to: "q2" }, { from: "q2", symbol: "1", to: "q3" },
      { from: "q3", symbol: "0", to: "q3" }, { from: "q3", symbol: "1", to: "q3" }
    ],
    explanation: [
      "**State q0:** The initial state, representing that we haven't matched any part of '001' yet.",
      "**State q1:** Reached after seeing the first '0'. If we see a '1' here, the streak is broken, and we return to q0.",
      "**State q2:** Reached after seeing '00'. A '0' keeps us here, but a '1' completes the '001' sequence.",
      "**State q3 (Trap/Accept):** Once '001' is detected, we enter q3 and loop infinitely for any subsequent inputs because the substring requirement is permanently satisfied."
    ]
  },

  "DFA: Binary Divisible by 5 (Dec '24)": {
    type: 'DFA',
    description: "Design a DFA to accept binary numbers that are divisible by 5.",
    states: ["r0", "r1", "r2", "r3", "r4"],
    alphabet: ["0", "1"],
    start: "r0",
    accept: ["r0"],
    tests: { accept: ["0", "101", "1010", "1111"], reject: ["1", "10", "11", "100"] },
    transitions: [
      { from: "r0", symbol: "0", to: "r0" }, { from: "r0", symbol: "1", to: "r1" },
      { from: "r1", symbol: "0", to: "r2" }, { from: "r1", symbol: "1", to: "r3" },
      { from: "r2", symbol: "0", to: "r4" }, { from: "r2", symbol: "1", to: "r0" },
      { from: "r3", symbol: "0", to: "r1" }, { from: "r3", symbol: "1", to: "r2" },
      { from: "r4", symbol: "0", to: "r3" }, { from: "r4", symbol: "1", to: "r4" }
    ],
    explanation: [
      "**Modulo Arithmetic Logic:** The states represent the current remainder when the binary number is divided by 5 (r0 = 0, r1 = 1, etc.).",
      "**Appending a '0':** Multiplies the current value by 2. New remainder = (2 * old_remainder) mod 5.",
      "**Appending a '1':** Multiplies by 2 and adds 1. New remainder = (2 * old_remainder + 1) mod 5.",
      "**Acceptance:** The string is accepted only if it ends in state r0 (remainder 0)."
    ]
  },

  "DFA: Even 0s and Even 1s (Jan '24)": {
    type: 'DFA',
    description: "Construct a DFA for the language L = {w | w has an even number of 0s and an even number of 1s}.",
    states: ["qEE", "qEO", "qOE", "qOO"],
    alphabet: ["0", "1"],
    start: "qEE",
    accept: ["qEE"],
    tests: { accept: ["", "00", "11", "0110", "1001"], reject: ["0", "1", "01", "000", "111"] },
    transitions: [
      { from: "qEE", symbol: "0", to: "qOE" }, { from: "qEE", symbol: "1", to: "qEO" },
      { from: "qEO", symbol: "0", to: "qOO" }, { from: "qEO", symbol: "1", to: "qEE" },
      { from: "qOE", symbol: "0", to: "qEE" }, { from: "qOE", symbol: "1", to: "qOO" },
      { from: "qOO", symbol: "0", to: "qEO" }, { from: "qOO", symbol: "1", to: "qOE" }
    ],
    explanation: [
      "**State Meaning:** Each state tracks the parity (Even/Odd) of 0s and 1s seen so far. qEE = Even 0s, Even 1s.",
      "**Input 0:** Toggles the first letter of the state. If in qEE (Even 0s), a '0' moves it to qOE (Odd 0s).",
      "**Input 1:** Toggles the second letter of the state. If in qEE (Even 1s), a '1' moves it to qEO (Odd 1s).",
      "**Acceptance:** We only accept if the final string lands back in qEE, meaning both parities are even."
    ]
  },

  "NFA: Ends with 00 or 11 (Aug '23)": {
    type: 'NFA',
    description: "Design an NFA to accept strings over {0,1} that end with '00' or '11'.",
    states: ["q0", "q1", "q2", "q3", "q4"],
    alphabet: ["0", "1"],
    start: "q0",
    accept: ["q2", "q4"],
    tests: { accept: ["00", "11", "0100", "1011"], reject: ["0", "1", "01", "10", "001"] },
    transitions: [
      { from: "q0", symbol: "0", to: "q0" }, { from: "q0", symbol: "1", to: "q0" },
      { from: "q0", symbol: "0", to: "q1" }, { from: "q1", symbol: "0", to: "q2" },
      { from: "q0", symbol: "1", to: "q3" }, { from: "q3", symbol: "1", to: "q4" }
    ],
    explanation: [
      "**Non-Determinism at q0:** The machine stays in q0 for any input, essentially 'guessing' when the final two characters are about to arrive.",
      "**Path 1 (Ends in 00):** If the machine guesses a '0' is the second-to-last character, it branches to q1. Another '0' moves it to the accept state q2.",
      "**Path 2 (Ends in 11):** If it guesses a '1' is the second-to-last character, it branches to q3. Another '1' moves it to the accept state q4.",
      "**Evaluation:** An NFA accepts if *any* of its active parallel branches land in an accept state at the end of the string."
    ]
  },

  "DFA: 3 Consecutive 1s (Feb '23)": {
    type: 'DFA',
    description: "Design a DFA that accepts strings containing three consecutive 1s.",
    states: ["q0", "q1", "q2", "q3"],
    alphabet: ["0", "1"],
    start: "q0",
    accept: ["q3"],
    tests: { accept: ["111", "0111", "1110", "011101"], reject: ["11", "1011", "11011"] },
    transitions: [
      { from: "q0", symbol: "0", to: "q0" }, { from: "q0", symbol: "1", to: "q1" },
      { from: "q1", symbol: "0", to: "q0" }, { from: "q1", symbol: "1", to: "q2" },
      { from: "q2", symbol: "0", to: "q0" }, { from: "q2", symbol: "1", to: "q3" },
      { from: "q3", symbol: "0", to: "q3" }, { from: "q3", symbol: "1", to: "q3" }
    ],
    explanation: [
      "**State q0:** No consecutive 1s seen. Any '0' keeps us here.",
      "**State q1:** Seen one '1'. If we see a '0', the streak is ruined and we reset to q0.",
      "**State q2:** Seen two '1's in a row. A '0' resets us to q0, but a '1' completes the streak.",
      "**State q3:** Three consecutive 1s achieved. We trap the machine here as an accept state, because the condition is met regardless of what follows."
    ]
  },

  "ε-NFA: 0*1*2* (Classic Example)": {
    type: 'eNFA',
    description: "Design an ε-NFA for the regular expression 0*1*2*. (Any number of 0s, followed by any number of 1s, followed by any number of 2s).",
    states: ["q0", "q1", "q2"],
    alphabet: ["0", "1", "2"],
    start: "q0",
    accept: ["q2"],
    tests: { accept: ["", "012", "001122", "0", "1", "2", "02"], reject: ["10", "21", "021"] },
    transitions: [
      { from: "q0", symbol: "0", to: "q0" },
      { from: "q0", symbol: "ε", to: "q1" },
      { from: "q1", symbol: "1", to: "q1" },
      { from: "q1", symbol: "ε", to: "q2" },
      { from: "q2", symbol: "2", to: "q2" }
    ],
    explanation: [
      "**State q0:** Reads an arbitrary number of 0s. The machine can use an ε-transition (empty string) to move to q1 at any time without consuming input.",
      "**State q1:** Reads an arbitrary number of 1s. Another ε-transition allows free movement to q2.",
      "**State q2 (Accept):** Reads an arbitrary number of 2s. Because of the free ε-transitions from q0 -> q1 -> q2, the machine can accept a string even if it skips 0s, 1s, or 2s entirely."
    ]
  },

  // ─── VTU-style DFA problems (no exam date attached yet) ───────────────────

  "DFA: Ends with 01": {
    type: 'DFA',
    description: "Design a DFA to accept strings over {0,1} that end with '01'.",
    states: ["q0", "q1", "q2"],
    alphabet: ["0", "1"],
    start: "q0",
    accept: ["q2"],
    tests: { accept: ["01", "001", "101", "1101"], reject: ["", "0", "1", "10", "011", "010"] },
    transitions: [
      { from: "q0", symbol: "0", to: "q1" }, { from: "q0", symbol: "1", to: "q0" },
      { from: "q1", symbol: "0", to: "q1" }, { from: "q1", symbol: "1", to: "q2" },
      { from: "q2", symbol: "0", to: "q1" }, { from: "q2", symbol: "1", to: "q0" }
    ],
    explanation: [
      "**Idea:** Only the last two symbols matter, so each state remembers how much of '01' the current ending matches.",
      "**State q0:** The string so far does not end in a useful '0'. A '1' keeps us here; a '0' could be the start of '01', so move to q1.",
      "**State q1:** The last symbol is '0'. Another '0' still leaves a '0' at the end (stay in q1); a '1' completes '01' (move to q2).",
      "**State q2 (Accept):** The string ends in '01'. A '0' means it now ends in '0' (go to q1); a '1' means it ends in '11', which matches nothing (go to q0).",
      "**Acceptance:** Accept exactly when the input finishes in q2."
    ]
  },

  "DFA: Starts with a, Ends with b": {
    type: 'DFA',
    description: "Design a DFA to accept strings over {a,b} that start with 'a' and end with 'b'.",
    states: ["q0", "q1", "q2", "qd"],
    alphabet: ["a", "b"],
    start: "q0",
    accept: ["q2"],
    tests: { accept: ["ab", "aab", "abb", "abab"], reject: ["", "a", "b", "ba", "aba", "bab"] },
    transitions: [
      { from: "q0", symbol: "a", to: "q1" }, { from: "q0", symbol: "b", to: "qd" },
      { from: "q1", symbol: "a", to: "q1" }, { from: "q1", symbol: "b", to: "q2" },
      { from: "q2", symbol: "a", to: "q1" }, { from: "q2", symbol: "b", to: "q2" },
      { from: "qd", symbol: "a", to: "qd" }, { from: "qd", symbol: "b", to: "qd" }
    ],
    explanation: [
      "**State q0:** Nothing read yet. The first symbol decides everything: 'a' is a valid start (go to q1), 'b' can never be fixed (go to the dead state qd).",
      "**State q1:** Started with 'a' and the last symbol is 'a'. Reading 'b' makes the string end in 'b' (go to q2).",
      "**State q2 (Accept):** Started with 'a' and currently ends in 'b'. Another 'b' keeps that true; an 'a' moves back to q1.",
      "**Dead state qd:** Entered when the string starts with 'b'. It loops on every symbol because no continuation can make the string start with 'a'. A DFA must define every move, so the dead state is required."
    ]
  },

  "DFA: Does NOT Contain 001": {
    type: 'DFA',
    description: "Design a DFA to accept strings over {0,1} that do NOT contain '001' as a substring.",
    states: ["q0", "q1", "q2", "q3"],
    alphabet: ["0", "1"],
    start: "q0",
    accept: ["q0", "q1", "q2"],
    tests: { accept: ["", "0", "00", "1", "000", "0101", "1100"], reject: ["001", "1001", "00010"] },
    transitions: [
      { from: "q0", symbol: "0", to: "q1" }, { from: "q0", symbol: "1", to: "q0" },
      { from: "q1", symbol: "0", to: "q2" }, { from: "q1", symbol: "1", to: "q0" },
      { from: "q2", symbol: "0", to: "q2" }, { from: "q2", symbol: "1", to: "q3" },
      { from: "q3", symbol: "0", to: "q3" }, { from: "q3", symbol: "1", to: "q3" }
    ],
    explanation: [
      "**Complement trick:** First build the DFA that accepts strings containing '001', then swap accepting and non-accepting states.",
      "**States q0, q1, q2:** Track progress towards '001' (nothing, '0', '00'), exactly as in the 'Substring 001' DFA. None of them has seen '001', so all three are accepting here.",
      "**State q3 (Dead):** '001' has appeared, so the string can never be accepted again. It is now the only non-accepting state.",
      "**Why it works:** Complementing only works on a complete DFA (every state has a move on every symbol). It does NOT work directly on an NFA."
    ]
  },

  "DFA: No Two Consecutive 1s": {
    type: 'DFA',
    description: "Design a DFA to accept strings over {0,1} in which no two 1s appear consecutively.",
    states: ["q0", "q1", "qd"],
    alphabet: ["0", "1"],
    start: "q0",
    accept: ["q0", "q1"],
    tests: { accept: ["", "0", "1", "10", "0101", "10101"], reject: ["11", "011", "1101", "0110"] },
    transitions: [
      { from: "q0", symbol: "0", to: "q0" }, { from: "q0", symbol: "1", to: "q1" },
      { from: "q1", symbol: "0", to: "q0" }, { from: "q1", symbol: "1", to: "qd" },
      { from: "qd", symbol: "0", to: "qd" }, { from: "qd", symbol: "1", to: "qd" }
    ],
    explanation: [
      "**State q0 (Accept):** The last symbol was not '1' (or nothing has been read). A '0' keeps us safe; a '1' moves to q1.",
      "**State q1 (Accept):** The last symbol was a single '1'. A '0' resets to q0, but another '1' creates '11'.",
      "**Dead state qd:** '11' has been seen, which breaks the rule permanently, so the machine loops here and rejects.",
      "**Acceptance:** Both q0 and q1 are accepting, because ending in a single '1' is allowed."
    ]
  },

  "DFA: At Most Two 1s": {
    type: 'DFA',
    description: "Design a DFA to accept strings over {0,1} containing at most two 1s.",
    states: ["q0", "q1", "q2", "q3"],
    alphabet: ["0", "1"],
    start: "q0",
    accept: ["q0", "q1", "q2"],
    tests: { accept: ["", "0", "1", "11", "0101", "1000"], reject: ["111", "1011", "10101"] },
    transitions: [
      { from: "q0", symbol: "0", to: "q0" }, { from: "q0", symbol: "1", to: "q1" },
      { from: "q1", symbol: "0", to: "q1" }, { from: "q1", symbol: "1", to: "q2" },
      { from: "q2", symbol: "0", to: "q2" }, { from: "q2", symbol: "1", to: "q3" },
      { from: "q3", symbol: "0", to: "q3" }, { from: "q3", symbol: "1", to: "q3" }
    ],
    explanation: [
      "**Counting states:** q0, q1 and q2 mean 'zero, one, two 1s seen so far'. '0's never change the count, so every state loops on '0'.",
      "**Reading a 1:** Moves one state to the right (q0 → q1 → q2).",
      "**State q3 (Dead):** A third '1' has appeared. The count can never go back down, so the machine stays here and rejects.",
      "**Acceptance:** q0, q1 and q2 are all accepting, since 0, 1 or 2 ones are all 'at most two'."
    ]
  },

  "DFA: Number of a's Divisible by 3": {
    type: 'DFA',
    description: "Design a DFA to accept strings over {a,b} in which the number of a's is divisible by 3.",
    states: ["q0", "q1", "q2"],
    alphabet: ["a", "b"],
    start: "q0",
    accept: ["q0"],
    tests: { accept: ["", "b", "aaa", "bbb", "ababa", "aaba"], reject: ["a", "aa", "ba", "abab"] },
    transitions: [
      { from: "q0", symbol: "a", to: "q1" }, { from: "q0", symbol: "b", to: "q0" },
      { from: "q1", symbol: "a", to: "q2" }, { from: "q1", symbol: "b", to: "q1" },
      { from: "q2", symbol: "a", to: "q0" }, { from: "q2", symbol: "b", to: "q2" }
    ],
    explanation: [
      "**State Meaning:** q0, q1, q2 store (number of a's) mod 3.",
      "**Reading 'a':** Adds one to the count, so the machine moves around the cycle q0 → q1 → q2 → q0.",
      "**Reading 'b':** Does not change the count of a's, so every state loops on 'b'.",
      "**Acceptance:** Accept in q0 (remainder 0). The empty string has zero a's, and 0 is divisible by 3, so ε is accepted."
    ]
  },

  "DFA: Length Divisible by 3": {
    type: 'DFA',
    description: "Design a DFA to accept strings over {a,b} whose length is divisible by 3.",
    states: ["q0", "q1", "q2"],
    alphabet: ["a", "b"],
    start: "q0",
    accept: ["q0"],
    tests: { accept: ["", "aab", "bbb", "abaaba"], reject: ["a", "ab", "abab"] },
    transitions: [
      { from: "q0", symbol: "a", to: "q1" }, { from: "q0", symbol: "b", to: "q1" },
      { from: "q1", symbol: "a", to: "q2" }, { from: "q1", symbol: "b", to: "q2" },
      { from: "q2", symbol: "a", to: "q0" }, { from: "q2", symbol: "b", to: "q0" }
    ],
    explanation: [
      "**State Meaning:** q0, q1, q2 store (length of the string read so far) mod 3.",
      "**Any symbol:** Reading either 'a' or 'b' increases the length by one, so both symbols move to the next state in the cycle.",
      "**Acceptance:** Accept in q0. Compare with 'Number of a's Divisible by 3': there only 'a' advances the cycle, here every symbol does."
    ]
  },

  "DFA: Binary Divisible by 3": {
    type: 'DFA',
    description: "Design a DFA to accept binary numbers that are divisible by 3.",
    states: ["r0", "r1", "r2"],
    alphabet: ["0", "1"],
    start: "r0",
    accept: ["r0"],
    tests: { accept: ["0", "11", "110", "1001", "1111"], reject: ["1", "10", "100", "101", "111"] },
    transitions: [
      { from: "r0", symbol: "0", to: "r0" }, { from: "r0", symbol: "1", to: "r1" },
      { from: "r1", symbol: "0", to: "r2" }, { from: "r1", symbol: "1", to: "r0" },
      { from: "r2", symbol: "0", to: "r1" }, { from: "r2", symbol: "1", to: "r2" }
    ],
    explanation: [
      "**State Meaning:** r0, r1, r2 are the remainder of the number read so far when divided by 3.",
      "**Appending a bit:** Reading bit b turns value v into 2v + b, so the new remainder is (2 × old remainder + b) mod 3.",
      "**Filling the table:** r0 --0--> r0, r0 --1--> r1, r1 --0--> r2, r1 --1--> r0 (3 mod 3), r2 --0--> r1 (4 mod 3), r2 --1--> r2 (5 mod 3).",
      "**Acceptance:** Accept in r0. The same method gives the 'Divisible by 5' DFA with 5 states."
    ]
  },

  "DFA: Ends with abb": {
    type: 'DFA',
    description: "Design a DFA to accept strings over {a,b} ending with 'abb' (the language of (a+b)*abb).",
    states: ["q0", "q1", "q2", "q3"],
    alphabet: ["a", "b"],
    start: "q0",
    accept: ["q3"],
    tests: { accept: ["abb", "aabb", "babb", "abbabb"], reject: ["", "ab", "abba", "bbb", "abab"] },
    transitions: [
      { from: "q0", symbol: "a", to: "q1" }, { from: "q0", symbol: "b", to: "q0" },
      { from: "q1", symbol: "a", to: "q1" }, { from: "q1", symbol: "b", to: "q2" },
      { from: "q2", symbol: "a", to: "q1" }, { from: "q2", symbol: "b", to: "q3" },
      { from: "q3", symbol: "a", to: "q1" }, { from: "q3", symbol: "b", to: "q0" }
    ],
    explanation: [
      "**Prefix tracking:** q0, q1, q2, q3 mean the string currently ends with nothing useful, 'a', 'ab', 'abb'.",
      "**Reading 'a':** From every state, an 'a' can start a fresh 'abb', so all 'a' moves go to q1.",
      "**Reading 'b':** q1 --b--> q2 and q2 --b--> q3 make progress. q0 --b--> q0 stays. From q3, another 'b' makes the ending 'bbb', which matches nothing, so go back to q0.",
      "**Acceptance:** Accept in q3. Compare with the NFA version: the NFA has fewer moves because it can simply 'guess' where 'abb' starts."
    ]
  },

  "DFA: Second Symbol from Right is 1": {
    type: 'DFA',
    description: "Design a DFA to accept strings over {0,1} whose second symbol from the right end is 1.",
    states: ["q00", "q01", "q10", "q11"],
    alphabet: ["0", "1"],
    start: "q00",
    accept: ["q10", "q11"],
    tests: { accept: ["10", "11", "010", "110", "0111"], reject: ["", "0", "1", "00", "01", "101", "1001"] },
    transitions: [
      { from: "q00", symbol: "0", to: "q00" }, { from: "q00", symbol: "1", to: "q01" },
      { from: "q01", symbol: "0", to: "q10" }, { from: "q01", symbol: "1", to: "q11" },
      { from: "q10", symbol: "0", to: "q00" }, { from: "q10", symbol: "1", to: "q01" },
      { from: "q11", symbol: "0", to: "q10" }, { from: "q11", symbol: "1", to: "q11" }
    ],
    explanation: [
      "**State Meaning:** Each state remembers the last two symbols read. qxy means the last two symbols were x then y.",
      "**Start state q00:** Before reading anything there is no '1' in either position, so the start behaves exactly like 'last two were 00'.",
      "**Transitions:** From qxy, reading c moves to qyc: the older symbol drops off and c is added.",
      "**Acceptance:** Accept in q10 and q11, where the second-last symbol is 1. This DFA needs 4 states while the NFA needs only 3, an example of the NFA → DFA blow-up."
    ]
  },

  // ─── VTU-style NFA problems ─────────────────────────────────────────────

  "NFA: Ends with abb": {
    type: 'NFA',
    description: "Design an NFA to accept strings over {a,b} ending with 'abb' (the language of (a+b)*abb).",
    states: ["q0", "q1", "q2", "q3"],
    alphabet: ["a", "b"],
    start: "q0",
    accept: ["q3"],
    tests: { accept: ["abb", "aabb", "babb", "abbabb"], reject: ["", "ab", "abba", "bbb", "abab"] },
    transitions: [
      { from: "q0", symbol: "a", to: "q0" }, { from: "q0", symbol: "b", to: "q0" },
      { from: "q0", symbol: "a", to: "q1" },
      { from: "q1", symbol: "b", to: "q2" },
      { from: "q2", symbol: "b", to: "q3" }
    ],
    explanation: [
      "**State q0 (the (a+b)* part):** Loops on both symbols, so the machine can skip any prefix.",
      "**The guess:** On an 'a', q0 may also branch to q1, guessing that this 'a' starts the final 'abb'.",
      "**Path q1 → q2 → q3:** Must read exactly 'b' then 'b'. If the guess was wrong, that branch has no move and simply dies.",
      "**Acceptance:** The NFA accepts if any branch is in q3 when the input ends. Watch the playback: several states are active at once."
    ]
  },

  "NFA: Second Symbol from Right is 1": {
    type: 'NFA',
    description: "Design an NFA to accept strings over {0,1} whose second symbol from the right end is 1.",
    states: ["q0", "q1", "q2"],
    alphabet: ["0", "1"],
    start: "q0",
    accept: ["q2"],
    tests: { accept: ["10", "11", "010", "110", "0111"], reject: ["", "0", "1", "00", "01", "101", "1001"] },
    transitions: [
      { from: "q0", symbol: "0", to: "q0" }, { from: "q0", symbol: "1", to: "q0" },
      { from: "q0", symbol: "1", to: "q1" },
      { from: "q1", symbol: "0", to: "q2" }, { from: "q1", symbol: "1", to: "q2" }
    ],
    explanation: [
      "**State q0:** Loops on everything, waiting for the right moment.",
      "**The guess:** On a '1', q0 may branch to q1, guessing this '1' is the second-last symbol.",
      "**State q1:** Exactly one more symbol (0 or 1) must follow, moving to q2.",
      "**State q2 (Accept):** Has no outgoing moves, so the guess only survives if the input ends right here. Compare with the 4-state DFA for the same language."
    ]
  },

  "NFA: Contains 101": {
    type: 'NFA',
    description: "Design an NFA to accept strings over {0,1} containing '101' as a substring.",
    states: ["q0", "q1", "q2", "q3"],
    alphabet: ["0", "1"],
    start: "q0",
    accept: ["q3"],
    tests: { accept: ["101", "0101", "1010", "11011"], reject: ["", "1", "10", "100", "1001", "0110"] },
    transitions: [
      { from: "q0", symbol: "0", to: "q0" }, { from: "q0", symbol: "1", to: "q0" },
      { from: "q0", symbol: "1", to: "q1" },
      { from: "q1", symbol: "0", to: "q2" },
      { from: "q2", symbol: "1", to: "q3" },
      { from: "q3", symbol: "0", to: "q3" }, { from: "q3", symbol: "1", to: "q3" }
    ],
    explanation: [
      "**State q0:** Skips any prefix by looping on 0 and 1.",
      "**The guess:** On a '1', branch to q1, guessing that '101' starts here.",
      "**Path q1 → q2 → q3:** Reads '0' then '1'. A wrong guess dies because q1 has no move on '1' and q2 has no move on '0'.",
      "**State q3 (Accept):** '101' has been found, so loop on everything: whatever follows, the substring is already present."
    ]
  },

  // ─── VTU-style ε-NFA problems ───────────────────────────────────────────

  "ε-NFA: 0* + 1*": {
    type: 'eNFA',
    description: "Design an ε-NFA for the regular expression 0* + 1* (all 0s or all 1s, including the empty string).",
    states: ["q0", "q1", "q2"],
    alphabet: ["0", "1"],
    start: "q0",
    accept: ["q1", "q2"],
    tests: { accept: ["", "0", "000", "1", "11"], reject: ["01", "10", "0011"] },
    transitions: [
      { from: "q0", symbol: "ε", to: "q1" },
      { from: "q0", symbol: "ε", to: "q2" },
      { from: "q1", symbol: "0", to: "q1" },
      { from: "q2", symbol: "1", to: "q2" }
    ],
    explanation: [
      "**Union with ε:** The start state q0 has two ε-moves, one into each half of 0* + 1*. This is how the '+' (union) operator is built.",
      "**ε-closure of q0:** {q0, q1, q2}. Before reading anything the machine is already in both branches, so ε is accepted.",
      "**Branch q1:** Loops on '0' and dies on '1'. **Branch q2:** Loops on '1' and dies on '0'.",
      "**Acceptance:** A mixed string such as '01' kills both branches, so it is rejected. Step through it to watch each branch die."
    ]
  }
};
