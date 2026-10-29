import { create } from 'zustand';
import { AutomatonSpec, ExecutionStep } from '@/types/automata';
import { simulate } from '@/lib/automata/simulator';

interface AutomataState {
  activeMachine: AutomatonSpec | null;
  inputString: string;
  executionSteps: ExecutionStep[];
  currentStepIndex: number;
  isPlaying: boolean;

  loadMachine: (machine: AutomatonSpec) => void;
  setInput: (input: string) => void;
  stepForward: () => void;
  stepBackward: () => void;
  reset: () => void;
  setPlaying: (playing: boolean) => void;
}

export const useAutomataStore = create<AutomataState>((set, get) => ({
  activeMachine: null,
  inputString: '',
  executionSteps: [],
  currentStepIndex: 0,
  isPlaying: false,

  loadMachine: (machine: AutomatonSpec) => {
    // Keep the tape when switching problems (e.g. NFA ↔ its subset DFA), unless
    // it uses symbols the new machine's alphabet doesn't have.
    const { inputString: current } = get();
    const inputString = [...current].every(c => machine.alphabet.includes(c)) ? current : '';
    const steps = simulate(machine, inputString);
    set({
      activeMachine: machine,
      inputString,
      executionSteps: steps, 
      currentStepIndex: 0,
      isPlaying: false
    });
  },

  setInput: (input: string) => {
    const { activeMachine } = get();
    if (!activeMachine) return;
    const steps = simulate(activeMachine, input);
    set({ 
      inputString: input, 
      executionSteps: steps, 
      currentStepIndex: 0,
      isPlaying: false
    });
  },

  stepForward: () => {
    set((state) => ({
      currentStepIndex: Math.min(state.currentStepIndex + 1, state.executionSteps.length - 1)
    }));
  },

  stepBackward: () => {
    set((state) => ({
      currentStepIndex: Math.max(state.currentStepIndex - 1, 0)
    }));
  },

  reset: () => set({ currentStepIndex: 0, isPlaying: false }),
  
  setPlaying: (playing: boolean) => set({ isPlaying: playing })
}));