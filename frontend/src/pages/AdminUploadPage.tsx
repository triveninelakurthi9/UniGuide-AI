import React, { useState } from 'react';
import { 
  ShieldCheck, 
  UploadCloud, 
  Database, 
  RefreshCw, 
  FileText, 
  Trash2, 
  CheckCircle2, 
  Clock, 
  Search, 
  FileCheck,
  Cpu,
  Layers,
  Sparkles
} from 'lucide-react';
import { DocumentItem } from '../types';

interface AdminUploadPageProps {
  documents: DocumentItem[];
  onUpload: (file: File) => Promise<void>;
  onIngest: (documentId?: number) => Promise<void>;
  onDelete: (documentId: number) => Promise<void>;
  isUploading: boolean;
  isIngesting: boolean;
}

export const AdminUploadPage: React.FC<AdminUploadPageProps> = ({
  documents,
  onUpload,
  onIngest,
  onDelete,
  isUploading,
  isIngesting,
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) return;
    await onUpload(selectedFile);
    setSelectedFile(null);
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const filteredDocuments = documents.filter((doc) =>
    doc.filename.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const pendingCount = documents.filter((d) => !d.is_ingested).length;
  const ingestedCount = documents.filter((d) => d.is_ingested).length;
  const totalPages = documents.reduce((acc, d) => acc + (d.total_pages || 0), 0);
  const totalChunks = documents.reduce((acc, d) => acc + (d.total_chunks || 0), 0);

  return (
    <div className="space-y-6">
      {/* Admin Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-slate-800 text-white rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="p-2 bg-indigo-600/30 text-indigo-400 border border-indigo-500/30 rounded-xl">
                <ShieldCheck className="w-5 h-5" />
              </span>
              <h1 className="text-xl font-extrabold tracking-tight">Admin PDF Management & Ingestion Hub</h1>
              <span className="text-[10px] bg-amber-500/20 text-amber-300 px-2.5 py-0.5 rounded-full border border-amber-400/30 font-bold uppercase tracking-wider">
                Admin Privilege Active
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-2 max-w-2xl font-normal leading-relaxed">
              Upload university PDF documents, manage metadata stored in MongoDB Atlas, and ingest vector embeddings into ChromaDB for instant student retrieval.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-slate-800/80 border border-slate-700/80 px-4 py-2.5 rounded-xl text-center">
              <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">Metadata Store</span>
              <span className="text-xs font-extrabold text-emerald-400 flex items-center gap-1.5 justify-center mt-0.5">
                <Database className="w-3.5 h-3.5" /> MongoDB Atlas
              </span>
            </div>

            <div className="bg-slate-800/80 border border-slate-700/80 px-4 py-2.5 rounded-xl text-center">
              <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">Vector Engine</span>
              <span className="text-xs font-extrabold text-brand-400 flex items-center gap-1.5 justify-center mt-0.5">
                <Cpu className="w-3.5 h-3.5" /> ChromaDB
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Analytics Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs">
          <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Total PDFs</span>
          <span className="text-xl font-extrabold text-slate-900 mt-1 block">{documents.length}</span>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs">
          <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Indexed Files</span>
          <span className="text-xl font-extrabold text-emerald-600 mt-1 block">{ingestedCount}</span>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs">
          <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Extracted Pages</span>
          <span className="text-xl font-extrabold text-brand-600 mt-1 block">{totalPages}</span>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs">
          <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Vector Chunks</span>
          <span className="text-xl font-extrabold text-indigo-600 mt-1 block">{totalChunks}</span>
        </div>
      </div>

      {/* PDF Upload Card */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2 tracking-tight">
              <UploadCloud className="w-5 h-5 text-brand-600" />
              <span>Upload Official University PDF</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Admin Upload Form: Upload official university circulars, fee structures, guidelines, or exam routines.
            </p>
          </div>
          <span className="text-[10px] bg-brand-50 text-brand-700 px-3 py-1 rounded-full font-bold border border-brand-200">
            PDF Format Only
          </span>
        </div>

        <form onSubmit={handleUploadSubmit} className="space-y-4">
          <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-slate-300 hover:border-brand-500 rounded-2xl cursor-pointer bg-slate-50 hover:bg-brand-50/20 transition duration-200 group relative">
            <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center px-4">
              <div className="p-3 bg-brand-50 text-brand-600 rounded-2xl group-hover:scale-110 transition duration-200 mb-2 border border-brand-200 shadow-sm">
                <UploadCloud className="w-6 h-6" />
              </div>
              <p className="text-xs text-slate-800 font-semibold">
                {selectedFile ? (
                  <span className="text-brand-700 font-bold text-sm">{selectedFile.name} ({formatBytes(selectedFile.size)})</span>
                ) : (
                  <span><strong className="text-brand-600 font-bold">Click to browse</strong> or drag & drop university PDF document here</span>
                )}
              </p>
              <p className="text-[11px] text-slate-400 mt-1 font-medium">Automatic page-by-page PyMuPDF extraction & MongoDB registration</p>
            </div>
            <input
              type="file"
              accept=".pdf,application/pdf"
              onChange={handleFileChange}
              className="hidden"
            />
          </label>

          {selectedFile && (
            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setSelectedFile(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-xs font-semibold text-slate-700 rounded-xl transition border border-slate-200"
              >
                Cancel Selection
              </button>
              <button
                type="submit"
                disabled={isUploading}
                className="px-5 py-2 bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-700 hover:to-indigo-700 text-xs font-bold text-white rounded-xl shadow-md shadow-brand-600/20 transition flex items-center gap-2 disabled:opacity-50 tracking-wide"
              >
                {isUploading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin text-white" />
                    <span>Uploading Document...</span>
                  </>
                ) : (
                  <>
                    <FileCheck className="w-4 h-4" />
                    <span>Confirm & Store in MongoDB</span>
                  </>
                )}
              </button>
            </div>
          )}
        </form>
      </div>

      {/* Admin Repository Management Table */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 tracking-tight">
              <Database className="w-5 h-5 text-brand-600" />
              <span>MongoDB Document Metadata & Ingestion Control</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Administrators can view all documents, trigger batch vector chunking, or purge files.
            </p>
          </div>

          {pendingCount > 0 && (
            <button
              onClick={() => onIngest()}
              disabled={isIngesting}
              className="px-4 py-2 bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-700 hover:to-indigo-700 text-white text-xs font-bold rounded-xl shadow-md shadow-brand-600/20 transition flex items-center gap-2 disabled:opacity-50 shrink-0 tracking-wide"
            >
              <RefreshCw className={`w-4 h-4 ${isIngesting ? 'animate-spin' : ''}`} />
              <span>{isIngesting ? 'Ingesting Vectors...' : `Ingest ${pendingCount} Pending PDF(s)`}</span>
            </button>
          )}
        </div>

        {/* Search Filter */}
        {documents.length > 0 && (
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search repository files..."
              className="w-full bg-slate-50 border border-slate-200 focus:border-brand-500 rounded-xl pl-10 pr-4 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none transition font-medium"
            />
          </div>
        )}

        {/* Document Table */}
        {filteredDocuments.length === 0 ? (
          <div className="text-center py-10 border border-slate-200 rounded-2xl bg-slate-50">
            <FileText className="w-10 h-10 text-slate-400 mx-auto mb-2" />
            <p className="text-xs text-slate-500 font-medium">
              {documents.length === 0 ? 'No documents uploaded yet.' : 'No matching documents found.'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-slate-200">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 font-bold bg-slate-50 uppercase text-[10px] tracking-wider">
                  <th className="py-3 px-4">Filename</th>
                  <th className="py-3 px-4">Size</th>
                  <th className="py-3 px-4">Ingestion Status</th>
                  <th className="py-3 px-4">Extracted Details</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {filteredDocuments.map((doc) => (
                  <tr key={doc.id} className="hover:bg-slate-50 transition duration-150">
                    <td className="py-3.5 px-4 font-semibold text-slate-900">
                      <div className="flex items-center gap-2.5">
                        <div className="p-1.5 bg-brand-50 text-brand-600 rounded-lg border border-brand-200 shrink-0">
                          <FileText className="w-4 h-4" />
                        </div>
                        <span className="font-semibold text-slate-900">{doc.filename}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-500 font-mono text-[11px]">{formatBytes(doc.file_size)}</td>
                    <td className="py-3.5 px-4">
                      {doc.is_ingested ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> ChromaDB Indexed
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                          <Clock className="w-3.5 h-3.5 text-amber-600" /> Pending Ingest
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-slate-700">
                      {doc.is_ingested ? (
                        <div className="flex items-center gap-2 text-[10px] font-mono">
                          <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded border border-slate-200">{doc.total_pages} Pages</span>
                          <span className="bg-brand-50 text-brand-700 px-2 py-0.5 rounded border border-brand-200">{doc.total_chunks} Chunks</span>
                        </div>
                      ) : (
                        <span className="text-slate-400 italic text-[11px]">Unprocessed</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-right space-x-2">
                      {!doc.is_ingested && (
                        <button
                          onClick={() => onIngest(doc.id)}
                          disabled={isIngesting}
                          className="px-3 py-1 bg-brand-50 hover:bg-brand-100 text-brand-700 border border-brand-200 rounded-lg text-xs font-bold transition"
                        >
                          Ingest Vector
                        </button>
                      )}
                      <button
                        onClick={() => onDelete(doc.id)}
                        className="px-2.5 py-1 text-red-600 hover:bg-red-50 border border-red-200 rounded-lg text-xs font-bold transition inline-flex items-center gap-1"
                        title="Delete Document and Remove Embeddings"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Delete</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
