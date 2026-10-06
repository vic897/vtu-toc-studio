'use client';
import { useAutomataStore } from '@/store/useAutomataStore';
import { BookOpen } from 'lucide-react';

export default function ExplanationPanel() {
  const { activeMachine } = useAutomataStore();

  if (!activeMachine) return null;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 h-full flex flex-col">
      <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-800">
        <div className="p-2 bg-teal-900/50 text-teal-400 rounded-lg">
          <BookOpen size={24} />
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-100">Theory & Logic</h2>
          <p className="text-sm text-slate-400 uppercase tracking-wider">{activeMachine.type} Breakdown</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pr-2">
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-teal-500 uppercase tracking-wider mb-2">Problem Statement</h3>
          <p className="text-slate-300 leading-relaxed bg-slate-950 p-4 rounded-lg border border-slate-800/50">
            {activeMachine.description || 'No description provided for this machine.'}
          </p>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-teal-500 uppercase tracking-wider mb-4">Step-by-Step Construction</h3>
          {activeMachine.explanation && activeMachine.explanation.length > 0 ? (
            <ul className="space-y-4">
              {activeMachine.explanation.map((step, idx) => {
                const [boldPart, ...rest] = step.split('**');
                return (
                  <li key={idx} className="flex gap-4 items-start text-slate-300 bg-slate-800/20 p-4 rounded-lg border border-slate-800/50">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-slate-800 text-slate-400 flex items-center justify-center text-xs font-bold mt-0.5">
                      {idx + 1}
                    </span>
                    <div className="leading-relaxed">
                      {step.includes('**') ? (
                        <>
                          <strong className="text-slate-200">{step.split('**')[1]}</strong>
                          {step.split('**')[2]}
                        </>
                      ) : (
                        step
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>
          ) : (
            <div className="text-slate-500 italic p-4 bg-slate-950 rounded-lg">
              AI Dynamic Explanation goes here (Epic 4 implementation pending).
            </div>
          )}
        </div>
      </div>
    </div>
  );
}