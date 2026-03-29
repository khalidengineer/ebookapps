import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, ScrollView, RefreshControl, SafeAreaView, FlatList, TextInput } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { Search, Loader2 } from 'lucide-react-native';
import { fetchProducts, fetchBanners, Product, Banner } from '../../src/services/api';
import BannerSlider from '../../src/components/BannerSlider';
import ProductCard from '../../src/components/ProductCard';
import CategoryFilters from '../../src/components/CategoryFilters';
import { FlashList } from '@shopify/flash-list';

export default function HomeScreen() {
  const [products, setProducts] = useState<Product[]>([]);
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const router = useRouter();

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

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.product_name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
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

        <CategoryFilters 
          selected={selectedCategory} 
          onSelect={setSelectedCategory} 
          categories={['All', ...Array.from(new Set(products.map(p => p.category)))]} 
        />

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
          <Text style={styles.sectionTitle}>
            {selectedCategory === 'All' ? 'All Ebooks' : `${selectedCategory} Ebooks`}
          </Text>
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
  },
});
