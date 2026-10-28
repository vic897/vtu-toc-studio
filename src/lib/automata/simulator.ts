import { AutomatonSpec, ExecutionStep, ExecutionStatus } from '@/types/automata';
import { epsilonClosure, getTransitions } from './closure';

export function simulate(machine: AutomatonSpec, input: string): ExecutionStep[] {
  const steps: ExecutionStep[] = [];
  let active = epsilonClosure(machine, [machine.start]);
  let consumed = 0;

  const isAccepting = (states: string[]) => 
    states.some(s => machine.accept.includes(s));

  // Step 0: Initial state closure. Accept/reject is only decided once the
  // whole tape is read (see the final lock below), never mid-string.
  steps.push({
    index: 0,
    consumed,
    activeStates: active,
    activeTransitions: [],
    tapePosition: -1,
    status: 'running',
  });

  // Character-by-character evaluation
  for (const symbol of input) {
    const validTransitions = getTransitions(machine, active, symbol);
    const nextStates = epsilonClosure(machine, validTransitions.map(t => t.to));

    consumed++;

    const status: ExecutionStatus = nextStates.length === 0 ? 'error' : 'running'; // 'error' = machine died

    steps.push({
      index: steps.length,
      consumed,
      activeStates: nextStates,
      activeTransitions: validTransitions,
      tapePosition: consumed - 1,
      status,
      message: nextStates.length === 0 ? `Died on symbol '${symbol}'` : undefined
    });

    active = nextStates;
    if (status === 'error') break;
  }

  // Lock final step status
  const lastStep = steps[steps.length - 1];
  if (lastStep.status !== 'error') {
    lastStep.status = isAccepting(lastStep.activeStates) ? 'accepted' : 'rejected';
  }

  return steps;
}