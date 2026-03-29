import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { History, ChevronRight } from 'lucide-react-native';
import { getRecentlyViewed } from '../../src/services/storage';

export default function RecentlyViewedScreen() {
  const [recentProducts, setRecentProducts] = useState<any[]>([]);
  const router = useRouter();

  const loadRecent = async () => {
    const data = await getRecentlyViewed();
    setRecentProducts(data);
  };

  useEffect(() => {
    loadRecent();
  }, []);

  if (recentProducts.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <History size={60} color="#ccc" />
        <Text style={styles.emptyText}>No recently viewed ebooks yet.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>

      <FlatList
        data={recentProducts}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity 
            style={styles.card} 
            onPress={() => router.push(`/product/${item.id}`)}
          >
            <Image source={{ uri: item.thumbnail_url }} style={styles.thumbnail} />
            <View style={styles.content}>
              <Text style={styles.title} numberOfLines={1}>{item.product_name}</Text>
              <Text style={styles.category}>{item.category}</Text>
            </View>
            <ChevronRight size={20} color="#ccc" />
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
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  header: {
    fontSize: 24,
    fontWeight: '800',
    color: '#333',
    marginBottom: 20,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  emptyText: {
    marginTop: 15,
    fontSize: 16,
    color: '#999',
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 12,
    marginBottom: 15,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#eee',
  },
  thumbnail: {
    width: 50,
    height: 70,
    borderRadius: 8,
  },
  content: {
    flex: 1,
    marginLeft: 15,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
  },
  category: {
    fontSize: 12,
    color: '#999',
    marginTop: 2,
  },
});
