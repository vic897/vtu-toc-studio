'use client';
import { useAutomataStore } from '@/store/useAutomataStore';
import { isEpsilon } from '@/lib/automata/closure';

export default function TupleDisplay() {
  const { activeMachine } = useAutomataStore();

  if (!activeMachine) return null;

  const { type, states, alphabet, start, accept, transitions } = activeMachine;
  const hasEpsilon = type === 'eNFA' || transitions.some(t => isEpsilon(t.symbol));

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 text-slate-300 h-full">
      <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400 mb-4 px-1 border-b border-slate-800 pb-3">
        Formal Definition ({type === 'eNFA' ? 'ε-NFA' : type})
      </h3>
      <div className="font-mono text-sm space-y-3 px-1">
        <p>M = (Q, Σ, δ, q₀, F)</p>
        <div className="pl-4 space-y-2 border-l-2 border-slate-800">
          <p><span className="text-teal-400">Q (States)</span> = {'{'}{states.join(', ')}{'}'}</p>
          <p><span className="text-teal-400">Σ (Alphabet)</span> = {'{'}{alphabet.join(', ')}{'}'}</p>
          <p><span className="text-teal-400">q₀ (Start)</span> = {start}</p>
          <p><span className="text-teal-400">F (Accept)</span> = {'{'}{accept.join(', ') || '∅'}{'}'}</p>
          <p><span className="text-teal-400">δ (Transitions)</span> : Q × {hasEpsilon ? '(Σ ∪ {ε})' : 'Σ'} → {type === 'DFA' ? 'Q' : 'P(Q)'}</p>
        </div>
      </div>
    </div>
  );
}