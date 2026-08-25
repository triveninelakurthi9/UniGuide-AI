import React from 'react';
import { Compass, Moon, Sun, User, Sparkles, Calculator, BookOpen, Layers } from 'lucide-react';
import { UserRole } from '../types';

interface NavbarProps {
  activeTab: 'home' | 'predictor' | 'choice-filler' | 'scholarships' | 'alternate' | 'documents' | 'admin';
  setActiveTab: (tab: 'home' | 'predictor' | 'choice-filler' | 'scholarships' | 'alternate' | 'documents' | 'admin') => void;
  role: UserRole;
  setRole: (role: UserRole) => void;
  onOpenChat: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  role,
  setRole,
  onOpenChat,
}) => {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-sm font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        {/* Left: Brand Logo matching reference screenshot */}
        <div 
          onClick={() => setActiveTab('home')}
          className="flex items-center gap-3 cursor-pointer group select-none"
        >
          <div className="relative w-11 h-11 rounded-xl bg-gradient-to-tr from-[#103463] to-[#1e4d8c] flex items-center justify-center text-white shadow-md shadow-slate-900/10 group-hover:scale-105 transition-transform">
            <Compass className="w-6 h-6 text-cyan-300" />
            <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white flex items-center justify-center">
              <span className="w-1.5 h-1.5 bg-white rounded-full animate-ping" />
            </span>
          </div>

          <div className="flex flex-col">
            <span className="text-xl font-extrabold text-[#0f172a] tracking-tight flex items-center gap-1 font-serif">
              UniGuide <span className="text-[#1e4d8c] font-sans font-black">Ai</span>
            </span>
            <span className="text-[10px] font-bold tracking-widest uppercase text-slate-500 font-mono -mt-1">
              ACADEMIC PREDICTOR
            </span>
          </div>
        </div>

        {/* Center: Main Navigation Bar matching reference screenshot */}
        <nav className="hidden md:flex items-center gap-8 font-semibold text-sm text-slate-700">
          <button
            onClick={() => setActiveTab('home')}
            className={`transition-colors py-2 relative ${
              activeTab === 'home'
                ? 'text-[#1e3a8a] font-bold border-b-2 border-[#1e3a8a]'
                : 'hover:text-[#1e3a8a]'
            }`}
          >
            Home
          </button>

          <button
            onClick={() => setActiveTab('scholarships')}
            className={`transition-colors py-2 relative ${
              activeTab === 'scholarships' || activeTab === 'documents'
                ? 'text-[#1e3a8a] font-bold border-b-2 border-[#1e3a8a]'
                : 'hover:text-[#1e3a8a]'
            }`}
          >
            Scholarships
          </button>

          <button
            onClick={() => setActiveTab('choice-filler')}
            className={`transition-colors py-2 relative flex items-center gap-1.5 ${
              activeTab === 'choice-filler'
                ? 'text-[#1e3a8a] font-bold border-b-2 border-[#1e3a8a]'
                : 'hover:text-[#1e3a8a]'
            }`}
          >
            <span>AI Choice Filler</span>
          </button>

          <button
            onClick={() => setActiveTab('predictor')}
            className={`transition-colors py-2 relative ${
              activeTab === 'predictor'
                ? 'text-[#1e3a8a] font-bold border-b-2 border-[#1e3a8a]'
                : 'hover:text-[#1e3a8a]'
            }`}
          >
            Predictor
          </button>

          <button
            onClick={() => setActiveTab('alternate')}
            className={`transition-colors py-2 relative ${
              activeTab === 'alternate'
                ? 'text-[#1e3a8a] font-bold border-b-2 border-[#1e3a8a]'
                : 'hover:text-[#1e3a8a]'
            }`}
          >
            Alternate Path
          </button>
        </nav>

        {/* Right: Theme Toggle & Sign In Button */}
        <div className="flex items-center gap-4">
          {/* Role Switcher Pill */}
          <button
            onClick={() => setRole(role === 'student' ? 'admin' : 'student')}
            className={`text-xs font-bold px-2.5 py-1 rounded-full border transition ${
              role === 'admin'
                ? 'bg-amber-100 text-amber-800 border-amber-300'
                : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
            }`}
          >
            {role === 'admin' ? 'Role: ADMIN' : 'Role: STUDENT'}
          </button>

          {/* Theme Mode Toggle Icon */}
          <button 
            className="p-2 text-slate-600 hover:text-slate-900 rounded-full hover:bg-slate-100 transition"
            title="Toggle theme"
          >
            <Moon className="w-5 h-5 text-slate-700" />
          </button>

          {/* Sign In Button matching reference screenshot */}
          <button 
            onClick={onOpenChat}
            className="flex items-center gap-2 bg-[#1e3a8a] hover:bg-[#152a65] text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-md transition-all duration-150"
          >
            <User className="w-4 h-4 text-white" />
            <span>Sign In</span>
          </button>
        </div>
      </div>
    </header>
  );
};
