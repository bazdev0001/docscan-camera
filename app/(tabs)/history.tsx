import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Text,
  Alert,
  RefreshControl,
  ListRenderItem,
} from 'react-native';
import { useAuth } from '../../hooks/useAuth';
import { listScannedDocuments, deleteScannedDocument } from '../../services/firestore';
import { ScannedDocumentData } from '../../types';
import { Colors } from '../../constants/colors';
import { LoadingScreen } from '../../components/common/LoadingScreen';

export default function HistoryScreen(): React.JSX.Element {
  const { user } = useAuth();
  const [documents, setDocuments] = useState<ScannedDocumentData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  const loadDocuments = useCallback(async (): Promise<void> => {
    if (!user) return;
    try {
      setLoading(true);
      const docs = await listScannedDocuments(user.uid);
      setDocuments(docs);
    } catch (error) {
      Alert.alert('Error', 'Failed to load documents');
    } finally {
      setLoading(false);
    }
  }, [user]);

  const onRefresh = useCallback(async (): Promise<void> => {
    if (!user) return;
    setRefreshing(true);
    try {
      const docs = await listScannedDocuments(user.uid);
      setDocuments(docs);
    } finally {
      setRefreshing(false);
    }
  }, [user]);

  useEffect(() => {
    loadDocuments();
  }, [loadDocuments]);

  const handleDelete = (docId: string): void => {
    if (!user) return;
    Alert.alert(
      'Delete Document',
      'Are you sure you want to delete this document?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          onPress: async (): Promise<void> => {
            try {
              await deleteScannedDocument(user.uid, docId);
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

  const formatDate = (date: Date): string => {
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  const renderDocument: ListRenderItem<ScannedDocumentData> = ({ item }) => (
    <View style={styles.documentCard}>
      <View style={styles.documentHeader}>
        <Text style={styles.timestamp}>{formatDate(item.createdAt)}</Text>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => handleDelete(item.id)}
        >
          <Text style={styles.deleteButtonText}>&#10005;</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.fieldsPreview}>
        {item.analysis.fields.slice(0, 2).map((field, idx) => (
          <Text key={idx} style={styles.fieldPreview} numberOfLines={1}>
            {field.label}: {field.value ?? 'Empty'}
          </Text>
        ))}
        {item.analysis.fields.length > 2 && (
          <Text style={styles.moreFields}>
            +{item.analysis.fields.length - 2} more fields
          </Text>
        )}
      </View>
    </View>
  );

  if (loading) {
    return <LoadingScreen message="Loading documents..." />;
  }

  if (documents.length === 0) {
    return (
      <View style={styles.emptyContainer}>
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
            tintColor={Colors.textSecondary}
          />
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  emptyContainer: {
    flex: 1,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    padding: 16,
    gap: 12,
  },
  documentCard: {
    backgroundColor: Colors.surface,
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  documentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  timestamp: {
    color: Colors.primary,
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
  emptyText: {
    color: Colors.text,
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
  emptySubText: {
    color: Colors.textSecondary,
    fontSize: 14,
    textAlign: 'center',
    marginTop: 8,
  },
});
