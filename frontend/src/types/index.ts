export type UserRole = 'student' | 'admin';

export interface DocumentItem {
  id: number;
  filename: string;
  file_size: number;
  upload_date: string;
  is_ingested: boolean;
  total_pages: number;
  total_chunks: number;
}


export interface DocumentListResponse {
  documents: DocumentItem[];
  total_count: number;
}

export interface SystemStats {
  total_documents: number;
  total_ingested: number;
  total_pages: number;
  total_chunks: number;
  embedding_model: string;
  llm_model: string;
  status: string;
}

export interface SourceCitation {
  document: string;
  page: number;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  sources?: SourceCitation[];
  timestamp: string;
  execution_time_ms?: number;
  confidence_score?: number;
  confidence_label?: string;
  isError?: boolean;
  document_name?: string;
  feedback?: 'like' | 'dislike' | null;
}

export interface IngestResponse {
  message: string;
  processed_documents: number;
  total_chunks: number;
}

export interface FAQItem {
  question: string;
  answer: string;
  sources: SourceCitation[];
}

export interface FAQResponse {
  document_id: number;
  filename: string;
  faqs: FAQItem[];
}

export type PredictorInputMode = 'marks' | 'percentile' | 'rank' | 'advanced';

export interface PredictorRequest {
  input_mode: PredictorInputMode;
  maths_marks: number;
  physics_marks: number;
  chemistry_marks: number;
  jee_main_marks?: number;
  jee_main_percentile?: number;
  jee_main_rank?: number;
  jee_advanced_rank?: number;
  category: string;
  gender: string;
  home_state: string;
  preferred_branch: string;
  institution_type: string;
}

export interface CollegePrediction {
  id: string;
  institute_name: string;
  short_name: string;
  type: 'IIT' | 'NIT' | 'IIIT' | 'GFTI' | 'State/Private' | string;
  location: string;
  state: string;
  branch: string;
  category: string;
  opening_rank: number;
  closing_rank: number;
  candidate_rank: number;
  chance_level: 'High' | 'Moderate' | 'Dream';
  chance_percentage: number;
  avg_package_lpa: number;
  annual_fee_lakhs: number;
  nirf_rank?: number;
  recommendation_reason: string;
}

export interface ChoiceFillingItem {
  preference_number: number;
  institute_name: string;
  branch: string;
  type: string;
  closing_rank: number;
  chance_level: string;
  strategy_note: string;
}

export interface PredictorResponse {
  total_score: number;
  maths_score: number;
  physics_score: number;
  chemistry_score: number;
  estimated_percentile: number;
  estimated_air: number;
  category_rank: number;
  category: string;
  gender: string;
  input_mode: string;
  total_matches: number;
  high_chance_count: number;
  moderate_chance_count: number;
  dream_chance_count: number;
  predictions: CollegePrediction[];
  choice_filling_order: ChoiceFillingItem[];
}

