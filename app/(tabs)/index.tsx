import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, ScrollView, RefreshControl, SafeAreaView, FlatList, TextInput } from 'react-native';
import { Stack, useRouter, useLocalSearchParams } from 'expo-router';
import { Search, Loader2, ArrowLeft, Folder } from 'lucide-react-native';
import { fetchProducts, fetchBanners, Product, Banner } from '../../src/services/api';
import BannerSlider from '../../src/components/BannerSlider';
import ProductCard from '../../src/components/ProductCard';
import CategoryFolder from '../../src/components/CategoryFolder';
import { FlashList } from '@shopify/flash-list';
import { TouchableOpacity } from 'react-native';

export default function HomeScreen() {
  const [products, setProducts] = useState<Product[]>([]);
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(null);
  const [selectedChildCategory, setSelectedChildCategory] = useState<string | null>(null);
  const router = useRouter();
  const params = useLocalSearchParams<{ category: string }>();

  const loadData = async () => {
    setLoading(true);
    const [p, b] = await Promise.all([fetchProducts(), fetchBanners()]);
    setProducts(p);
    setBanners(b);
    setLoading(false);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (params.category) {
      setSelectedCategory(params.category);
      setSelectedSubcategory(null);
      setSelectedChildCategory(null);
    }
  }, [params.category]);

  const handleReset = () => {
    setSelectedCategory('All');
    setSelectedSubcategory(null);
    setSelectedChildCategory(null);
  };

  const currentCategories = Array.from(new Set(products.map(p => p.category)));
  
  const currentSubcategories = selectedCategory !== 'All' 
    ? Array.from(new Set(products.filter(p => p.category === selectedCategory).map(p => p.subcategory).filter(Boolean)))
    : [];

  const currentChildCategories = selectedSubcategory 
    ? Array.from(new Set(products.filter(p => p.subcategory === selectedSubcategory).map(p => p.child_category).filter(Boolean)))
    : [];

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.product_name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    let matchesCategory = true;
    if (selectedChildCategory) {
      matchesCategory = p.child_category === selectedChildCategory;
    } else if (selectedSubcategory) {
      matchesCategory = p.subcategory === selectedSubcategory;
    } else if (selectedCategory !== 'All') {
      matchesCategory = p.category === selectedCategory;
    }

    return matchesSearch && matchesCategory;
  });

  const featuredProducts = products.filter(p => p.featured);

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <Loader2 color="#007AFF" size={40} />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>

      
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        <View style={styles.searchBarContainer}>
          <Search size={18} color="#999" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search ebooks..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        <BannerSlider banners={banners} />



        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Featured Products</Text>
        </View>
        
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={featuredProducts}
          renderItem={({ item }) => (
            <ProductCard product={item} variant="featured" />
          )}
          keyExtractor={item => item.id.toString()}
          contentContainerStyle={{ paddingHorizontal: 15 }}
        />

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Browse Categories</Text>
        </View>

        <View style={styles.categoryNavigator}>
          {selectedCategory !== 'All' && (
            <View style={styles.breadcrumbContainer}>
              <TouchableOpacity 
                style={styles.backButton} 
                onPress={() => {
                  if (selectedChildCategory) setSelectedChildCategory(null);
                  else if (selectedSubcategory) setSelectedSubcategory(null);
                  else setSelectedCategory('All');
                }}
              >
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
            {selectedCategory === 'All' ? (
              currentCategories.map(cat => (
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
              ) : (
                <Text style={styles.emptyText}>No subcategories found</Text>
              )
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
              ) : (
                <Text style={styles.emptyText}>No child categories found</Text>
              )
            ) : null}
          </View>
        </View>

        <View style={styles.sectionHeader}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text style={styles.sectionTitle}>
              {selectedChildCategory || selectedSubcategory || (selectedCategory === 'All' ? 'All Ebooks' : selectedCategory)}
            </Text>
            {selectedCategory !== 'All' && (
              <TouchableOpacity onPress={handleReset}>
                <Text style={{ color: '#007AFF', fontWeight: '600' }}>Reset</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        <View style={styles.gridContainer}>
          <FlashList
            data={filteredProducts}
            numColumns={2}
            renderItem={({ item }) => <ProductCard product={item} variant="grid" />}
            keyExtractor={item => item.id.toString()}
            estimatedItemSize={200}
            scrollEnabled={false}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    paddingTop: 24,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    marginHorizontal: 15,
    marginVertical: 10,
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#eee',
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
    color: '#333',
  },
  sectionHeader: {
    marginTop: 20,
    marginBottom: 10,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
  },
  gridContainer: {
    paddingHorizontal: 10,
    minHeight: 400,
    paddingBottom: 40,
  },
  categoryNavigator: {
    paddingHorizontal: 15,
  },
  breadcrumbContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#eee',
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
  folderContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    marginBottom: 20,
  },
  emptyText: {
    textAlign: 'center',
    color: '#999',
    marginVertical: 20,
    fontStyle: 'italic',
  },
});
