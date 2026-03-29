import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';

interface Props {
  categories: string[];
  selected: string;
  onSelect: (category: string) => void;
}

const CategoryFilters: React.FC<Props> = ({ categories, selected, onSelect }) => {
  return (
    <View style={styles.container}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {categories.map((cat, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.chip,
              selected === cat && styles.selectedChip
            ]}
            onPress={() => onSelect(cat)}
            activeOpacity={0.7}
          >
            <Text style={[
              styles.chipText,
              selected === cat && styles.selectedChipText
            ]}>
              {cat}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
  },
  scrollContent: {
    paddingHorizontal: 15,
  },
  chip: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: '#fff',
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#eee',
  },
  selectedChip: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  chipText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '600',
  },
  selectedChipText: {
    color: '#fff',
  },
});

export default CategoryFilters;
