import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { Folder, ChevronRight } from 'lucide-react-native';

interface CategoryFolderProps {
  title: string;
  onPress: () => void;
  count?: number;
  color?: string;
}

const CategoryFolder: React.FC<CategoryFolderProps> = ({ title, onPress, count, color = "#007AFF" }) => {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.7}>
      <View style={[styles.iconContainer, { backgroundColor: color + '15' }]}>
        <Folder size={28} color={color} fill={color + '20'} />
      </View>
      <Text style={styles.title} numberOfLines={2}>{title}</Text>
      {count !== undefined && (
        <Text style={styles.countText}>{count} items</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '31%',
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFF',
    padding: 10,
    borderRadius: 20,
    marginBottom: 12,
    marginRight: '2%', // Small gap between items
    borderWidth: 1,
    borderColor: '#F0F0F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  iconContainer: {
    width: 54,
    height: 54,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1A1A1A',
    textAlign: 'center',
    lineHeight: 16,
  },
  countText: {
    fontSize: 10,
    color: '#999',
    marginTop: 2,
  },
});

export default CategoryFolder;
