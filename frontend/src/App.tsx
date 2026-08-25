import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { PredictorPage } from './pages/PredictorPage';
import { Dashboard } from './pages/Dashboard';
import { DocumentManager } from './components/DocumentManager';
import { AdminUploadPage } from './pages/AdminUploadPage';
import { SettingsPage } from './pages/SettingsPage';
import { ChatInterface } from './components/ChatInterface';
import { DocumentItem, ChatMessage, UserRole } from './types';
import { apiService } from './services/api';
import { Bot, MessageSquare, X, Sparkles } from 'lucide-react';

export const App: React.FC = () => {
  const [role, setRole] = useState<UserRole>('student');
  const [activeTab, setActiveTab] = useState<'home' | 'predictor' | 'choice-filler' | 'scholarships' | 'alternate' | 'documents' | 'admin'>('predictor');
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [isIngesting, setIsIngesting] = useState<boolean>(false);
  const [isChatLoading, setIsChatLoading] = useState<boolean>(false);
  const [isChatDrawerOpen, setIsChatDrawerOpen] = useState<boolean>(false);

  // Load document list from MongoDB Atlas metadata backend on mount
  const fetchDocuments = async () => {
    try {
      const data = await apiService.getDocuments();
      setDocuments(data.documents);
    } catch (error) {
      console.error('Failed to fetch document catalog:', error);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  // Handle PDF upload
  const handleUpload = async (file: File) => {
    setIsUploading(true);
    try {
      await apiService.uploadDocument(file);
      await fetchDocuments();
      alert(`Success! File '${file.name}' stored in MongoDB Atlas document repository.`);
    } catch (error: any) {
      alert(`Upload failed: ${error.response?.data?.detail || error.message}`);
    } finally {
      setIsUploading(false);
    }
  };

  // Handle document ingestion into ChromaDB
  const handleIngest = async (documentId?: number) => {
    setIsIngesting(true);
    try {
      const res = await apiService.ingestDocuments(documentId);
      alert(`Ingestion complete! ${res.message} (${res.total_chunks} chunks indexed in ChromaDB)`);
      await fetchDocuments();
    } catch (error: any) {
      alert(`Ingestion failed: ${error.response?.data?.detail || error.message}`);
    } finally {
      setIsIngesting(false);
    }
  };

  // Handle document deletion
  const handleDelete = async (documentId: number) => {
    if (!window.confirm('Are you sure you want to delete this document and its vector embeddings?')) return;

    try {
      await apiService.deleteDocument(documentId);
      await fetchDocuments();
    } catch (error: any) {
      alert(`Deletion failed: ${error.response?.data?.detail || error.message}`);
    }
  };

  // Handle chat submission with document scope
  const handleSendMessage = async (question: string, documentName?: string) => {
    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: question,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsChatLoading(true);

    const conversationHistory = messages.slice(-6).map((m) => ({
      role: m.sender,
      content: m.text,
    }));

    try {
      const res = await apiService.askQuestion(question, documentName, conversationHistory);
      const assistantMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'assistant',
        text: res.answer,
        sources: res.sources,
        execution_time_ms: res.execution_time_ms,
        confidence_score: res.confidence_score,
        confidence_label: res.confidence_label,
        document_name: documentName,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, assistantMsg]);
    } catch (error: any) {
      const errorMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'assistant',
        text: `Error fetching answer: ${error.response?.data?.detail || error.message}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isError: true,
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsChatLoading(false);
    }
  };

  const handleAskInChatFromPredictor = (question: string) => {
    setIsChatDrawerOpen(true);
    handleSendMessage(question);
  };

  const ingestedCount = documents.filter((d) => d.is_ingested).length;

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      {/* 1. Header Navigation Bar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        role={role}
        setRole={setRole}
        onOpenChat={() => setIsChatDrawerOpen(true)}
      />

      {/* 2. Main Page Content */}
      <main className="flex-1 py-8 px-4 sm:px-6">
        {(activeTab === 'home' || activeTab === 'predictor' || activeTab === 'choice-filler') && (
          <PredictorPage
            onAskInChat={handleAskInChatFromPredictor}
            onBrowseAllClick={() => setActiveTab('scholarships')}
          />
        )}

        {(activeTab === 'scholarships' || activeTab === 'documents') && (
          <div className="max-w-7xl mx-auto space-y-6">
            <Dashboard
              documents={documents}
              messages={messages}
              onUpload={handleUpload}
              onIngest={handleIngest}
              onDelete={handleDelete}
              onSendMessage={handleSendMessage}
              onClearChat={() => setMessages([])}
              isUploading={isUploading}
              isIngesting={isIngesting}
              isChatLoading={isChatLoading}
              role={role}
            />
          </div>
        )}

        {activeTab === 'admin' && (
          <div className="max-w-7xl mx-auto">
            <AdminUploadPage
              documents={documents}
              onUpload={handleUpload}
              onIngest={handleIngest}
              onDelete={handleDelete}
              isUploading={isUploading}
              isIngesting={isIngesting}
            />
          </div>
        )}

        {activeTab === 'alternate' && <SettingsPage />}
      </main>

      {/* 3. Floating Action AI Assistant Button (Purple button matching reference screenshot) */}
      <button
        onClick={() => setIsChatDrawerOpen((prev) => !prev)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-[#4f46e5] hover:bg-[#4338ca] text-white shadow-2xl flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95 group border-2 border-white"
        title="Open UniGuide AI Assistant"
      >
        <Sparkles className="w-6 h-6 text-white group-hover:rotate-12 transition-transform" />
        <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-emerald-400 rounded-full border-2 border-white" />
      </button>

      {/* 4. Slide-Over AI Chat Drawer */}
      {isChatDrawerOpen && (
        <div className="fixed inset-y-0 right-0 z-50 w-full max-w-lg bg-white shadow-2xl border-l border-slate-200 flex flex-col animate-in slide-in-from-right duration-200">
          {/* Drawer Header */}
          <div className="p-4 bg-[#1e3a8a] text-white flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bot className="w-5 h-5 text-cyan-300" />
              <h3 className="font-bold text-sm tracking-tight">UniGuide AI Assistant</h3>
            </div>
            <button
              onClick={() => setIsChatDrawerOpen(false)}
              className="p-1 text-white/80 hover:text-white bg-white/10 rounded-lg transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Drawer Chat Body */}
          <div className="flex-1 p-4 overflow-hidden flex flex-col bg-slate-50">
            <ChatInterface
              messages={messages}
              documents={documents}
              onSendMessage={handleSendMessage}
              isLoading={isChatLoading}
              hasIngestedDocs={ingestedCount > 0}
              onClearChat={() => setMessages([])}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
