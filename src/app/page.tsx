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
  const [selectedKey, setSelectedKey] = useState<keyof typeof pyqBank>(
    Object.keys(pyqBank)[0] as keyof typeof pyqBank,
  );

  const selectedMachine = pyqBank[selectedKey] as Parameters<typeof loadMachine>[0];

  // Load initial machine on mount
  useEffect(() => {
    loadMachine(selectedMachine);
  }, [selectedMachine, loadMachine]);

  const handleMachineChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const key = e.target.value as keyof typeof pyqBank;
    const machine = pyqBank[key] as Parameters<typeof loadMachine>[0];

    setSelectedKey(key);
    loadMachine(machine);
  };

  return (
    <main className="min-h-screen bg-slate-950 text-slate-300 p-4 md:p-6 font-sans">
      {/* Header Bar */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            VTU TOC Studio
            <span className="text-xs bg-teal-600/20 text-teal-400 px-2 py-1 rounded-full border border-teal-600/30 uppercase tracking-wider">
              Phase 1
            </span>
          </h1>
          <p className="text-sm text-slate-500 mt-1">Interactive Automata Visualizer & Study Guide</p>
        </div>
        
        <div className="w-full md:w-auto">
          <select 
            value={selectedKey}
            onChange={handleMachineChange}
            className="w-full md:w-80 bg-slate-900 border border-slate-700 text-white rounded-lg px-4 py-2.5 outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all"
          >
            {Object.keys(pyqBank).map(key => (
              <option key={key} value={key}>{key}</option>
            ))}
          </select>
        </div>
      </header>

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