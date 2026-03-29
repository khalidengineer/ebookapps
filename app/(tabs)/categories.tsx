import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { fetchProducts, Product } from '../../src/services/api';
import CategoryFolder from '../../src/components/CategoryFolder';
import { LayoutGrid } from 'lucide-react-native';

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
      pathname: '/(tabs)/',
      params: { category }
    });
  };

  return (
    <View style={styles.container}>

      <FlatList
        data={categories}
        keyExtractor={(item) => item}
        numColumns={3}
        columnWrapperStyle={styles.columnWrapper}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <CategoryFolder 
            title={item} 
            onPress={() => handleCategoryPress(item)} 
          />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 15,
    paddingTop: 24,
  },
  listContent: {
    paddingBottom: 20,
  },
  columnWrapper: {
    justifyContent: 'flex-start',
  },
});
