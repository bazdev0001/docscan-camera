import { Paths, Directory, File } from 'expo-file-system';
import { DocumentAnalysisResult } from '../types';

export interface StoredDocument {
  id: string;
  timestamp: number;
  photoBase64: string;
  analysis: DocumentAnalysisResult;
}

function getStorageDirectory(): Directory {
  return new Directory(Paths.document, 'docscan');
}

export async function ensureStorageDir(): Promise<void> {
  try {
    const storageDir = getStorageDirectory();
    if (!storageDir.exists) {
      await storageDir.create();
    }
  } catch (error) {
    console.error('Failed to create storage directory:', error);
  }
}

export async function saveDocument(
  photoBase64: string,
  analysis: DocumentAnalysisResult
): Promise<StoredDocument> {
  await ensureStorageDir();

  const id = Date.now().toString();
  const document: StoredDocument = {
    id,
    timestamp: Date.now(),
    photoBase64,
    analysis,
  };

  try {
    const storageDir = getStorageDirectory();
    const file = storageDir.createFile(`${id}.json`, 'application/json');
    await file.write(JSON.stringify(document, null, 2));
  } catch (error) {
    console.error('Failed to save document:', error);
    throw error;
  }

  return document;
}

export async function loadDocument(id: string): Promise<StoredDocument | null> {
  try {
    const storageDir = getStorageDirectory();
    const file = storageDir.createFile(`${id}.json`, 'application/json');
    const content = await file.text();
    return JSON.parse(content) as StoredDocument;
  } catch (error) {
    console.error('Failed to load document:', error);
    return null;
  }
}

export async function listDocuments(): Promise<StoredDocument[]> {
  await ensureStorageDir();
  const documents: StoredDocument[] = [];

  try {
    const storageDir = getStorageDirectory();
    if (!storageDir.exists) {
      return documents;
    }

    const items = storageDir.list();
    for (const item of items) {
      if (item instanceof File && item.name.endsWith('.json')) {
        const id = item.name.replace('.json', '');
        const doc = await loadDocument(id);
        if (doc) {
          documents.push(doc);
        }
      }
    }
  } catch (error) {
    console.error('Failed to list documents:', error);
  }

  return documents.sort((a, b) => b.timestamp - a.timestamp);
}

export async function deleteDocument(id: string): Promise<void> {
  try {
    const storageDir = getStorageDirectory();
    const file = storageDir.createFile(`${id}.json`, 'application/json');
    await file.delete();
  } catch (error) {
    console.error('Failed to delete document:', error);
    throw error;
  }
}

export async function exportDocumentAsJSON(
  document: StoredDocument
): Promise<string> {
  return JSON.stringify(document, null, 2);
}

export async function getStorageStats(): Promise<{
  totalDocuments: number;
  estimatedSize: number;
}> {
  try {
    const documents = await listDocuments();
    const totalSize = documents.reduce((acc, doc) => {
      return acc + doc.photoBase64.length;
    }, 0);

    return {
      totalDocuments: documents.length,
      estimatedSize: totalSize,
    };
  } catch (error) {
    console.error('Failed to get storage stats:', error);
    return {
      totalDocuments: 0,
      estimatedSize: 0,
    };
  }
}
