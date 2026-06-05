import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  Alert,
  SafeAreaView,
  TouchableOpacity,
  Text,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { CameraViewComponent } from '../components/CameraView';
import { DocumentPreview } from '../components/DocumentPreview';
import { AnalysisView } from '../components/AnalysisView';
import { analyzeDocumentImage } from '../services/aiService';
import { DocumentAnalysisResult } from '../types';

type RootStackParamList = {
  Home: undefined;
  Scan: undefined;
};

type ScanScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'Scan'
>;

type ScreenState = 'capturing' | 'preview' | 'analyzing' | 'results';

export function ScanScreen({ navigation }: ScanScreenProps) {
  const [screenState, setScreenState] = useState<ScreenState>(
    'capturing'
  );
  const [photoBase64, setPhotoBase64] = useState<string | null>(
    null
  );
  const [analysisResult, setAnalysisResult] =
    useState<DocumentAnalysisResult | null>(null);

  const handleCapture = (base64: string) => {
    setPhotoBase64(base64);
    setScreenState('preview');
  };

  const handleRetake = () => {
    setPhotoBase64(null);
    setScreenState('capturing');
  };

  const handleAnalyze = async () => {
    if (!photoBase64) return;

    setScreenState('analyzing');

    try {
      const result = await analyzeDocumentImage(photoBase64);
      setAnalysisResult(result);
      setScreenState('results');
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'Unknown error occurred';
      Alert.alert('Analysis Failed', errorMessage, [
        {
          text: 'Retake',
          onPress: handleRetake,
        },
      ]);
      setScreenState('preview');
    }
  };

  const handleScanAgain = () => {
    setPhotoBase64(null);
    setAnalysisResult(null);
    setScreenState('capturing');
  };

  const handleGoHome = () => {
    setPhotoBase64(null);
    setAnalysisResult(null);
    setScreenState('capturing');
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      {screenState === 'capturing' && (
        <>
          <CameraViewComponent onCapture={handleCapture} />
          <View style={styles.header}>
            <TouchableOpacity
              onPress={handleGoHome}
              style={styles.backButton}
            >
              <Text style={styles.backButtonText}>← Back</Text>
            </TouchableOpacity>
          </View>
        </>
      )}

      {screenState === 'preview' && photoBase64 && (
        <DocumentPreview
          photoUri={`data:image/jpeg;base64,${photoBase64}`}
          onRetake={handleRetake}
          onAnalyze={handleAnalyze}
          isAnalyzing={false}
        />
      )}

      {screenState === 'analyzing' && photoBase64 && (
        <DocumentPreview
          photoUri={`data:image/jpeg;base64,${photoBase64}`}
          onRetake={handleRetake}
          onAnalyze={handleAnalyze}
          isAnalyzing={true}
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
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100,
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  backButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  backButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});
