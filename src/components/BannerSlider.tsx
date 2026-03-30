import React from 'react';
import { View, Image, StyleSheet, Dimensions, TouchableOpacity, Text } from 'react-native';
import Carousel from 'react-native-reanimated-carousel';
import { Banner } from '../services/api';

const { width } = Dimensions.get('window');

interface Props {
  banners: Banner[];
}

const BannerSlider: React.FC<Props> = ({ banners }) => {
  if (!banners.length) return null;

  return (
    <View style={styles.container}>
      <Carousel
        loop
        width={width}
        height={220}
        autoPlay={true}
        autoPlayInterval={3000}
        data={banners}
        scrollAnimationDuration={1000}
        mode="parallax"
        modeConfig={{
          parallaxScrollingScale: 0.9,
          parallaxScrollingOffset: 50,
        }}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.slide} activeOpacity={0.9} onPress={() => {}}>
            <Image 
              source={{ uri: item.image_url }} 
              style={styles.image} 
              resizeMode="cover"
            />
            <View style={styles.overlay}>
              <Text style={styles.title} numberOfLines={1}>{item.title}</Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 5,
    marginBottom: 0,
    backgroundColor: '#fff',
    height: 230,
  },
  slide: {
    width: width,
    height: 210,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: width - 24,
    height: 200,
    borderRadius: 24,
  },
  overlay: {
    position: 'absolute',
    bottom: 25,
    left: 40,
    right: 40,
    backgroundColor: 'rgba(0,0,0,0.3)',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 14,
  },
  title: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '800',
    textAlign: 'center',
    textTransform: 'uppercase',
    letterSpacing: 1.2,
  },
});

export default BannerSlider;
