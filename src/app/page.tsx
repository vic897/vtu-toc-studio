'use client';
import { useEffect, useState } from 'react';
import { useAutomataStore } from '@/store/useAutomataStore';
import { pyqBank } from '@/data/pyq-bank';

import AutomataCanvas from '@/components/visualizer/AutomataCanvas';
import TapeController from '@/components/visualizer/TapeController';
import TransitionTable from '@/components/visualizer/TransitionTable';
import TupleDisplay from '@/components/visualizer/TupleDisplay';
import ExplanationPanel from '@/components/explanation/ExplainationPanel';

export default function Workspace() {
  const { loadMachine } = useAutomataStore();
  const [selectedKey, setSelectedKey] = useState(Object.keys(pyqBank)[0]);

  // Single source of truth: whenever the selection changes, load that machine.
  useEffect(() => {
    loadMachine(pyqBank[selectedKey]);
  }, [selectedKey, loadMachine]);

  return (
    <main className="max-w-[1600px] mx-auto text-slate-300 p-4 md:p-6 font-sans">
      {/* Workspace Toolbar */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 bg-slate-900/40 p-3 rounded-xl border border-slate-800/60">
        <div className="px-2">
          <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-wider">Active Problem</h2>
        </div>

        <div className="w-full md:w-auto flex items-center gap-3">
          <select
            value={selectedKey}
            onChange={(e) => setSelectedKey(e.target.value)}
            className="w-full md:w-96 bg-slate-950 border border-slate-700 text-slate-200 rounded-lg px-4 py-2 outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500/50 shadow-inner transition-all text-sm font-medium"
          >
            {Object.keys(pyqBank).map(key => (
              <option key={key} value={key}>{key}</option>
            ))}
          </select>
          {/* Phase 2: opens the Custom JSON modal builder */}
          <button
            disabled
            title="Custom JSON builder arrives in Phase 2"
            className="bg-teal-600 text-white px-4 py-2 rounded-lg text-sm font-semibold shadow-lg shadow-teal-900/20 whitespace-nowrap disabled:opacity-40 disabled:cursor-not-allowed"
          >
            + Custom JSON
          </button>
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
