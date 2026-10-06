import { AutomatonSpec } from '@/types/automata';

export const pyqBank = {
  "DFA: Substring 001 (July '25)": {
    type: 'DFA',
    description: "Design a DFA to accept strings over {0,1} containing '001' as a substring.",
    states: ["q0", "q1", "q2", "q3"],
    alphabet: ["0", "1"],
    start: "q0",
    accept: ["q3"],
    tests: {
      accept: ["001", "1001", "00010"],
      reject: ["00", "0101", "1100"]
    },
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
    tests: {
      accept: ["0", "101", "1010", "1111"],
      reject: ["1", "10", "11", "100"]
    },
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
  }
};