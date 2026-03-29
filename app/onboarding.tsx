import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, Image, Dimensions, TouchableOpacity, SafeAreaView, FlatList } from 'react-native';
import { useRouter } from 'expo-router';
import { setOnboardingCompleted } from '../src/services/storage';
import { ChevronRight, Check } from 'lucide-react-native';

const { width, height } = Dimensions.get('window');

const slides = [
  {
    id: '1',
    title: 'Self Study Guides',
    subtitle: 'Unleash your potential with our curated materials.',
    description: 'Explore a wide range of academic notes and guides.',
  },
  {
    id: '2',
    title: 'Your Personal Companion',
    subtitle: 'Carry your books wherever you go.',
    description: 'Offline support for reading anytime, anywhere.',
  },
  {
    id: '3',
    title: 'Achieve Excellence',
    subtitle: 'Start your learning journey today.',
    description: 'Digital delivery of premium educational content.',
  },
];

export default function OnboardingScreen() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollRef = useRef<FlatList>(null);
  const router = useRouter();

  const handleNext = async () => {
    if (currentIndex < slides.length - 1) {
      scrollRef.current?.scrollToIndex({ index: currentIndex + 1 });
      setCurrentIndex(currentIndex + 1);
    } else {
      await handleFinish();
    }
  };

  const handleSkip = async () => {
    await handleFinish();
  };

  const handleFinish = async () => {
    await setOnboardingCompleted();
    router.replace('/(tabs)');
  };

  const onMomentumScrollEnd = (e: any) => {
    const index = Math.round(e.nativeEvent.contentOffset.x / width);
    setCurrentIndex(index);
  };

  return (
    <View style={[styles.container, { paddingTop: 24 }]}>
      <FlatList
        ref={scrollRef}
        data={slides}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={onMomentumScrollEnd}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.slide}>
            <Image 
              source={require('../assets/onboarding.png')} 
              style={styles.image} 
              resizeMode="cover"
            />
            <View style={styles.overlay} />
            <View style={styles.content}>
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.subtitle}>{item.subtitle}</Text>
              <Text style={styles.description}>{item.description}</Text>
            </View>
          </View>
        )}
      />

      <View style={styles.footer}>
        <TouchableOpacity onPress={handleSkip} style={styles.skipButton}>
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>

        <View style={styles.pagination}>
          {slides.map((_, i) => (
            <View 
              key={i} 
              style={[
                styles.dot, 
                currentIndex === i ? styles.activeDot : styles.inactiveDot
              ]} 
            />
          ))}
        </View>

        <TouchableOpacity onPress={handleNext} style={styles.nextButton}>
          <Text style={styles.nextText}>
            {currentIndex === slides.length - 1 ? 'Done' : 'Next'}
          </Text>
          {currentIndex === slides.length - 1 ? (
            <Check color="#fff" size={20} style={{ marginLeft: 5 }} />
          ) : (
            <ChevronRight color="#fff" size={20} style={{ marginLeft: 5 }} />
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  slide: {
    width: width,
    height: height,
    justifyContent: 'flex-end',
  },
  image: {
    ...StyleSheet.absoluteFillObject,
    width: width,
    height: height,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
  },
  content: {
    padding: 30,
    paddingBottom: 150,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#002E5D',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
    marginBottom: 15,
  },
  description: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 100,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 25,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderColor: '#eee',
  },
  pagination: {
    flexDirection: 'row',
  },
  dot: {
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  activeDot: {
    width: 20,
    backgroundColor: '#007AFF',
  },
  inactiveDot: {
    width: 8,
    backgroundColor: '#ccc',
  },
  skipButton: {
    padding: 10,
  },
  skipText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#999',
  },
  nextButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
  },
  nextText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
  },
});
