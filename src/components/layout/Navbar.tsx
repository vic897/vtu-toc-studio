'use client';
import Link from 'next/link';
import { Hexagon, BookOpen, Settings, GitBranch } from 'lucide-react';

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 w-full backdrop-blur-md bg-slate-950/80 border-b border-teal-900/30 shadow-[0_4px_30px_rgba(13,148,136,0.05)]">
      <div className="max-w-[1600px] mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
        
        {/* Brand Logo & Name */}
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-teal-500/10 border border-teal-500/20 text-teal-400 shadow-[0_0_15px_rgba(13,148,136,0.2)]">
            <Hexagon size={18} />
          </div>
          <Link href="/" className="text-lg font-bold text-slate-100 tracking-wide flex items-center gap-2">
            VTU TOC Studio
            <span className="text-[10px] font-bold bg-teal-500/20 text-teal-300 px-2 py-0.5 rounded-full border border-teal-500/30 uppercase tracking-widest">
              Phase 1
            </span>
          </Link>
        </div>

        {/* Navigation Links */}
        <div className="hidden md:flex items-center gap-1 bg-slate-900/50 p-1 rounded-lg border border-slate-800/60">
          <Link href="/" className="px-4 py-1.5 text-sm font-medium text-teal-300 bg-slate-800/80 rounded-md shadow-sm transition-colors">
            Workspace
          </Link>
          <Link href="#" className="px-4 py-1.5 text-sm font-medium text-slate-400 hover:text-slate-200 transition-colors flex items-center gap-2">
            <BookOpen size={14} />
            Theory Hub
          </Link>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          <button className="p-2 text-slate-400 hover:text-teal-300 hover:bg-slate-800/50 rounded-lg transition-all">
            <Settings size={18} />
          </button>
          <a href="#" className="p-2 text-slate-400 hover:text-slate-100 hover:bg-slate-800/50 rounded-lg transition-all hidden sm:block">
            <GitBranch size={18} />
          </a>
        </div>

      </div>
    </nav>
  );
}