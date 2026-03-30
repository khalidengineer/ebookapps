import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { Trophy, Home, RotateCcw, CheckCircle2, XCircle, HelpCircle, Share2, Award } from 'lucide-react-native';
import Animated, { FadeInDown, FadeInUp, ZoomIn } from 'react-native-reanimated';

const { width } = Dimensions.get('window');

export default function QuizResultScreen() {
  const { result } = useLocalSearchParams<{ result: string }>();
  const router = useRouter();
  
  const data = result ? JSON.parse(result) : null;

  if (!data) return null;

  const percentage = Math.round((data.score / data.totalPoints) * 100);
  
  const getMessage = () => {
    if (percentage >= 90) return { title: 'Outstanding!', subtitle: 'You are a true expert!', color: '#4CAF50' };
    if (percentage >= 70) return { title: 'Great Job!', subtitle: 'Well done, keeps it up!', color: '#FF9500' };
    if (percentage >= 40) return { title: 'Good Effort!', subtitle: 'You can do better, keep practicing!', color: '#007AFF' };
    return { title: 'Keep Learning!', subtitle: 'Don\'t give up, try again!', color: '#FF3B30' };
  };

  const message = getMessage();

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <Animated.View entering={ZoomIn.duration(800)} style={styles.header}>
           <View style={[styles.awardCircle, { backgroundColor: message.color + '15' }]}>
              <Award size={80} color={message.color} />
           </View>
           <Text style={[styles.resultTitle, { color: message.color }]}>{message.title}</Text>
           <Text style={styles.resultSubtitle}>{message.subtitle}</Text>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(300)} style={styles.scoreCard}>
           <Text style={styles.scoreLabel}>YOUR SCORE</Text>
           <Text style={[styles.scoreValue, { color: message.color }]}>{data.score}</Text>
           <Text style={styles.totalLabel}>out of {data.totalPoints} points</Text>
           
           <View style={styles.accuracyContainer}>
              <View style={styles.accuracyBg}>
                 <View style={[styles.accuracyFill, { width: `${percentage}%`, backgroundColor: message.color }]} />
              </View>
              <Text style={styles.accuracyText}>{percentage}% Accuracy</Text>
           </View>
        </Animated.View>

        <View style={styles.statsGrid}>
           <Animated.View entering={FadeInUp.delay(500)} style={styles.statBox}>
              <CheckCircle2 color="#34C759" size={24} />
              <Text style={styles.statCount}>{data.correct}</Text>
              <Text style={styles.statLabel}>Correct</Text>
           </Animated.View>
           
           <Animated.View entering={FadeInUp.delay(600)} style={styles.statBox}>
              <XCircle color="#FF3B30" size={24} />
              <Text style={styles.statCount}>{data.wrong}</Text>
              <Text style={styles.statLabel}>Wrong</Text>
           </Animated.View>
           
           <Animated.View entering={FadeInUp.delay(700)} style={styles.statBox}>
              <HelpCircle color="#999" size={24} />
              <Text style={styles.statCount}>{data.skipped}</Text>
              <Text style={styles.statLabel}>Skipped</Text>
           </Animated.View>
        </View>

        <View style={styles.buttonRow}>
           <TouchableOpacity 
             style={[styles.btn, styles.btnOutline]} 
             onPress={() => router.replace('/(tabs)/quiz')}
           >
              <Home size={20} color="#007AFF" />
              <Text style={styles.btnTextOutline}>Home</Text>
           </TouchableOpacity>
           
           <TouchableOpacity 
             style={[styles.btn, styles.btnPrimary]} 
             onPress={() => router.replace({
               pathname: '/quiz/start/[id]',
               params: { id: data.quizId }
             })}
           >
              <RotateCcw size={20} color="#fff" />
              <Text style={styles.btnTextPrimary}>Retry</Text>
           </TouchableOpacity>
        </View>
        
        <TouchableOpacity style={styles.shareBtn}>
           <Share2 size={20} color="#666" />
           <Text style={styles.shareText}>Share your achievement</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 40,
    paddingBottom: 40,
    alignItems: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  awardCircle: {
    width: 150,
    height: 150,
    borderRadius: 75,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  resultTitle: {
    fontSize: 28,
    fontWeight: '900',
  },
  resultSubtitle: {
    fontSize: 16,
    color: '#666',
    fontWeight: '600',
    marginTop: 5,
  },
  scoreCard: {
    width: '100%',
    backgroundColor: '#F8F9FA',
    borderRadius: 30,
    padding: 30,
    alignItems: 'center',
    marginBottom: 30,
  },
  scoreLabel: {
    fontSize: 12,
    fontWeight: '800',
    color: '#999',
    letterSpacing: 1.5,
  },
  scoreValue: {
    fontSize: 64,
    fontWeight: '900',
    marginVertical: 10,
  },
  totalLabel: {
    fontSize: 14,
    color: '#666',
    fontWeight: '700',
  },
  accuracyContainer: {
    width: '100%',
    marginTop: 30,
    alignItems: 'center',
  },
  accuracyBg: {
    width: '100%',
    height: 10,
    backgroundColor: '#E0E0E0',
    borderRadius: 5,
    overflow: 'hidden',
    marginBottom: 10,
  },
  accuracyFill: {
    height: '100%',
    borderRadius: 5,
  },
  accuracyText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#1A1A1A',
  },
  statsGrid: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    marginBottom: 40,
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#F0F0F0',
    marginHorizontal: 5,
  },
  statCount: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1A1A1A',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    fontWeight: '600',
  },
  buttonRow: {
    flexDirection: 'row',
    width: '100%',
    gap: 15,
  },
  btn: {
    flex: 1,
    height: 60,
    borderRadius: 20,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
  },
  btnPrimary: {
    backgroundColor: '#007AFF',
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 8,
  },
  btnOutline: {
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#007AFF',
  },
  btnTextPrimary: {
    fontSize: 16,
    fontWeight: '800',
    color: '#fff',
  },
  btnTextOutline: {
    fontSize: 16,
    fontWeight: '800',
    color: '#007AFF',
  },
  shareBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 30,
    gap: 8,
  },
  shareText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '700',
  },
});
