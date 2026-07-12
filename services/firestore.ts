import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  collection,
  getDocs,
  addDoc,
  query,
  where,
  orderBy,
  DocumentData,
  DocumentSnapshot,
  Unsubscribe,
  Firestore,
  Timestamp,
} from 'firebase/firestore';
import { app } from './firebase';
import { ScannedDocumentData } from '../types';
import { Collections } from '../constants/config';

const db: Firestore = getFirestore(app);

export const getDocument = async (col: string, id: string): Promise<DocumentData | null> => {
  try {
    const docRef = doc(db, col, id);
    const docSnap: DocumentSnapshot = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    }
    return null;
  } catch (error) {
    console.error('Error getting document:', error);
    throw error;
  }
};

export const setDocument = async (col: string, id: string, data: DocumentData): Promise<void> => {
  try {
    const docRef = doc(db, col, id);
    await setDoc(docRef, data);
  } catch (error) {
    console.error('Error setting document:', error);
    throw error;
  }
};

export const updateDocument = async (col: string, id: string, data: Partial<DocumentData>): Promise<void> => {
  try {
    const docRef = doc(db, col, id);
    await updateDoc(docRef, data);
  } catch (error) {
    console.error('Error updating document:', error);
    throw error;
  }
};

export const deleteDocument = async (col: string, id: string): Promise<void> => {
  try {
    const docRef = doc(db, col, id);
    await deleteDoc(docRef);
  } catch (error) {
    console.error('Error deleting document:', error);
    throw error;
  }
};

export const subscribeToDocument = (
  col: string,
  id: string,
  callback: (data: DocumentData | null) => void
): Unsubscribe => {
  const docRef = doc(db, col, id);
  return onSnapshot(docRef, (docSnap: DocumentSnapshot) => {
    if (docSnap.exists()) {
      callback({ id: docSnap.id, ...docSnap.data() });
    } else {
      callback(null);
    }
  });
};

export const saveScannedDocument = async (
  userId: string,
  data: Omit<ScannedDocumentData, 'id'>
): Promise<string> => {
  try {
    const col = collection(db, Collections.SCANNED_DOCUMENTS);
    const docRef = await addDoc(col, {
      userId,
      photoBase64: data.photoBase64,
      analysis: data.analysis,
      createdAt: Timestamp.fromDate(data.createdAt),
    });
    return docRef.id;
  } catch (error) {
    console.error('Error saving scanned document:', error);
    throw error;
  }
};

export const listScannedDocuments = async (userId: string): Promise<ScannedDocumentData[]> => {
  try {
    const col = collection(db, Collections.SCANNED_DOCUMENTS);
    const q = query(col, where('userId', '==', userId), orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((docSnap) => {
      const d = docSnap.data();
      return {
        id: docSnap.id,
        userId: d['userId'] as string,
        photoBase64: d['photoBase64'] as string,
        analysis: d['analysis'] as ScannedDocumentData['analysis'],
        createdAt: (d['createdAt'] as Timestamp).toDate(),
      };
    });
  } catch (error) {
    console.error('Error listing scanned documents:', error);
    throw error;
  }
};

export const deleteScannedDocument = async (userId: string, docId: string): Promise<void> => {
  try {
    const docRef = doc(db, Collections.SCANNED_DOCUMENTS, docId);
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists() || docSnap.data()['userId'] !== userId) {
      throw new Error('Document not found or access denied');
    }
    await deleteDoc(docRef);
  } catch (error) {
    console.error('Error deleting scanned document:', error);
    throw error;
  }
};

export { db };
