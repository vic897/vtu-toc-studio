export type AutomatonType = 'DFA' | 'NFA' | 'eNFA';
export type ExecutionStatus = 'running' | 'accepted' | 'rejected' | 'error';

export interface Transition {
  from: string;
  symbol: string;
  to: string;
}

export interface AutomatonTests {
  accept: string[];
  reject: string[];
}

export interface ActiveTransition {
  from: string;
  to: string;
  symbol: string;
}

export interface AutomatonSpec {
  id?: string;
  type: AutomatonType;
  states: string[];
  alphabet: string[];
  start: string;
  accept: string[];
  transitions: Transition[];
  description?: string;
  explanation?: string[];
  tests?: AutomatonTests;
  derivedFrom?: string;      // Set on machines generated from another one (e.g. subset construction)
}

export interface ExecutionStep {
  index: number;
  consumed: number;          // Number of characters read from tape
  activeStates: string[];    // Array to support NFA branching
  activeTransitions: ActiveTransition[];
  tapePosition: number;      // -1 for Step 0 (before reading)
  status: ExecutionStatus;
  message?: string;
}