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
  }
};