import React, { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, AlertTriangle, Search, ShieldCheck, Download, Filter, FileText, X, Mic, MicOff, ExternalLink } from 'lucide-react';
import { ChatMessage as ChatMessageType, DocumentItem, SourceCitation } from '../types';
import { ChatMessage } from './ChatMessage';
import { apiService } from '../services/api';

interface ChatInterfaceProps {
  messages: ChatMessageType[];
  documents?: DocumentItem[];
  onSendMessage: (question: string, documentName?: string) => void;
  isLoading: boolean;
  hasIngestedDocs: boolean;
  onClearChat: () => void;
}

const STARTER_QUESTIONS = [
  'What programs and courses are offered?',
  'What is the eligibility criteria for admission?',
  'What is the fee structure for courses?',
  'What are the polytechnic diploma branches available?',
];

export const ChatInterface: React.FC<ChatInterfaceProps> = ({
  messages,
  documents = [],
  onSendMessage,
  isLoading,
  hasIngestedDocs,
  onClearChat,
}) => {
  const [inputQuestion, setInputQuestion] = useState('');
  const [selectedDoc, setSelectedDoc] = useState<string>('');
  const [activeCitationModal, setActiveCitationModal] = useState<SourceCitation | null>(null);
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleToggleVoiceInput = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Speech Recognition is not supported in your browser.');
      return;
    }

    if (isListening) {
      setIsListening(false);
    } else {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onstart = () => setIsListening(true);
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputQuestion((prev) => (prev ? `${prev} ${transcript}` : transcript));
        setIsListening(false);
      };
      recognition.onerror = () => setIsListening(false);
      recognition.onend = () => setIsListening(false);

      recognition.start();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputQuestion.trim() || isLoading) return;
    onSendMessage(inputQuestion, selectedDoc || undefined);
    setInputQuestion('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleExportChat = () => {
    if (messages.length === 0) return;
    let exportText = `# UniGuide AI — Q&A Session Export\n\nDate: ${new Date().toLocaleString()}\n\n---\n\n`;
    messages.forEach((msg, i) => {
      if (msg.sender === 'user') {
        exportText += `### ❓ Question ${Math.floor(i / 2) + 1}\n**Student**: ${msg.text}\n\n`;
      } else {
        exportText += `### 💡 Answer\n${msg.text}\n\n`;
        if (msg.sources && msg.sources.length > 0) {
          exportText += `**Sources & Citations**:\n`;
          msg.sources.forEach((s) => {
            exportText += `- Document: \`${s.document}\` | Page: ${s.page}\n`;
          });
          exportText += `\n`;
        }
        exportText += `---\n\n`;
      }
    });

    const blob = new Blob([exportText], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `uniguide-chat-export-${Date.now()}.md`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const ingestedDocList = documents.filter((d) => d.is_ingested);

  return (
    <div className="flex flex-col h-full bg-slate-50/50 rounded-2xl border border-slate-200 shadow-sm overflow-hidden relative">
      {/* Executive Chat Header */}
      <div className="px-5 py-3 border-b border-slate-200 bg-white backdrop-blur-md flex flex-wrap items-center justify-between gap-3 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-brand-50 text-brand-600 rounded-xl border border-brand-200 shadow-xs">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h2 className="font-bold text-slate-900 text-sm tracking-tight flex items-center gap-2">
              <span>UniGuide Assistant</span>
              <span className="text-[9px] bg-brand-100 text-brand-700 px-2 py-0.5 rounded-full font-bold border border-brand-200 uppercase">
                RAG Pipeline
              </span>
            </h2>
            <p className="text-[11px] text-slate-500 font-medium">Context-Aware AI Assistant with Page-Level Document Citations</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Target Document Scope Selector */}
          {ingestedDocList.length > 0 && (
            <div className="flex items-center gap-1.5 bg-slate-100 border border-slate-200 rounded-xl px-2.5 py-1 text-xs">
              <Filter className="w-3.5 h-3.5 text-slate-500" />
              <select
                value={selectedDoc}
                onChange={(e) => setSelectedDoc(e.target.value)}
                className="bg-transparent text-xs text-slate-800 font-semibold focus:outline-none cursor-pointer max-w-[150px] truncate"
              >
                <option value="">All Documents ({ingestedDocList.length})</option>
                {ingestedDocList.map((doc) => (
                  <option key={doc.id} value={doc.filename}>
                    {doc.filename}
                  </option>
                ))}
              </select>
            </div>
          )}

          {messages.length > 0 && (
            <>
              <button
                onClick={handleExportChat}
                className="flex items-center gap-1 text-xs font-semibold text-brand-700 hover:bg-brand-50 border border-brand-200 px-2.5 py-1.5 rounded-xl transition shadow-xs"
                title="Export Conversation as Markdown"
              >
                <Download className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Export</span>
              </button>
              <button
                onClick={onClearChat}
                className="text-xs font-semibold text-slate-600 hover:text-slate-900 px-2.5 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-100 transition shadow-xs"
              >
                Clear
              </button>
            </>
          )}
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-5 space-y-4">
        {!hasIngestedDocs && (
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 text-center space-y-2.5 my-6 max-w-lg mx-auto shadow-sm">
            <div className="inline-flex p-2.5 bg-amber-100 text-amber-700 rounded-xl border border-amber-300">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-amber-900 text-sm tracking-tight">No Ingested University Documents</h3>
            <p className="text-xs text-amber-800 leading-relaxed font-medium">
              Please upload a university PDF and click <strong>"Ingest PDF"</strong> to enable RAG answer generation with page citations.
            </p>
          </div>
        )}

        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center space-y-5 my-10">
            <div className="p-3.5 bg-white border border-slate-200 rounded-2xl shadow-sm">
              <Sparkles className="w-8 h-8 text-brand-600 animate-pulse" />
            </div>
            <div className="max-w-md space-y-1.5">
              <h3 className="text-base font-bold text-slate-900 tracking-tight">Ask Anything About Your University</h3>
              <p className="text-xs text-slate-500 leading-relaxed font-medium">
                UniGuide AI queries official university PDF documents and provides precise, hallucination-free answers with exact citations.
              </p>
            </div>

            {/* Starter Suggestion Pills */}
            <div className="w-full max-w-xl space-y-2">
              <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider text-left pl-1">
                Suggested Sample Questions:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-left">
                {STARTER_QUESTIONS.map((q, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      if (hasIngestedDocs && !isLoading) {
                        onSendMessage(q, selectedDoc || undefined);
                      }
                    }}
                    disabled={!hasIngestedDocs || isLoading}
                    className="p-3 bg-white hover:bg-slate-50 border border-slate-200 hover:border-brand-300 rounded-xl text-xs text-slate-700 transition duration-150 text-left space-y-1 group disabled:opacity-50 shadow-xs cursor-pointer"
                  >
                    <div className="flex items-center gap-2 font-semibold text-slate-800 group-hover:text-brand-600">
                      <Search className="w-3.5 h-3.5 text-brand-600 shrink-0" />
                      <span className="line-clamp-2 text-xs">{q}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          messages.map((msg) => (
            <ChatMessage
              key={msg.id}
              message={msg}
              onSelectCitation={(citation) => setActiveCitationModal(citation)}
            />
          ))
        )}

        {/* Loading Indicator */}
        {isLoading && (
          <div className="flex items-center gap-3 p-3.5 bg-white border border-slate-200 rounded-xl w-fit shadow-xs animate-pulse">
            <Sparkles className="w-4 h-4 text-brand-600 animate-spin" />
            <span className="text-xs text-slate-700 font-semibold">Searching vectors & generating exact answer...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Live PDF Interactive Viewer Modal */}
      {activeCitationModal && (
        <div className="absolute inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white border border-slate-200 rounded-2xl p-5 max-w-3xl w-full h-[80vh] shadow-2xl flex flex-col space-y-3">
            <div className="flex items-center justify-between border-b pb-3 shrink-0">
              <div className="flex items-center gap-2 text-brand-700 font-bold text-sm">
                <FileText className="w-4 h-4" />
                <span>Source Citation PDF Viewer — {activeCitationModal.document} (Page {activeCitationModal.page})</span>
              </div>
              <div className="flex items-center gap-2">
                <a
                  href={apiService.getPDFUrl(activeCitationModal.document)}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1 text-xs font-semibold text-brand-600 hover:text-brand-800 bg-brand-50 px-2.5 py-1 rounded-lg border border-brand-200"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Open Full PDF</span>
                </a>
                <button
                  onClick={() => setActiveCitationModal(null)}
                  className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Embedded Live PDF Frame */}
            <div className="flex-1 bg-slate-100 rounded-xl overflow-hidden border border-slate-200">
              <iframe
                src={`${apiService.getPDFUrl(activeCitationModal.document)}#page=${activeCitationModal.page}`}
                className="w-full h-full border-none"
                title="Live PDF Viewer"
              />
            </div>
          </div>
        </div>
      )}

      {/* Input Box */}
      <div className="p-4 border-t border-slate-200 bg-white backdrop-blur-md">
        <form onSubmit={handleSubmit} className="flex gap-3 items-end">
          <div className="flex-1 bg-slate-50 border border-slate-200 focus-within:border-brand-500 rounded-2xl px-3.5 py-2.5 transition shadow-inner">
            <textarea
              rows={2}
              value={inputQuestion}
              onChange={(e) => setInputQuestion(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={
                isListening
                  ? 'Listening to speech...'
                  : hasIngestedDocs
                  ? selectedDoc
                    ? `Ask question scoped to ${selectedDoc}...`
                    : 'Ask any question about university courses, eligibility, fees, syllabus...'
                  : 'Upload and ingest a university document first...'
              }
              disabled={!hasIngestedDocs || isLoading}
              className="w-full bg-transparent text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none resize-none disabled:opacity-50 font-medium"
            />
          </div>

          {/* Voice Microphone Input Button */}
          <button
            type="button"
            onClick={handleToggleVoiceInput}
            disabled={!hasIngestedDocs || isLoading}
            className={`p-3.5 rounded-2xl transition border cursor-pointer shrink-0 ${
              isListening
                ? 'bg-red-50 text-red-600 border-red-300 animate-pulse'
                : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200'
            }`}
            title={isListening ? 'Stop Voice Listening' : 'Voice Input (Speech-to-Text)'}
          >
            {isListening ? <MicOff className="w-4 h-4 text-red-600" /> : <Mic className="w-4 h-4 text-slate-600" />}
          </button>

          <button
            type="submit"
            disabled={!inputQuestion.trim() || !hasIngestedDocs || isLoading}
            className="p-3.5 bg-gradient-to-tr from-brand-600 to-indigo-600 hover:from-brand-700 hover:to-indigo-700 disabled:opacity-40 text-white rounded-2xl transition shadow-md shadow-brand-600/20 shrink-0 cursor-pointer"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
        <div className="flex items-center justify-center gap-1.5 text-[10px] text-slate-500 mt-2 font-semibold">
          <ShieldCheck className="w-3 h-3 text-brand-600" />
          <span>Strict page-level PDF source citations. Zero hallucination guarantee.</span>
        </div>
      </div>
    </div>
  );
};
