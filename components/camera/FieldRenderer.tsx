import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ExtractedField } from '../../types';

interface FieldRendererProps {
  field: ExtractedField;
}

export function FieldRenderer({ field }: FieldRendererProps): React.JSX.Element {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{field.label}</Text>
      <Text
        style={[
          styles.value,
          !field.value ? styles.emptyValue : null,
        ]}
      >
        {field.value ?? 'Empty'}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  label: {
    color: '#888',
    fontSize: 14,
    marginBottom: 4,
  },
  value: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  emptyValue: {
    color: '#555',
    fontStyle: 'italic',
  },
});
