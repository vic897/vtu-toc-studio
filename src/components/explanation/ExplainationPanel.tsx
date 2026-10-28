'use client';
import { useEffect, useState } from 'react';
import { useAutomataStore } from '@/store/useAutomataStore';
import { BookOpen, Sparkles, Loader2, AlertTriangle, RotateCcw } from 'lucide-react';
import { getAiExplanation, hashMachine, ExplanationSource } from '@/lib/ai/ai-service';

// Result of the last AI lookup, tagged with the machine it belongs to so a
// stale response can never be shown against a different machine.
type AiResult =
  | { key: string; steps: string[]; source: ExplanationSource }
  | { key: string; error: string };

// Renders `**bold**` segments anywhere in a step, not just a leading one.
function renderStep(step: string) {
  return step.split('**').map((part, i) =>
    i % 2 === 1 ? <strong key={i} className="text-slate-200">{part}</strong> : part
  );
}

export default function ExplanationPanel() {
  const { activeMachine } = useAutomataStore();
  const [aiResult, setAiResult] = useState<AiResult | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  const hasStatic = !!activeMachine?.explanation?.length;
  const cacheKey = activeMachine ? hashMachine(activeMachine) : null;

  useEffect(() => {
    if (!activeMachine || hasStatic || !cacheKey) return;

    const controller = new AbortController();
    getAiExplanation(activeMachine, controller.signal)
      .then(({ steps, source }) => setAiResult({ key: cacheKey, steps, source }))
      .catch((err: Error) => {
        if (err.name !== 'AbortError') setAiResult({ key: cacheKey, error: err.message });
      });
    return () => controller.abort();
  }, [activeMachine, hasStatic, cacheKey, retryCount]);

  if (!activeMachine) return null;

  const current = aiResult?.key === cacheKey ? aiResult : null;
  const isLoading = !hasStatic && !current;
  const error = current && 'error' in current ? current.error : null;
  const source = hasStatic ? 'static' : current && 'source' in current ? current.source : null;
  const displaySteps = hasStatic
    ? activeMachine.explanation!
    : current && 'steps' in current ? current.steps : [];

  const handleRetry = () => {
    setAiResult(null);
    setRetryCount(c => c + 1);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 h-full flex flex-col">
      <div className="flex items-center justify-between gap-3 mb-6 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-teal-900/50 text-teal-400 rounded-lg">
            <BookOpen size={24} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-100">Theory & Logic</h2>
            <p className="text-sm text-slate-400 uppercase tracking-wider">
              {activeMachine.type === 'eNFA' ? 'ε-NFA' : activeMachine.type} Breakdown
            </p>
          </div>
        </div>
        {/* Source Badge */}
        {source === 'static' ? (
          <div className="px-3 py-1 bg-teal-500/10 border border-teal-500/20 text-teal-400 text-xs font-semibold uppercase tracking-wider rounded-full whitespace-nowrap">
            VTU PYQ
          </div>
        ) : !error && (
          <div className="flex items-center gap-1.5 px-3 py-1 bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold uppercase tracking-wider rounded-full whitespace-nowrap">
            {isLoading ? <Loader2 size={12} className="animate-spin" /> : <Sparkles size={12} />}
            {isLoading ? 'Generating' : source === 'cache' ? 'Cached AI' : 'AI Generated'}
          </div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto pr-2">
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-teal-500 uppercase tracking-wider mb-2">Problem Statement</h3>
          <p className="text-slate-300 leading-relaxed bg-slate-950 p-4 rounded-lg border border-slate-800/50">
            {activeMachine.description || 'Custom Automaton Configuration'}
          </p>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-teal-500 uppercase tracking-wider mb-4">Step-by-Step Construction</h3>

          {isLoading ? (
            <div className="space-y-4 animate-pulse">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex gap-4 p-4 bg-slate-800/20 rounded-lg border border-slate-800/50">
                  <div className="w-6 h-6 rounded-full bg-slate-700 flex-shrink-0" />
                  <div className="space-y-2 flex-1">
                    <div className="h-4 bg-slate-700 rounded w-1/4" />
                    <div className="h-4 bg-slate-700 rounded w-full" />
                    <div className="h-4 bg-slate-700 rounded w-5/6" />
                  </div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="flex flex-col gap-3 p-4 bg-red-500/5 rounded-lg border border-red-500/20 text-sm">
              <div className="flex items-start gap-2 text-red-300">
                <AlertTriangle size={16} className="flex-shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
              <button
                onClick={handleRetry}
                className="self-start flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-md text-xs font-semibold transition-colors"
              >
                <RotateCcw size={12} /> Try again
              </button>
            </div>
          ) : displaySteps.length > 0 ? (
            <ul className="space-y-4">
              {displaySteps.map((step, idx) => (
                <li key={idx} className="flex gap-4 items-start text-slate-300 bg-slate-800/20 p-4 rounded-lg border border-slate-800/50">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-slate-800 text-slate-400 flex items-center justify-center text-xs font-bold mt-0.5">
                    {idx + 1}
                  </span>
                  <div className="leading-relaxed">{renderStep(step)}</div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-slate-500 italic p-4 bg-slate-950 rounded-lg border border-slate-800/50">
              No explanation available.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
