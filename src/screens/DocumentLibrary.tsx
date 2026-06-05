import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Text,
  Alert,
  RefreshControl,
} from 'react-native';
import { listDocuments, deleteDocument, StoredDocument } from '../services/storage';

interface DocumentLibraryProps {
  onDocumentSelect?: (document: StoredDocument) => void;
}

export function DocumentLibrary({ onDocumentSelect }: DocumentLibraryProps) {
  const [documents, setDocuments] = useState<StoredDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadDocuments = useCallback(async () => {
    try {
      setLoading(true);
      const docs = await listDocuments();
      setDocuments(docs);
    } catch (error) {
      Alert.alert('Error', 'Failed to load documents');
    } finally {
      setLoading(false);
    }
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      const docs = await listDocuments();
      setDocuments(docs);
    } finally {
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadDocuments();
  }, [loadDocuments]);

  const handleDelete = (id: string) => {
    Alert.alert(
      'Delete Document',
      'Are you sure you want to delete this document?',
      [
        { text: 'Cancel', onPress: () => {}, style: 'cancel' },
        {
          text: 'Delete',
          onPress: async () => {
            try {
              await deleteDocument(id);
              await loadDocuments();
            } catch (error) {
              Alert.alert('Error', 'Failed to delete document');
            }
          },
          style: 'destructive',
        },
      ]
    );
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  const renderDocument = ({ item }: { item: StoredDocument }) => (
    <TouchableOpacity
      style={styles.documentCard}
      onPress={() => onDocumentSelect?.(item)}
    >
      <View style={styles.documentHeader}>
        <Text style={styles.timestamp}>{formatDate(item.timestamp)}</Text>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => handleDelete(item.id)}
        >
          <Text style={styles.deleteButtonText}>✕</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.fieldsPreview}>
        {item.analysis.fields.slice(0, 2).map((field, idx) => (
          <Text key={idx} style={styles.fieldPreview} numberOfLines={1}>
            {field.label}: {field.value || 'Empty'}
          </Text>
        ))}
        {item.analysis.fields.length > 2 && (
          <Text style={styles.moreFields}>
            +{item.analysis.fields.length - 2} more fields
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Loading documents...</Text>
      </View>
    );
  }

  if (documents.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.emptyText}>No documents yet</Text>
        <Text style={styles.emptySubText}>Scan your first document to get started</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={documents}
        renderItem={renderDocument}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#888"
          />
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  listContent: {
    padding: 16,
    gap: 12,
  },
  documentCard: {
    backgroundColor: '#12121a',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#333',
  },
  documentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  timestamp: {
    color: '#6366f1',
    fontSize: 12,
    fontWeight: '600',
  },
  deleteButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(255, 0, 0, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteButtonText: {
    color: '#ff6b6b',
    fontSize: 16,
    fontWeight: '600',
  },
  fieldsPreview: {
    gap: 6,
  },
  fieldPreview: {
    color: '#aaa',
    fontSize: 13,
  },
  moreFields: {
    color: '#666',
    fontSize: 12,
    fontStyle: 'italic',
  },
  loadingText: {
    color: '#888',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 50,
  },
  emptyText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    marginTop: 100,
  },
  emptySubText: {
    color: '#888',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 8,
  },
});
