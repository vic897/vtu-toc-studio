'use client';
import { useEffect, useMemo, useState } from 'react';
import { useAutomataStore } from '@/store/useAutomataStore';
import { pyqBank } from '@/data/pyq-bank';

import AutomataCanvas from '@/components/visualizer/AutomataCanvas';
import TapeController from '@/components/visualizer/TapeController';
import TransitionTable from '@/components/visualizer/TransitionTable';
import TupleDisplay from '@/components/visualizer/TupleDisplay';
import ExplanationPanel from '@/components/explanation/ExplainationPanel';
import { AutomatonType } from '@/types/automata';
import { subsetConstruction } from '@/lib/automata/subset';

const PROBLEM_GROUPS: { type: AutomatonType; label: string }[] = [
  { type: 'DFA', label: 'DFA' },
  { type: 'NFA', label: 'NFA' },
  { type: 'eNFA', label: 'ε-NFA' },
];

type ViewMode = 'original' | 'subset';

export default function Workspace() {
  const { loadMachine } = useAutomataStore();
  const [selectedKey, setSelectedKey] = useState(Object.keys(pyqBank)[0]);
  const [view, setView] = useState<ViewMode>('original');

  const selected = pyqBank[selectedKey];
  const canConvert = selected.type !== 'DFA';
  const subsetDfa = useMemo(
    () => (canConvert ? subsetConstruction(selected, selectedKey) : null),
    [canConvert, selected, selectedKey]
  );

  // Single source of truth: whenever the selection or view changes, load that machine.
  useEffect(() => {
    loadMachine(view === 'subset' && subsetDfa ? subsetDfa : selected);
  }, [selected, subsetDfa, view, loadMachine]);

  const handleProblemChange = (key: string) => {
    setSelectedKey(key);
    setView('original');
  };

  return (
    <main className="max-w-[1600px] mx-auto text-slate-300 p-4 md:p-6 font-sans">
      {/* Workspace Toolbar */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 bg-slate-900/40 p-3 rounded-xl border border-slate-800/60">
        <div className="px-2">
          <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-wider">Active Problem</h2>
        </div>

        <div className="w-full md:w-auto">
          <select
            value={selectedKey}
            onChange={(e) => handleProblemChange(e.target.value)}
            className="w-full md:w-96 bg-slate-950 border border-slate-700 text-slate-200 rounded-lg px-4 py-2 outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500/50 shadow-inner transition-all text-sm font-medium"
          >
            {PROBLEM_GROUPS.map(({ type, label }) => (
              <optgroup key={type} label={label}>
                {Object.entries(pyqBank)
                  .filter(([, m]) => m.type === type)
                  .map(([key]) => (
                    <option key={key} value={key}>{key}</option>
                  ))}
              </optgroup>
            ))}
          </select>
        </div>
      </div>

      {/* Split Pane Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* Left Window: Explanation Panel */}
        <div className="lg:col-span-4 flex flex-col h-full">
          <ExplanationPanel />
        </div>

        {/* Right Window: Visualizer Workspace */}
        <div className="lg:col-span-8 flex flex-col gap-6">

          {/* Top Block: Canvas and Tape */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col gap-4">
            <div className="flex justify-between items-center px-2">
              <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">State Machine Viewer</h3>
              {canConvert && (
                <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs font-semibold">
                  {([
                    ['original', selected.type === 'eNFA' ? 'ε-NFA' : 'NFA'],
                    ['subset', 'Subset → DFA'],
                  ] as const).map(([mode, label]) => (
                    <button
                      key={mode}
                      onClick={() => setView(mode)}
                      aria-pressed={view === mode}
                      className={`px-3 py-1.5 rounded-md transition-colors ${view === mode ? 'bg-slate-800 text-teal-300' : 'text-slate-400 hover:text-slate-200'}`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <AutomataCanvas />
            <TapeController />
          </div>

          {/* Bottom Block: Table and Formal Definition Side-by-Side */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
            <TransitionTable />
            <TupleDisplay />
          </div>

        </div>
      </div>
    </main>
  );
}
