import React from 'react';
import { 
  FileText, 
  Database, 
  Cpu, 
  CheckCircle2, 
  TrendingUp
} from 'lucide-react';
import { DocumentItem, ChatMessage, UserRole } from '../types';
import { DocumentManager } from '../components/DocumentManager';
import { ChatInterface } from '../components/ChatInterface';

interface DashboardProps {
  documents: DocumentItem[];
  messages: ChatMessage[];
  onUpload: (file: File) => Promise<void>;
  onIngest: (documentId?: number) => Promise<void>;
  onDelete: (documentId: number) => Promise<void>;
  onSendMessage: (question: string, documentName?: string) => void;
  onClearChat: () => void;
  isUploading: boolean;
  isIngesting: boolean;
  isChatLoading: boolean;
  role?: UserRole;
}

export const Dashboard: React.FC<DashboardProps> = ({
  documents,
  messages,
  onUpload,
  onIngest,
  onDelete,
  onSendMessage,
  onClearChat,
  isUploading,
  isIngesting,
  isChatLoading,
  role = 'student',
}) => {

  const totalDocs = documents.length;
  const ingestedDocs = documents.filter((d) => d.is_ingested).length;
  const totalPages = documents.reduce((acc, d) => acc + (d.total_pages || 0), 0);
  const totalChunks = documents.reduce((acc, d) => acc + (d.total_chunks || 0), 0);

  return (
    <div className="space-y-5 flex-1 flex flex-col min-h-0">
      {/* Top Executive Stats Overview Widgets */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 shrink-0">
        <div className="p-4 bg-white border border-slate-200 rounded-2xl glass-card flex items-center justify-between shadow-sm">
          <div>
            <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Knowledge Documents</p>
            <h3 className="text-2xl font-black text-slate-900 mt-1 tracking-tight">{totalDocs}</h3>
            <p className="text-[10px] text-brand-600 mt-0.5 font-bold flex items-center gap-1">
              <TrendingUp className="w-3 h-3" /> PDF Repositories
            </p>
          </div>
          <div className="p-3 bg-brand-50 text-brand-600 rounded-xl border border-brand-200 shadow-sm">
            <FileText className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 bg-white border border-slate-200 rounded-2xl glass-card flex items-center justify-between shadow-sm">
          <div>
            <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Indexed Vectors</p>
            <h3 className="text-2xl font-black text-emerald-600 mt-1 tracking-tight">{ingestedDocs} / {totalDocs}</h3>
            <p className="text-[10px] text-emerald-600 mt-0.5 font-bold flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" /> Vector Search Ready
            </p>
          </div>
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl border border-emerald-200 shadow-sm">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 bg-white border border-slate-200 rounded-2xl glass-card flex items-center justify-between shadow-sm">
          <div>
            <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Extracted Pages</p>
            <h3 className="text-2xl font-black text-slate-800 mt-1 tracking-tight">{totalPages}</h3>
            <p className="text-[10px] text-slate-500 mt-0.5 font-bold flex items-center gap-1">
              <Database className="w-3 h-3" /> PyMuPDF + EasyOCR
            </p>
          </div>
          <div className="p-3 bg-slate-100 text-slate-700 rounded-xl border border-slate-200 shadow-sm">
            <Database className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 bg-white border border-slate-200 rounded-2xl glass-card flex items-center justify-between shadow-sm">
          <div>
            <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">ChromaDB Chunks</p>
            <h3 className="text-2xl font-black text-slate-800 mt-1 tracking-tight">{totalChunks}</h3>
            <p className="text-[10px] text-slate-500 mt-0.5 font-bold flex items-center gap-1">
              <Cpu className="w-3 h-3" /> Dense Embeddings
            </p>
          </div>
          <div className="p-3 bg-slate-100 text-slate-700 rounded-xl border border-slate-200 shadow-sm">
            <Cpu className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Main Split Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 flex-1 min-h-0">
        <div className="lg:col-span-6 xl:col-span-5 overflow-y-auto pr-1 space-y-5 h-full">
          <DocumentManager
            documents={documents}
            onUpload={onUpload}
            onIngest={onIngest}
            onDelete={onDelete}
            isUploading={isUploading}
            isIngesting={isIngesting}
            role={role}
          />

        </div>

        <div className="lg:col-span-6 xl:col-span-7 h-full">
          <ChatInterface
            messages={messages}
            documents={documents}
            onSendMessage={onSendMessage}
            isLoading={isChatLoading}
            hasIngestedDocs={ingestedDocs > 0}
            onClearChat={onClearChat}
          />
        </div>
      </div>
    </div>
  );
};
