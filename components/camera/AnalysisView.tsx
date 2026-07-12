import React from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Text,
  Alert,
} from 'react-native';
import * as Sharing from 'expo-sharing';
import { DocumentAnalysisResult } from '../../types';
import { FieldRenderer } from './FieldRenderer';

interface AnalysisViewProps {
  result: DocumentAnalysisResult;
  onScanAgain: () => void;
}

export function AnalysisView({
  result,
  onScanAgain,
}: AnalysisViewProps): React.JSX.Element {
  const handleExport = async (): Promise<void> => {
    try {
      const jsonString = JSON.stringify(result, null, 2);

      if (!(await Sharing.isAvailableAsync())) {
        Alert.alert('Sharing not available', 'Cannot share on this device');
        return;
      }

      await Sharing.shareAsync(
        `data:application/json,${encodeURIComponent(jsonString)}`,
        {
          mimeType: 'application/json',
          dialogTitle: 'Export Document Analysis',
        }
      );
    } catch (error) {
      Alert.alert('Export Failed', 'Could not export results');
    }
  };

  const isEmpty =
    result.fields.length === 0 && result.rawText === 'Empty document';
  const hasError = !!result.error;

  return (
    <View style={styles.container}>
      {hasError && (
        <View style={styles.errorBox}>
          <Text style={styles.errorText}>{result.error}</Text>
        </View>
      )}

      {isEmpty && (
        <View style={styles.emptyBox}>
          <Text style={styles.emptyText}>Document appears empty</Text>
        </View>
      )}

      {!isEmpty && !hasError && (
        <ScrollView style={styles.scrollView}>
          {result.fields.map((field, index) => (
            <FieldRenderer key={index} field={field} />
          ))}
        </ScrollView>
      )}

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={onScanAgain}
        >
          <Text style={styles.buttonText}>Scan Again</Text>
        </TouchableOpacity>

        {!isEmpty && !hasError && (
          <TouchableOpacity
            style={[styles.button, styles.exportButton]}
            onPress={handleExport}
          >
            <Text style={styles.buttonText}>Export JSON</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  scrollView: {
    flex: 1,
  },
  errorBox: {
    backgroundColor: '#7f1d1d',
    padding: 16,
    margin: 16,
    borderRadius: 8,
  },
  errorText: {
    color: '#fca5a5',
    fontSize: 14,
  },
  emptyBox: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    color: '#888',
    fontSize: 16,
  },
  buttonContainer: {
    padding: 16,
    gap: 12,
  },
  button: {
    backgroundColor: '#6366f1',
    paddingVertical: 14,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  exportButton: {
    backgroundColor: '#4f46e5',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
