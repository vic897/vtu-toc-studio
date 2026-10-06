'use client';
import { useAutomataStore } from '@/store/useAutomataStore';
import { isEpsilon } from '@/lib/automata/closure';

export default function TransitionTable() {
  const { activeMachine, executionSteps, currentStepIndex } = useAutomataStore();

  if (!activeMachine) return null;

  const { type, states, alphabet, start, accept, transitions } = activeMachine;
  const hasEpsilon = transitions.some(t => isEpsilon(t.symbol));
  const cols = [...alphabet, ...(hasEpsilon ? ['ε'] : [])];

  const currentStep = executionSteps[currentStepIndex];
  const activeStates = currentStep ? new Set(currentStep.activeStates) : new Set();

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 overflow-x-auto h-full">
      <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4 px-1">Transition Table</h3>
      <table className="w-full text-left border-collapse text-sm font-mono">
        <thead>
          <tr className="bg-slate-950 text-slate-400">
            <th className="p-3 border border-slate-800 rounded-tl-lg">State</th>
            {cols.map(c => <th key={c} className="p-3 border border-slate-800 text-center">{c}</th>)}
          </tr>
        </thead>
        <tbody>
          {states.map(q => {
            const isActive = activeStates.has(q);
            const isStart = q === start;
            const isAccept = accept.includes(q);

            return (
              <tr key={q} className={`${isActive ? 'bg-amber-500/10 text-amber-400' : 'text-slate-300'} hover:bg-slate-800/50 transition-colors`}>
                <td className={`p-3 border border-slate-800 ${isActive ? 'font-bold border-l-2 border-l-amber-500' : ''}`}>
                  {isStart && '→ '}
                  {isAccept && '* '}
                  {q}
                </td>
                {cols.map(c => {
                  const targets = transitions
                    .filter(t => t.from === q && (c === 'ε' ? isEpsilon(t.symbol) : t.symbol === c))
                    .map(t => t.to);
                  
                  const cellValue = type === 'DFA' 
                    ? (targets[0] || '∅')
                    : (targets.length ? `{${targets.join(',')}}` : '∅');

                  return (
                    <td key={c} className="p-3 border border-slate-800 text-center text-slate-400">
                      {cellValue}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
      <p className="text-xs text-slate-500 mt-3 px-1">→ Start State &nbsp;&nbsp; * Accept State</p>
    </div>
  );
}