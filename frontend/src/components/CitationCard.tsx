import React from 'react';
import { FileText, Bookmark } from 'lucide-react';
import { SourceCitation } from '../types';

interface CitationCardProps {
  sources: SourceCitation[];
  onSelectCitation?: (citation: SourceCitation) => void;
}

export const CitationCard: React.FC<CitationCardProps> = ({ sources, onSelectCitation }) => {
  if (!sources || sources.length === 0) return null;

  return (
    <div className="mt-4 pt-3.5 border-t border-slate-200">
      <div className="flex items-center gap-2 text-xs font-bold text-brand-700 mb-2">
        <Bookmark className="w-3.5 h-3.5 text-brand-600" />
        <span>Official Knowledge Citations ({sources.length}):</span>
      </div>

      <div className="flex flex-wrap gap-2">
        {sources.map((src, index) => (
          <button
            key={`${src.document}-${src.page}-${index}`}
            onClick={() => onSelectCitation && onSelectCitation(src)}
            className="flex items-center gap-2 bg-white hover:bg-brand-50/50 border border-slate-200 hover:border-brand-400 px-3 py-1.5 rounded-xl text-xs transition duration-150 group shadow-sm text-left cursor-pointer active:scale-95"
          >
            <FileText className="w-3.5 h-3.5 text-slate-500 group-hover:text-brand-600 transition" />
            <span className="text-slate-800 font-semibold truncate max-w-[200px]" title={src.document}>
              {src.document}
            </span>
            <span className="bg-brand-100/70 text-brand-700 font-bold px-2 py-0.5 rounded text-[10px] border border-brand-200">
              Page {src.page}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};
