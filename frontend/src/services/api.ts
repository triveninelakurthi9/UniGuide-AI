import axios from 'axios';
import { DocumentListResponse, DocumentItem, IngestResponse, SourceCitation, SystemStats, PredictorRequest, PredictorResponse } from '../types';

const getBaseUrl = () => {
  const envUrl = import.meta.env.VITE_API_BASE_URL;
  if (!envUrl) {
    if (typeof window !== 'undefined' && window.location && window.location.origin) {
      return `${window.location.origin}/api/v1`;
    }
    return 'http://localhost:8000/api/v1';
  }
  const cleanUrl = envUrl.replace(/\/+$/, '');
  return cleanUrl.endsWith('/api/v1') ? cleanUrl : `${cleanUrl}/api/v1`;
};

const API_BASE_URL = getBaseUrl();

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const apiService = {
  // Get aggregate system stats
  async getSystemStats(): Promise<SystemStats> {
    const response = await apiClient.get<SystemStats>('/documents/stats');
    return response.data;
  },

  // Get all documents
  async getDocuments(): Promise<DocumentListResponse> {
    const response = await apiClient.get<DocumentListResponse>('/documents');
    return response.data;
  },

  // Upload PDF document (Admin privilege required)
  async uploadDocument(file: File): Promise<DocumentItem> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await apiClient.post<DocumentItem>('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'X-Admin-Role': 'admin',
      },
    });
    return response.data;
  },

  // Ingest documents (Admin privilege required)
  async ingestDocuments(documentId?: number): Promise<IngestResponse> {
    const response = await apiClient.post<IngestResponse>(
      '/ingest',
      { document_id: documentId || null },
      {
        headers: {
          'X-Admin-Role': 'admin',
        },
      }
    );
    return response.data;
  },

  // Ask RAG chat question with optional targeted document scope and conversation history
  async askQuestion(
    question: string,
    documentName?: string,
    conversationHistory: { role: string; content: string }[] = []
  ): Promise<{ answer: string; sources: SourceCitation[]; execution_time_ms?: number; confidence_score?: number; confidence_label?: string }> {
    const response = await apiClient.post<{ answer: string; sources: SourceCitation[]; execution_time_ms?: number; confidence_score?: number; confidence_label?: string }>('/chat', {
      question,
      document_name: documentName || null,
      conversation_history: conversationHistory,
    });
    return response.data;
  },

  // Predict colleges based on JEE subject marks / score / percentile / category
  async predictColleges(requestData: PredictorRequest): Promise<PredictorResponse> {
    const response = await apiClient.post<PredictorResponse>('/predict', requestData);
    return response.data;
  },

  // Auto-generate FAQs for a document
  async getDocumentFAQs(documentId: number): Promise<{ document_id: number; filename: string; faqs: any[] }> {
    const response = await apiClient.get<{ document_id: number; filename: string; faqs: any[] }>(`/documents/${documentId}/faqs`);
    return response.data;
  },

  // Get full browser URL for streaming PDF document
  getPDFUrl(filename: string): string {
    return `${API_BASE_URL}/uploads/${encodeURIComponent(filename)}`;
  },

  // Delete document by ID (Admin privilege required)
  async deleteDocument(documentId: number): Promise<{ message: string; document_id: number }> {
    const response = await apiClient.delete<{ message: string; document_id: number }>(`/documents/${documentId}`, {
      headers: {
        'X-Admin-Role': 'admin',
      },
    });
    return response.data;
  },
};

