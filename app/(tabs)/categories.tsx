import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { fetchProducts, Product } from '../../src/services/api';
import { LayoutGrid, ChevronRight } from 'lucide-react-native';

export default function CategoriesScreen() {
  const [categories, setCategories] = useState<string[]>([]);
  const router = useRouter();

  useEffect(() => {
    const loadCategories = async () => {
      const products = await fetchProducts();
      const uniqueTags = Array.from(new Set(products.map(p => p.category)));
      setCategories(uniqueTags);
    };
    loadCategories();
  }, []);

  const handleCategoryPress = (category: string) => {
    router.push({
      pathname: '/(tabs)',
      params: { category }
    });
  };

  return (
    <View style={styles.container}>

      <FlatList
        data={categories}
        keyExtractor={(item) => item}
        renderItem={({ item }) => (
          <TouchableOpacity 
            style={styles.categoryInfo} 
            onPress={() => handleCategoryPress(item)}
            activeOpacity={0.7}
          >
            <View style={styles.iconContainer}>
              <LayoutGrid color="#007AFF" size={24} />
            </View>
            <Text style={styles.categoryName}>{item}</Text>
            <ChevronRight color="#ccc" size={20} />
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
    paddingTop: 24,
  },
  header: {
    fontSize: 24,
    fontWeight: '800',
    color: '#333',
    marginBottom: 20,
  },
  categoryInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    padding: 15,
    borderRadius: 15,
    marginBottom: 12,
  },
  iconContainer: {
    width: 45,
    height: 45,
    borderRadius: 12,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  categoryName: {
    flex: 1,
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
  },
});
