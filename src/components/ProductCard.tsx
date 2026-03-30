import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { Product } from '../services/api';
import { Star, Bookmark, ShoppingBag } from 'lucide-react-native';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';

const { width } = Dimensions.get('window');

interface Props {
  product: Product;
  variant: 'grid' | 'featured';
}

const ProductCard: React.FC<Props> = ({ product, variant }) => {
  const router = useRouter();
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.95);
  };

  const handlePressOut = () => {
    scale.value = withSpring(1);
  };

  const handlePress = () => {
    router.push(`/product/${product.id}`);
  };

  if (variant === 'featured') {
    return (
      <Animated.View style={[styles.featuredCard, animatedStyle]}>
        <TouchableOpacity 
          onPress={handlePress} 
          onPressIn={handlePressIn} 
          onPressOut={handlePressOut}
          activeOpacity={1}
        >
          <View style={styles.featuredInner}>
            <View style={styles.featuredImageContainer}>
              <Image style={styles.featuredThumbnail} source={{ uri: product.thumbnail_url }} resizeMode="contain" />
              <View style={styles.featuredBadge}>
                <Star color="#FFD700" size={12} fill="#FFD700" />
                <Text style={styles.badgeText}>Premium</Text>
              </View>
            </View>
            <View style={styles.featuredContent}>
              <Text style={styles.featuredTitle} numberOfLines={1}>{product.product_name}</Text>
              <View style={styles.cardInfo}>
                 <Text style={styles.featuredPrice}>${product.price}</Text>
                 <ShoppingBag size={14} color="#007AFF" />
              </View>
            </View>
          </View>
        </TouchableOpacity>
      </Animated.View>
    );
  }

  return (
    <Animated.View style={[styles.gridCard, animatedStyle]}>
      <TouchableOpacity 
        onPress={handlePress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={1}
      >
        <View style={styles.gridImageContainer}>
          <Image style={styles.gridThumbnail} source={{ uri: product.thumbnail_url }} resizeMode="contain" />
        </View>
        <View style={styles.gridContent}>
          <Text style={styles.gridCategory}>{product.category}</Text>
          <Text style={styles.gridTitle} numberOfLines={2}>{product.product_name}</Text>
          <View style={styles.gridFooter}>
            <Text style={styles.gridPrice}>${product.price}</Text>
            <Bookmark size={16} color="#007AFF" fill="rgba(0, 122, 255, 0.1)" />
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  featuredCard: {
    width: width - 80,
    marginRight: 15,
    borderRadius: 20,
    backgroundColor: '#fff',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    overflow: 'hidden',
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  featuredInner: {
    flexDirection: 'column',
  },
  featuredImageContainer: {
    width: '100%',
    height: 120,
    backgroundColor: '#F8F9FA',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 5,
  },
  featuredThumbnail: {
    width: '100%',
    height: '100%',
  },
  featuredBadge: {
    position: 'absolute',
    top: 10,
    left: 10,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
    zIndex: 1,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#007AFF',
    marginLeft: 4,
    textTransform: 'uppercase',
  },
  featuredContent: {
    flex: 1,
    padding: 12,
    justifyContent: 'center',
  },
  featuredTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  cardInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 6,
  },
  featuredPrice: {
    fontSize: 14,
    color: '#007AFF',
    fontWeight: '800',
  },
  gridCard: {
    flex: 1,
    margin: 5,
    backgroundColor: '#fff',
    borderRadius: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  gridImageContainer: {
    width: '100%',
    height: 95,
    backgroundColor: '#F8F9FA',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 5,
  },
  gridThumbnail: {
    width: '100%',
    borderRadius:10,
    height: '100%',
  },
  gridContent: {
    flex: 1,
    padding: 8,
    justifyContent: 'center',
  },
  gridCategory: {
    fontSize: 8,
    color: '#007AFF',
    textTransform: 'uppercase',
    fontWeight: '800',
    marginBottom: 2,
    letterSpacing: 0.5,
  },
  gridTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1A1A1A',
    height: 38,
    lineHeight: 18,
  },
  gridFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  gridPrice: {
    fontSize: 14,
    fontWeight: '800',
    color: '#1A1A1A',
  },
});

export default ProductCard;
