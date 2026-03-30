import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { fetchProducts, Product } from '../../src/services/api';
import CategoryFolder from '../../src/components/CategoryFolder';
import ProductCard from '../../src/components/ProductCard';
import { LayoutGrid, ArrowLeft } from 'lucide-react-native';
import { FlashList } from '@shopify/flash-list';

export default function CategoriesScreen() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(null);
  const [selectedChildCategory, setSelectedChildCategory] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const loadData = async () => {
      const p = await fetchProducts();
      setProducts(p);
      const uniqueTags = Array.from(new Set(p.map(item => item.category)));
      setCategories(uniqueTags);
    };
    loadData();
  }, []);

  const currentSubcategories = selectedCategory 
    ? Array.from(new Set(products.filter(p => p.category === selectedCategory).map(p => p.subcategory).filter(Boolean)))
    : [];

  const currentChildCategories = selectedSubcategory 
    ? Array.from(new Set(products.filter(p => p.subcategory === selectedSubcategory).map(p => p.child_category).filter(Boolean)))
    : [];

  const filteredProducts = products.filter(p => {
    let matchesCategory = true;
    if (selectedChildCategory) {
      matchesCategory = p.child_category === selectedChildCategory;
    } else if (selectedSubcategory) {
      matchesCategory = p.subcategory === selectedSubcategory;
    } else if (selectedCategory) {
      matchesCategory = p.category === selectedCategory;
    } else {
      matchesCategory = false; // Don't show products if no category is selected
    }
    return matchesCategory;
  });

  const handleBack = () => {
    if (selectedChildCategory) setSelectedChildCategory(null);
    else if (selectedSubcategory) setSelectedSubcategory(null);
    else setSelectedCategory(null);
  };

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {selectedCategory && (
          <View style={styles.breadcrumbContainer}>
            <TouchableOpacity style={styles.backButton} onPress={handleBack}>
              <ArrowLeft size={20} color="#007AFF" />
              <Text style={styles.backButtonText}>Back</Text>
            </TouchableOpacity>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.breadcrumbScroll}>
              <Text style={styles.breadcrumbText}>
                {selectedCategory}
                {selectedSubcategory && ` › ${selectedSubcategory}`}
                {selectedChildCategory && ` › ${selectedChildCategory}`}
              </Text>
            </ScrollView>
          </View>
        )}

        <View style={styles.folderContainer}>
          {!selectedCategory ? (
            categories.map(cat => (
              <CategoryFolder 
                key={cat} 
                title={cat} 
                onPress={() => setSelectedCategory(cat)} 
                count={products.filter(p => p.category === cat).length}
              />
            ))
          ) : !selectedSubcategory ? (
            currentSubcategories.length > 0 ? (
              currentSubcategories.map(sub => (
                <CategoryFolder 
                  key={sub} 
                  title={sub} 
                  color="#FF9500" 
                  onPress={() => setSelectedSubcategory(sub)}
                  count={products.filter(p => p.subcategory === sub).length}
                />
              ))
            ) : null
          ) : !selectedChildCategory ? (
            currentChildCategories.length > 0 ? (
              currentChildCategories.map(child => (
                <CategoryFolder 
                  key={child} 
                  title={child} 
                  color="#34C759" 
                  onPress={() => setSelectedChildCategory(child)}
                  count={products.filter(p => p.child_category === child).length}
                />
              ))
            ) : null
          ) : null}
        </View>

        {selectedCategory && (
          <>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>
                {selectedChildCategory || selectedSubcategory || selectedCategory} Ebooks
              </Text>
            </View>
            <View style={styles.gridContainer}>
              <FlashList
                data={filteredProducts}
                numColumns={2}
                renderItem={({ item }) => <ProductCard product={item} variant="grid" />}
                keyExtractor={item => item.id.toString()}
                estimatedItemSize={100}
                scrollEnabled={false}
              />
            </View>
          </>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 24,
    paddingTop: 32,
  },
  folderContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    marginTop: 10,
  },
  breadcrumbContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    backgroundColor: '#f8f9fa',
    padding: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#eee',
    marginTop: 10,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 10,
    borderRightWidth: 1,
    borderRightColor: '#eee',
    marginRight: 10,
  },
  backButtonText: {
    color: '#007AFF',
    fontWeight: '700',
    marginLeft: 5,
  },
  breadcrumbScroll: {
    flex: 1,
  },
  breadcrumbText: {
    color: '#666',
    fontSize: 14,
    fontWeight: '600',
  },
  sectionHeader: {
    marginTop: 20,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
  },
  gridContainer: {
    minHeight: 400,
    paddingBottom: 40,
  },
});
