export interface ExtractedField {
  label: string;
  key: string;
  value: string | null;
}

export interface DocumentAnalysisResult {
  fields: ExtractedField[];
  rawText?: string;
  error?: string;
}
