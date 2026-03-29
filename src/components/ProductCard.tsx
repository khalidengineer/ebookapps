import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { Product } from '../services/api';
import { Star, Bookmark } from 'lucide-react-native';

const { width } = Dimensions.get('window');

interface Props {
  product: Product;
  variant: 'grid' | 'featured';
}

const ProductCard: React.FC<Props> = ({ product, variant }) => {
  const router = useRouter();

  const handlePress = () => {
    router.push(`/product/${product.id}`);
  };

  if (variant === 'featured') {
    return (
      <TouchableOpacity onPress={handlePress} style={styles.featuredCard} activeOpacity={0.8}>
        <Image style={styles.featuredThumbnail} source={{ uri: product.thumbnail_url }} resizeMode="cover" />
        <View style={styles.featuredBadge}>
          <Star color="#FFD700" size={12} fill="#FFD700" />
          <Text style={styles.badgeText}>Featured</Text>
        </View>
        <View style={styles.featuredContent}>
          <Text style={styles.featuredTitle} numberOfLines={1}>{product.product_name}</Text>
          <Text style={styles.featuredPrice}>${product.price}</Text>
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity onPress={handlePress} style={styles.gridCard} activeOpacity={0.8}>
      <Image style={styles.gridThumbnail} source={{ uri: product.thumbnail_url }} resizeMode="cover" />
      <View style={styles.gridContent}>
        <Text style={styles.gridCategory}>{product.category}</Text>
        <Text style={styles.gridTitle} numberOfLines={2}>{product.product_name}</Text>
        <View style={styles.gridFooter}>
          <Text style={styles.gridPrice}>${product.price}</Text>
          <Bookmark size={16} color="#999" />
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  featuredCard: {
    width: 200,
    marginRight: 15,
    borderRadius: 15,
    backgroundColor: '#fff',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    overflow: 'hidden',
    marginBottom: 10,
  },
  featuredThumbnail: {
    width: '100%',
    height: 120,
  },
  featuredBadge: {
    position: 'absolute',
    top: 10,
    left: 10,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#333',
    marginLeft: 4,
  },
  featuredContent: {
    padding: 10,
  },
  featuredTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#333',
  },
  featuredPrice: {
    fontSize: 14,
    color: '#007AFF',
    fontWeight: '600',
    marginTop: 4,
  },
  gridCard: {
    flex: 1,
    margin: 8,
    backgroundColor: '#fff',
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    overflow: 'hidden',
  },
  gridThumbnail: {
    width: '100%',
    height: 150,
  },
  gridContent: {
    padding: 12,
  },
  gridCategory: {
    fontSize: 10,
    color: '#999',
    textTransform: 'uppercase',
    fontWeight: '600',
    marginBottom: 4,
  },
  gridTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    height: 36,
  },
  gridFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  gridPrice: {
    fontSize: 15,
    fontWeight: '700',
    color: '#007AFF',
  },
});

export default ProductCard;
