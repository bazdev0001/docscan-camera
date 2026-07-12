import React from 'react';

export interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  createdAt: Date;
}

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

export interface ScannedDocumentData {
  id: string;
  userId: string;
  photoBase64: string;
  analysis: DocumentAnalysisResult;
  createdAt: Date;
}

export interface ButtonProps {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
  variant?: 'primary' | 'secondary' | 'outline';
  style?: object;
}

export interface InputProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  secureTextEntry?: boolean;
  label?: string;
  error?: string;
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad';
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
}

export interface CardProps {
  children: React.ReactNode;
  style?: object;
}
