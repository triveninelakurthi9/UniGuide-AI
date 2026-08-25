import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { User, AlertCircle, Copy, Check, Zap, Sparkles, ThumbsUp, ThumbsDown, Volume2, Square } from 'lucide-react';
import { ChatMessage as ChatMessageType, SourceCitation } from '../types';
import { CitationCard } from './CitationCard';

interface ChatMessageProps {
  message: ChatMessageType;
  onSelectCitation?: (citation: SourceCitation) => void;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message, onSelectCitation }) => {
  const isUser = message.sender === 'user';
  const [copied, setCopied] = useState(false);
  const [feedback, setFeedback] = useState<'like' | 'dislike' | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(message.text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleToggleSpeech = () => {
    if (!('speechSynthesis' in window)) {
      alert('Speech Synthesis is not supported in this browser.');
      return;
    }

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    } else {
      window.speechSynthesis.cancel();
      const cleanText = message.text.replace(/[*#_`~]/g, '');
      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.rate = 1.0;
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
      setIsSpeaking(true);
    }
  };

  return (
    <div className={`flex gap-3 py-3 ${isUser ? 'justify-end' : 'justify-start'}`}>
      {!isUser && (
        <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-600 flex items-center justify-center shadow-md shadow-brand-600/20 shrink-0 mt-0.5 ring-1 ring-black/5">
          <Sparkles className="w-4 h-4 text-white" />
        </div>
      )}

      <div
        className={`max-w-[85%] min-w-[200px] rounded-2xl p-4 shadow-sm transition-all duration-150 break-words ${
          isUser
            ? 'bg-gradient-to-r from-brand-600 to-indigo-600 text-white rounded-tr-none shadow-brand-600/15 ml-auto'
            : message.isError
            ? 'bg-red-50 border border-red-200 text-red-800 rounded-tl-none'
            : 'bg-white border border-slate-200 text-slate-800 rounded-tl-none glass-card'
        }`}
      >
        {/* Message Header */}
        <div className={`flex items-center justify-between gap-3 mb-2 pb-1.5 border-b text-xs ${isUser ? 'border-white/20' : 'border-slate-200'}`}>
          <div className="flex items-center gap-2">
            <span className={`font-bold ${isUser ? 'text-white' : 'text-slate-900'}`}>
              {isUser ? 'Student' : 'UniGuide AI Assistant'}
            </span>
            {!isUser && message.document_name && (
              <span className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full font-medium border border-slate-200">
                {message.document_name}
              </span>
            )}
            {!isUser && message.execution_time_ms && (
              <span className="inline-flex items-center gap-1 text-[10px] text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 font-mono font-bold">
                <Zap className="w-3 h-3 text-emerald-600" />
                {(message.execution_time_ms / 1000).toFixed(2)}s
              </span>
            )}
            {!isUser && message.confidence_label && (
              <span className={`inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full border font-mono font-bold ${
                message.confidence_label === 'High Confidence'
                  ? 'text-emerald-800 bg-emerald-50 border-emerald-300'
                  : message.confidence_label === 'Medium Confidence'
                  ? 'text-amber-800 bg-amber-50 border-amber-300'
                  : 'text-slate-700 bg-slate-100 border-slate-300'
              }`}>
                <Sparkles className="w-3 h-3 text-indigo-500" />
                {message.confidence_score ? `${Math.round(message.confidence_score * 100)}% ` : ''}{message.confidence_label}
              </span>
            )}
          </div>

          <div className="flex items-center gap-1.5">
            <span className={`text-[10px] font-mono ${isUser ? 'text-white/80' : 'text-slate-500'}`}>{message.timestamp}</span>
            {!isUser && (
              <div className="flex items-center gap-1 ml-1 border-l pl-1.5 border-slate-200">
                <button
                  onClick={() => setFeedback(feedback === 'like' ? null : 'like')}
                  className={`p-1 rounded hover:bg-slate-100 transition ${feedback === 'like' ? 'text-brand-600 font-bold' : 'text-slate-400 hover:text-slate-600'}`}
                  title="Helpful Answer"
                >
                  <ThumbsUp className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setFeedback(feedback === 'dislike' ? null : 'dislike')}
                  className={`p-1 rounded hover:bg-slate-100 transition ${feedback === 'dislike' ? 'text-red-500 font-bold' : 'text-slate-400 hover:text-slate-600'}`}
                  title="Needs Improvement"
                >
                  <ThumbsDown className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={handleToggleSpeech}
                  className={`p-1 rounded transition ${isSpeaking ? 'text-brand-600 bg-brand-50 animate-pulse' : 'text-slate-400 hover:text-slate-900 hover:bg-slate-100'}`}
                  title={isSpeaking ? "Stop Narration" : "Listen Answer"}
                >
                  {isSpeaking ? <Square className="w-3.5 h-3.5 fill-current text-brand-600" /> : <Volume2 className="w-3.5 h-3.5" />}
                </button>
                <button
                  onClick={handleCopy}
                  className="p-1 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded transition"
                  title="Copy Answer"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            )}
          </div>
        </div>

        {message.isError && (
          <div className="flex items-center gap-2 mb-2 text-red-600 font-bold text-xs">
            <AlertCircle className="w-4 h-4" />
            <span>Processing Alert</span>
          </div>
        )}

        {/* Markdown Answer Render */}
        <div className={`prose prose-sm max-w-none leading-relaxed text-xs sm:text-sm font-normal ${isUser ? 'prose-invert text-white' : 'text-slate-800'}`}>
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {message.text}
          </ReactMarkdown>
        </div>

        {/* Source Citations */}
        {!isUser && message.sources && message.sources.length > 0 && (
          <CitationCard sources={message.sources} onSelectCitation={onSelectCitation} />
        )}
      </div>

      {isUser && (
        <div className="w-8 h-8 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center shrink-0 mt-0.5 text-slate-700 shadow-sm">
          <User className="w-4 h-4" />
        </div>
      )}
    </div>
  );
};
