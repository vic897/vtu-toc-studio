'use client';
import { useEffect } from 'react';
import { useAutomataStore } from '@/store/useAutomataStore';
import { Play, Pause, SkipBack, SkipForward, RotateCcw } from 'lucide-react';

export default function TapeController() {
  const { 
    inputString, setInput, executionSteps, currentStepIndex, isPlaying, setPlaying, stepForward, stepBackward, reset 
  } = useAutomataStore();

  const currentStep = executionSteps[currentStepIndex];
  const isComplete = executionSteps.length > 0 && currentStepIndex === executionSteps.length - 1;

  const handleTogglePlay = () => {
    setPlaying(!isPlaying);
  };

  // Autoplay timer
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isPlaying) {
      if (isComplete) {
        setPlaying(false);
      } else {
        timer = setTimeout(() => stepForward(), 800);
      }
    }
    return () => clearTimeout(timer);
  }, [isPlaying, currentStepIndex, isComplete, stepForward, setPlaying]);

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPlaying(false);
    setInput(e.target.value);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 mt-4 space-y-4">
      <div className="flex gap-2">
        <input 
          type="text" 
          value={inputString} 
          onChange={handleInput} 
          placeholder="Enter test string..."
          className="flex-1 bg-slate-800 text-slate-100 px-4 py-2 rounded-lg outline-none focus:ring-2 focus:ring-teal-500"
        />
      </div>

      {/* Tape Visualization */}
      <div className="font-mono text-2xl tracking-[0.2em] bg-slate-950 py-3 px-4 rounded-lg overflow-x-auto whitespace-nowrap">
        {inputString.length === 0 ? (
          <span className="text-slate-600 text-sm tracking-normal">ε (Empty String)</span>
        ) : (
          inputString.split('').map((char, i) => {
            const isActive = currentStep?.tapePosition === i;
            const isPast = currentStep?.tapePosition !== undefined && i < currentStep.tapePosition;
            return (
              <span 
                key={i} 
                className={`${isActive ? 'bg-amber-500 text-black px-1 rounded font-bold' : ''} ${isPast ? 'text-slate-500' : 'text-slate-200'}`}
              >
                {char}
              </span>
            );
          })
        )}
      </div>

      {/* Status & Controls */}
      <div className="flex items-center justify-between">
        <div className={`font-semibold ${currentStep?.status === 'accepted' ? 'text-green-500' : currentStep?.status === 'error' || (isComplete && currentStep?.status === 'rejected') ? 'text-red-500' : 'text-slate-300'}`}>
          {currentStep ? `Step ${currentStepIndex}/${executionSteps.length - 1} • Status: ${currentStep.status.toUpperCase()}` : 'Ready'}
        </div>
        <div className="flex gap-2">
          <button onClick={reset} className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white"><RotateCcw size={20} /></button>
          <button onClick={stepBackward} disabled={currentStepIndex === 0} className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white disabled:opacity-50"><SkipBack size={20} /></button>
          <button onClick={handleTogglePlay} className="p-2 bg-teal-600 hover:bg-teal-500 rounded-lg text-white"><Play size={20} className={isPlaying ? 'hidden' : 'block'} /><Pause size={20} className={!isPlaying ? 'hidden' : 'block'} /></button>
          <button onClick={stepForward} disabled={isComplete} className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white disabled:opacity-50"><SkipForward size={20} /></button>
        </div>
      </div>
    </div>
  );
}