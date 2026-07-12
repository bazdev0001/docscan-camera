import React from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  Text,
  ActivityIndicator,
} from 'react-native';

interface DocumentPreviewProps {
  photoUri: string;
  onRetake: () => void;
  onAnalyze: () => void;
  isAnalyzing: boolean;
}

export function DocumentPreview({
  photoUri,
  onRetake,
  onAnalyze,
  isAnalyzing,
}: DocumentPreviewProps): React.JSX.Element {
  return (
    <View style={styles.container}>
      <Image source={{ uri: photoUri }} style={styles.image} />

      {isAnalyzing && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#6366f1" />
          <Text style={styles.loadingText}>Analyzing Document...</Text>
        </View>
      )}

      {!isAnalyzing && (
        <>
          <TouchableOpacity style={styles.retakeButton} onPress={onRetake}>
            <Text style={styles.retakeButtonText}>&#10005;</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.analyzeButton}
            onPress={onAnalyze}
            disabled={isAnalyzing}
          >
            <Text style={styles.analyzeButtonText}>Analyze Document</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  image: {
    flex: 1,
    width: '100%',
  },
  retakeButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  retakeButtonText: {
    fontSize: 28,
    color: '#fff',
    fontWeight: '300',
  },
  analyzeButton: {
    position: 'absolute',
    bottom: 50,
    left: 20,
    right: 20,
    backgroundColor: '#6366f1',
    paddingVertical: 16,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  analyzeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#fff',
    fontSize: 16,
    marginTop: 16,
  },
});
