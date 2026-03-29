import React, { useCallback, useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, Alert } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { History, ChevronRight, Trash2, Calendar, Clock } from 'lucide-react-native';
import { getRecentlyViewed, clearRecentlyViewed } from '../../src/services/storage';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';

export default function RecentlyViewedScreen() {
  const [recentProducts, setRecentProducts] = useState<any[]>([]);
  const [filter, setFilter] = useState<'all' | 'today' | 'week'>('all');
  const router = useRouter();

  const loadRecent = async () => {
    const data = await getRecentlyViewed();
    setRecentProducts(data);
  };

  useFocusEffect(
    useCallback(() => {
      loadRecent();
    }, [])
  );

  const handleClearHistory = async () => {
    await clearRecentlyViewed();
    setRecentProducts([]);
  };

  const filteredProducts = recentProducts.filter(p => {
    if (filter === 'all') return true;
    if (!p.viewedAt) return false; // Handle legacy items without timestamp
    
    const viewedDate = new Date(p.viewedAt).getTime();
    const now = new Date().getTime();
    const diffHours = (now - viewedDate) / (1000 * 60 * 60);
    const diffDays = diffHours / 24;

    if (filter === 'today') return diffHours <= 24;
    if (filter === 'week') return diffDays <= 7;
    return true;
  });

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
      <Animated.View entering={FadeInDown.duration(800).springify()} style={styles.headerRow}>
        <View style={styles.filterRow}>
          <TouchableOpacity 
            style={[styles.filterButton, filter === 'all' && styles.activeFilter]} 
            onPress={() => setFilter('all')}
          >
            <Text style={[styles.filterText, filter === 'all' && styles.activeText]}>All</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.filterButton, filter === 'today' && styles.activeFilter]} 
            onPress={() => setFilter('today')}
          >
            <Text style={[styles.filterText, filter === 'today' && styles.activeText]}>Today</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.filterButton, filter === 'week' && styles.activeFilter]} 
            onPress={() => setFilter('week')}
          >
            <Text style={[styles.filterText, filter === 'week' && styles.activeText]}>7 Days</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity 
          style={styles.resetButton} 
          onPress={() => {
            Alert.alert(
              'Clear History',
              'Are you sure you want to delete all browsing history?',
              [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Clear All', style: 'destructive', onPress: handleClearHistory }
              ]
            );
          }}
        >
          <Trash2 size={20} color="#FF3B30" />
        </TouchableOpacity>
      </Animated.View>

      <FlatList
        data={filteredProducts}
        keyExtractor={(item) => item.id.toString()}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
        renderItem={({ item, index }) => (
          <Animated.View entering={FadeInDown.delay(index * 100).duration(600).springify()}>
            <TouchableOpacity 
              style={styles.card} 
              onPress={() => router.push(`/product/${item.id}`)}
              activeOpacity={0.7}
            >
              <Image source={{ uri: item.thumbnail_url }} style={styles.thumbnail} />
              <View style={styles.content}>
                <Text style={styles.title} numberOfLines={1}>{item.product_name}</Text>
                <View style={styles.metaInfo}>
                  <Text style={styles.category}>{item.category}</Text>
                  {item.viewedAt && (
                    <View style={styles.timestampContainer}>
                       <Clock size={10} color="#999" />
                       <Text style={styles.timestampText}>
                         {new Date(item.viewedAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                       </Text>
                    </View>
                  )}
                </View>
              </View>
              <ChevronRight size={20} color="#ccc" />
            </TouchableOpacity>
          </Animated.View>
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainerInline}>
            <History size={60} color="#ccc" />
            <Text style={styles.emptyText}>No history for this period.</Text>
            {recentProducts.length > 0 && (
               <TouchableOpacity 
                 style={styles.clearButton} 
                 onPress={handleClearHistory}
               >
                 <Trash2 size={16} color="#FF3B30" />
                 <Text style={styles.clearText}>Clear All History</Text>
               </TouchableOpacity>
            )}
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 24,
    paddingTop: 28, 
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 20,
    gap: 12,
  },
  filterRow: {
    flexDirection: 'row',
    flex: 1,
    gap: 8,
  },
  filterButton: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 14,
    backgroundColor: '#F7F7F7',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#F0F0F0',
    flex: 1,
  },
  resetButton: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: '#FFF0F0',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FFE0E0',
  },
  activeFilter: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  filterText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#999',
    textTransform: 'uppercase',
  },
  activeText: {
    color: '#fff',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  emptyContainerInline: {
    marginTop: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    marginTop: 15,
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
  },
  clearButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    padding: 10,
  },
  clearText: {
    marginLeft: 8,
    color: '#FF3B30',
    fontWeight: '700',
    fontSize: 14,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 14,
    marginBottom: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#F0F0F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  thumbnail: {
    width: 60,
    height: 85,
    borderRadius: 12,
  },
  content: {
    flex: 1,
    marginLeft: 15,
  },
  title: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1A1A1A',
  },
  metaInfo: {
    marginTop: 6,
  },
  category: {
    fontSize: 12,
    color: '#007AFF',
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  timestampContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    gap: 4,
  },
  timestampText: {
    fontSize: 10,
    color: '#999',
    fontWeight: '600',
  },
});
