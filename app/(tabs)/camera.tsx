import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  Alert,
  SafeAreaView,
} from 'react-native';
import { CameraViewComponent } from '../../components/camera/CameraViewComponent';
import { DocumentPreview } from '../../components/camera/DocumentPreview';
import { AnalysisView } from '../../components/camera/AnalysisView';
import { analyzeDocumentImage } from '../../services/aiService';
import { saveScannedDocument } from '../../services/firestore';
import { useAuth } from '../../hooks/useAuth';
import { DocumentAnalysisResult } from '../../types';

type ScreenState = 'capturing' | 'preview' | 'analyzing' | 'results';

export default function CameraScreen(): React.JSX.Element {
  const { user } = useAuth();
  const [screenState, setScreenState] = useState<ScreenState>('capturing');
  const [photoBase64, setPhotoBase64] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<DocumentAnalysisResult | null>(null);

  const handleCapture = (base64: string): void => {
    setPhotoBase64(base64);
    setScreenState('preview');
  };

  const handleRetake = (): void => {
    setPhotoBase64(null);
    setScreenState('capturing');
  };

  const handleAnalyze = async (): Promise<void> => {
    if (!photoBase64) return;

    setScreenState('analyzing');

    try {
      const result = await analyzeDocumentImage(photoBase64);
      setAnalysisResult(result);

      if (user) {
        try {
          await saveScannedDocument(user.uid, {
            userId: user.uid,
            photoBase64,
            analysis: result,
            createdAt: new Date(),
          });
        } catch (storageError) {
          console.error('Failed to save document to Firestore:', storageError);
        }
      }

      setScreenState('results');
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error occurred';
      Alert.alert('Analysis Failed', errorMessage, [
        { text: 'Retake', onPress: handleRetake },
      ]);
      setScreenState('preview');
    }
  };

  const handleScanAgain = (): void => {
    setPhotoBase64(null);
    setAnalysisResult(null);
    setScreenState('capturing');
  };

  return (
    <SafeAreaView style={styles.container}>
      {screenState === 'capturing' && (
        <CameraViewComponent onCapture={handleCapture} />
      )}

      {(screenState === 'preview' || screenState === 'analyzing') && photoBase64 && (
        <DocumentPreview
          photoUri={`data:image/jpeg;base64,${photoBase64}`}
          onRetake={handleRetake}
          onAnalyze={handleAnalyze}
          isAnalyzing={screenState === 'analyzing'}
        />
      )}

      {screenState === 'results' && analysisResult && (
        <AnalysisView
          result={analysisResult}
          onScanAgain={handleScanAgain}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
});
