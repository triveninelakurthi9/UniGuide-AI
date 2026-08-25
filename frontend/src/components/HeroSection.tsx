import React from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';

interface HeroSectionProps {
  onPredictClick: () => void;
  onBrowseClick: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onPredictClick, onBrowseClick }) => {
  return (
    <section className="relative w-full min-h-[520px] bg-[#0c1322] text-white flex flex-col justify-between p-8 md:p-16 rounded-3xl overflow-hidden shadow-2xl border border-slate-800">
      {/* High-res background image matching reference screenshot (students throwing graduation caps in air) */}
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-30 mix-blend-luminosity pointer-events-none"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=1600')`,
        }}
      />

      {/* Dark gradient overlay for strong text contrast */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#070b14] via-[#0b1322]/85 to-transparent pointer-events-none" />

      {/* Content Container */}
      <div className="relative z-10 space-y-6 max-w-3xl pt-4">
        {/* Admissions Pill */}
        <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-1.5 text-xs font-semibold text-emerald-400 backdrop-blur-md">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>Admissions Open 2025-26</span>
        </div>

        {/* Display Title */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-white leading-[1.1] font-serif">
          Find the Right <br />
          <span className="text-slate-100">Engineering College</span>
        </h1>

        {/* Subtitle explicitly updating TNEA to JEE Main & JEE Advanced cutoff trends */}
        <p className="text-base sm:text-lg text-slate-200 font-normal leading-relaxed max-w-2xl">
          UniGuide Ai provides data-backed analysis using <strong className="text-white font-bold underline decoration-amber-400 decoration-2">JEE Main & JEE Advanced cutoff trends</strong> to help you discover your ideal academic destination. Trust the numbers, not just the names.
        </p>

        {/* Buttons matching screenshot */}
        <div className="flex flex-wrap items-center gap-4 pt-4">
          <button
            onClick={onPredictClick}
            className="flex items-center gap-2 bg-[#c59e5e] hover:bg-[#b58e4e] text-slate-950 px-7 py-4 rounded-xl font-bold text-sm shadow-xl transition-all duration-150 transform hover:-translate-y-0.5"
          >
            <span>Predict Your College</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={onBrowseClick}
            className="flex items-center gap-2 bg-[#1e293b]/80 hover:bg-[#1e293b] text-white px-7 py-4 rounded-xl font-bold text-sm border border-slate-700 backdrop-blur-md shadow-lg transition-all duration-150"
          >
            <span>Browse All Institutions</span>
          </button>
        </div>
      </div>

      {/* Bottom Metrics Bar matching reference screenshot */}
      <div className="relative z-10 grid grid-cols-3 gap-8 pt-12 border-t border-slate-800/80 max-w-2xl mt-8">
        <div>
          <div className="text-3xl sm:text-4xl font-extrabold text-white font-serif">450+</div>
          <div className="text-xs text-slate-400 font-semibold mt-1">Colleges & IITs/NITs</div>
        </div>
        <div>
          <div className="text-3xl sm:text-4xl font-extrabold text-white font-serif">98%</div>
          <div className="text-xs text-slate-400 font-semibold mt-1">Prediction Accuracy</div>
        </div>
        <div>
          <div className="text-3xl sm:text-4xl font-extrabold text-white font-serif">200k+</div>
          <div className="text-xs text-slate-400 font-semibold mt-1">JEE Cutoffs Analyzed</div>
        </div>
      </div>
    </section>
  );
};
