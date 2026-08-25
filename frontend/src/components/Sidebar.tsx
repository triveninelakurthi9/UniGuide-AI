import React from 'react';
import { 
  GraduationCap, 
  LayoutDashboard, 
  FileText, 
  Settings, 
  Cpu, 
  CheckCircle2, 
  Clock, 
  RefreshCw,
  Layers,
  UploadCloud,
  Lock,
  Calculator,
  Sparkles
} from 'lucide-react';
import { DocumentItem, UserRole } from '../types';

interface SidebarProps {
  activeTab: 'dashboard' | 'predictor' | 'documents' | 'settings' | 'admin-upload';
  setActiveTab: (tab: 'dashboard' | 'predictor' | 'documents' | 'settings' | 'admin-upload') => void;
  documents: DocumentItem[];
  onIngestAll: () => void;
  isIngesting: boolean;
  role: UserRole;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  documents,
  onIngestAll,
  isIngesting,
  role,
}) => {
  const pendingCount = documents.filter((d) => !d.is_ingested).length;
  const ingestedCount = documents.filter((d) => d.is_ingested).length;

  return (
    <aside className="w-72 bg-white border-r border-slate-200 flex flex-col h-screen sticky top-0 select-none z-30 shadow-sm">
      {/* Brand Header */}
      <div className="p-5 border-b border-slate-200 flex items-center gap-3">
        <div className="p-2.5 bg-gradient-to-tr from-brand-600 to-indigo-600 rounded-xl shadow-md shadow-brand-600/20">
          <GraduationCap className="w-5 h-5 text-white" />
        </div>
        <div>
          <div className="flex items-center gap-1.5">
            <h1 className="font-bold text-base text-slate-900 tracking-tight">UniGuide AI</h1>
            <span className="text-[9px] bg-brand-100 text-brand-700 font-bold px-1.5 py-0.5 rounded uppercase tracking-wide border border-brand-200">
              {role === 'admin' ? 'ADMIN' : 'PRO'}
            </span>
          </div>
          <p className="text-[11px] text-slate-500 font-medium">University Information Assistant</p>
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="p-4 space-y-1.5 flex-1">
        <button
          onClick={() => setActiveTab('dashboard')}
          className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-semibold text-xs tracking-wide transition-all duration-150 ${
            activeTab === 'dashboard'
              ? 'bg-brand-50 text-brand-700 border border-brand-200 shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-transparent'
          }`}
        >
          <LayoutDashboard className={`w-4 h-4 ${activeTab === 'dashboard' ? 'text-brand-600' : ''}`} />
          <span>Dashboard & Chat</span>
        </button>

        {/* JEE College Predictor Navigation Item */}
        <button
          onClick={() => setActiveTab('predictor')}
          className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-semibold text-xs tracking-wide transition-all duration-150 ${
            activeTab === 'predictor'
              ? 'bg-gradient-to-r from-brand-600 to-indigo-600 text-white shadow-md shadow-brand-600/20'
              : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100 border border-transparent'
          }`}
        >
          <div className="flex items-center gap-3">
            <Calculator className="w-4 h-4" />
            <span>JEE Predictor Tool</span>
          </div>
          <span className="text-[9px] bg-amber-400 text-slate-950 font-black px-1.5 py-0.5 rounded uppercase tracking-wide">
            HOT
          </span>
        </button>


        <button
          onClick={() => setActiveTab('documents')}
          className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-semibold text-xs tracking-wide transition-all duration-150 ${
            activeTab === 'documents'
              ? 'bg-brand-50 text-brand-700 border border-brand-200 shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-transparent'
          }`}
        >
          <div className="flex items-center gap-3">
            <FileText className={`w-4 h-4 ${activeTab === 'documents' ? 'text-brand-600' : ''}`} />
            <span>Document Repository</span>
          </div>
          {documents.length > 0 && (
            <span className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full font-bold border border-slate-200">
              {documents.length}
            </span>
          )}
        </button>

        {/* Dedicated Admin Upload Navigation Tab */}
        {role === 'admin' && (
          <button
            onClick={() => setActiveTab('admin-upload')}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-semibold text-xs tracking-wide transition-all duration-150 ${
              activeTab === 'admin-upload'
                ? 'bg-gradient-to-r from-brand-600 to-indigo-600 text-white shadow-md shadow-brand-600/20'
                : 'text-amber-800 bg-amber-50 hover:bg-amber-100 border border-amber-200'
            }`}
          >
            <div className="flex items-center gap-3">
              <UploadCloud className="w-4 h-4" />
              <span>Admin Upload Hub</span>
            </div>
            <Lock className="w-3 h-3 opacity-80" />
          </button>
        )}

        <button
          onClick={() => setActiveTab('settings')}
          className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-semibold text-xs tracking-wide transition-all duration-150 ${
            activeTab === 'settings'
              ? 'bg-brand-50 text-brand-700 border border-brand-200 shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-transparent'
          }`}
        >
          <Settings className={`w-4 h-4 ${activeTab === 'settings' ? 'text-brand-600' : ''}`} />
          <span>System Architecture</span>
        </button>
      </nav>

      {/* Vector Store Monitor Panel */}
      <div className="p-4 m-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
            <Cpu className="w-4 h-4 text-brand-600" />
            <span>Vector Index Store</span>
          </div>
          <span className="text-[9px] uppercase font-bold text-brand-700 bg-brand-100 px-2 py-0.5 rounded border border-brand-200">
            ChromaDB
          </span>
        </div>

        <div className="space-y-2 text-xs">
          <div className="flex items-center justify-between text-slate-600">
            <span className="flex items-center gap-1.5 font-medium">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Ingested
            </span>
            <span className="text-emerald-700 font-bold">{ingestedCount} PDFs</span>
          </div>

          <div className="flex items-center justify-between text-slate-600">
            <span className="flex items-center gap-1.5 font-medium">
              <Clock className="w-3.5 h-3.5 text-amber-600" /> Pending Ingest
            </span>
            <span className="text-amber-700 font-bold">{pendingCount} PDFs</span>
          </div>
        </div>

        {role === 'admin' && pendingCount > 0 && (
          <button
            onClick={onIngestAll}
            disabled={isIngesting}
            className="w-full mt-2 flex items-center justify-center gap-2 bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-700 hover:to-indigo-700 text-white font-bold text-xs py-2 px-3 rounded-xl transition shadow-md shadow-brand-600/20 disabled:opacity-50 tracking-wide"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isIngesting ? 'animate-spin' : ''}`} />
            <span>{isIngesting ? 'Processing Embeddings...' : `Ingest ${pendingCount} Pending PDF(s)`}</span>
          </button>
        )}
      </div>

      {/* Footer Info */}
      <div className="p-4 border-t border-slate-200 text-[10px] text-slate-500 flex justify-between items-center font-medium bg-slate-50">
        <div className="flex items-center gap-1.5">
          <Layers className="w-3 h-3 text-brand-600" />
          <span>MongoDB Atlas + ChromaDB</span>
        </div>
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-sm" />
      </div>
    </aside>
  );
};
