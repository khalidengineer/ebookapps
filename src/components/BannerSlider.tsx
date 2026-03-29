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
        height={200}
        autoPlay={true}
        data={banners}
        scrollAnimationDuration={1000}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.slide} activeOpacity={0.9}>
            <Image 
              source={{ uri: item.image_url }} 
              style={styles.image} 
              resizeMode="cover"
            />
            <View style={styles.overlay}>
              <Text style={styles.title}>{item.title}</Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
    backgroundColor: '#fff',
  },
  slide: {
    width: width,
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: width - 30,
    height: 180,
    borderRadius: 15,
  },
  overlay: {
    position: 'absolute',
    bottom: 20,
    left: 25,
    right: 25,
    backgroundColor: 'rgba(0,0,0,0.4)',
    padding: 10,
    borderRadius: 8,
  },
  title: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
});

export default BannerSlider;
