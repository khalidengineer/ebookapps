import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking, Dimensions, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, BookOpen, Heart, Info, Layers, Globe, Mail, Github, Star, CheckCircle2 } from 'lucide-react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import Constants from 'expo-constants';
import { StatusBar } from 'expo-status-bar';

const { width } = Dimensions.get('window');

export default function AboutScreen() {
  const router = useRouter();
  const version = Constants.expoConfig?.version || '1.0.0';

  const features = [
    { icon: BookOpen, title: 'Premium Library', desc: 'Access hundreds of curated digital books across all genres.' },
    { icon: Layers, title: 'Smart Reading', desc: 'Enjoy features like dark mode, custom fonts, and offline reading.' },
    { icon: Heart, title: 'Personalized', desc: 'Save your favorite books and track your reading progress effortlessly.' },
    { icon: CheckCircle2, title: 'Smooth Experience', desc: 'Experience lightning-fast performance and a clean, ad-free UI.' },
  ];

  const handleLink = (url: string) => {
    Linking.openURL(url);
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      
      {/* Custom Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ArrowLeft color="#333" size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>About App</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* App Branding */}
        <Animated.View entering={FadeInDown.delay(200).duration(800)} style={styles.brandingContainer}>
          <View style={styles.logoWrapper}>
            <View style={styles.logoGradient}>
              <BookOpen color="#6366f1" size={50} strokeWidth={2.5} />
            </View>
          </View>
          <Text style={styles.appVersion}>Author</Text>
          <Text style={styles.appName}>MD KHALID</Text>
          <Text style={styles.appVersion}>Application V {version}</Text>
          
          <Text style={styles.appDescription}>
            All eBooks available in this application are carefully designed with clear formatting, color-coded notes, and concise explanations so users can quickly understand important concepts and revise effectively.
          </Text>
        </Animated.View>

        {/* Features Section */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Why Choose Us</Text>
        </View>

        {features.map((feature, index) => (
          <Animated.View 
            key={index} 
            entering={FadeInDown.delay(400 + index * 100).duration(600)} 
            style={styles.featureCard}
          >
            <View style={styles.featureIconWrapper}>
              <feature.icon color="#6366f1" size={24} />
            </View>
            <View style={styles.featureTextWrapper}>
              <Text style={styles.featureTitle}>{feature.title}</Text>
              <Text style={styles.featureDesc}>{feature.desc}</Text>
            </View>
          </Animated.View>
        ))}

        {/* Contact & Social Section */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Get In Touch</Text>
        </View>

        <Animated.View entering={FadeInUp.delay(800).duration(800)} style={styles.socialCard}>
          <TouchableOpacity style={styles.socialItem} onPress={() => handleLink('/')}>
            <Github color="#333" size={22} />
            <Text style={styles.socialLabel}>GitHub</Text>
          </TouchableOpacity>
          <View style={styles.socialSeparator} />
          <TouchableOpacity style={styles.socialItem} onPress={() => router.push('/support')}>
            <Mail color="#6366f1" size={22} />
            <Text style={styles.socialLabel}>Support</Text>
          </TouchableOpacity>
          <View style={styles.socialSeparator} />
          <TouchableOpacity style={styles.socialItem} onPress={() => handleLink('/')}>
            <Globe color="#22c55e" size={22} />
            <Text style={styles.socialLabel}>Website</Text>
          </TouchableOpacity>
        </Animated.View>

        {/* Developer Footer */}
        <Animated.View entering={FadeInUp.delay(1000).duration(800)} style={styles.footer}>
          <Text style={styles.madeWith}>Made with <Heart color="#ef4444" size={14} fill="#ef4444" /> by Khalid</Text>
          <Text style={styles.copyright}>© 2026 E-Book Store. All rights reserved.</Text>
        </Animated.View>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
    backgroundColor: '#fff',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f8f9fa',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1a1a1a',
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  brandingContainer: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 40,
  },
  logoWrapper: {
    width: 100,
    height: 100,
    borderRadius: 30,
    backgroundColor: '#e0e7ff',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    shadowColor: '#6366f1',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 10,
  },
  logoGradient: {
    width: 80,
    height: 80,
    borderRadius: 24,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  appName: {
    fontSize: 24,
    fontWeight: '800',
    color: '#1a1a1a',
    marginBottom: 5,
  },
  appVersion: {
    fontSize: 14,
    color: '#6366f1',
    fontWeight: '600',
    backgroundColor: '#eef2ff',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 20,
  },
  appDescription: {
    fontSize: 15,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 10,
  },
  sectionHeader: {
    marginBottom: 15,
    marginTop: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1a1a1a',
  },
  featureCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    padding: 16,
    borderRadius: 20,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  featureIconWrapper: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  featureTextWrapper: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  featureDesc: {
    fontSize: 13,
    color: '#64748b',
    lineHeight: 18,
  },
  socialCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingVertical: 15,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginTop: 5,
  },
  socialItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  socialLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#475569',
    marginTop: 6,
  },
  socialSeparator: {
    width: 1,
    height: 30,
    backgroundColor: '#e2e8f0',
  },
  footer: {
    marginTop: 50,
    alignItems: 'center',
  },
  madeWith: {
    fontSize: 14,
    color: '#475569',
    fontWeight: '600',
    marginBottom: 8,
  },
  copyright: {
    fontSize: 12,
    color: '#94a3b8',
  },
});
