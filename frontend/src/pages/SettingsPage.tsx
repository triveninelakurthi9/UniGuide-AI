import React from 'react';
import { Settings, Cpu, ShieldCheck, Database, Server, CheckCircle2 } from 'lucide-react';

export const SettingsPage: React.FC = () => {
  return (
    <div className="space-y-5 max-w-4xl">
      <div className="bg-white border border-slate-200 rounded-2xl p-6 glass-card shadow-xs space-y-6">
        <div className="border-b border-slate-200 pb-4 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2.5 tracking-tight">
              <Settings className="w-5 h-5 text-brand-600" />
              <span>UniGuide AI Architecture Configuration</span>
            </h2>
            <p className="text-xs text-slate-500 mt-1 font-medium">
              Overview of configured RAG system pipeline components, dense vector storage, and zero-hallucination guardrails.
            </p>
          </div>
          <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full flex items-center gap-1.5 shadow-xs">
            <CheckCircle2 className="w-3.5 h-3.5" /> Engine Online
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="p-4.5 bg-slate-50 border border-slate-200 rounded-xl space-y-2 shadow-xs hover:border-brand-300 transition">
            <div className="flex items-center gap-2 text-brand-700 font-bold text-xs uppercase tracking-wider">
              <Cpu className="w-4 h-4" />
              <span>Embedding Engine</span>
            </div>
            <p className="text-slate-900 font-mono text-xs bg-white px-2.5 py-1 rounded border border-slate-200 w-fit font-semibold">
              sentence-transformers/all-MiniLM-L6-v2
            </p>
            <p className="text-slate-600 leading-relaxed font-medium">
              384-dimensional dense vectors fine-tuned for high-speed semantic similarity retrieval and cosine distance matching.
            </p>
          </div>

          <div className="p-4.5 bg-slate-50 border border-slate-200 rounded-xl space-y-2 shadow-xs hover:border-brand-300 transition">
            <div className="flex items-center gap-2 text-brand-700 font-bold text-xs uppercase tracking-wider">
              <Database className="w-4 h-4" />
              <span>Vector Database & Metadata Store</span>
            </div>
            <p className="text-slate-900 font-mono text-xs bg-white px-2.5 py-1 rounded border border-slate-200 w-fit font-semibold">
              ChromaDB (Vector Store) + MongoDB Atlas (Metadata Store)
            </p>
            <p className="text-slate-600 leading-relaxed font-medium">
              Persistent vector embeddings in <code className="text-brand-700 font-bold">ChromaDB</code> and document metadata in <code className="text-brand-700 font-bold">MongoDB Atlas Database</code>.
            </p>

          </div>

          <div className="p-4.5 bg-slate-50 border border-slate-200 rounded-xl space-y-2 shadow-xs hover:border-brand-300 transition">
            <div className="flex items-center gap-2 text-brand-700 font-bold text-xs uppercase tracking-wider">
              <Server className="w-4 h-4" />
              <span>Synthesis & LLM Engine</span>
            </div>
            <p className="text-slate-900 font-mono text-xs bg-white px-2.5 py-1 rounded border border-slate-200 w-fit font-semibold">
              Google Gemini API (gemini-1.5-flash) / Direct Fact Extraction Engine
            </p>
            <p className="text-slate-600 leading-relaxed font-medium">
              Temperature = 0.0 for strict deterministic context adherence and 100% zero-hallucination execution.
            </p>
          </div>

          <div className="p-4.5 bg-slate-50 border border-slate-200 rounded-xl space-y-2 shadow-xs hover:border-emerald-300 transition">
            <div className="flex items-center gap-2 text-emerald-700 font-bold text-xs uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4" />
              <span>Chunking & Lineage Parameters</span>
            </div>
            <p className="text-slate-900 font-mono text-xs bg-white px-2.5 py-1 rounded border border-slate-200 w-fit font-semibold">
              Chunk Size: 1000 chars | Overlap: 200 chars
            </p>
            <p className="text-slate-600 leading-relaxed font-medium">
              Preserves original PDF page numbers and document title lineage on every chunk for exact citation tracing.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
