import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView, Image } from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { fetchQuizzes, QuizItem } from '../../../src/services/api';
import { ArrowLeft, Clock, HelpCircle, Trophy, Play, CheckCircle2 } from 'lucide-react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';

export default function QuizStartScreen() {
  const { id: quizId } = useLocalSearchParams<{ id: string }>();
  const [quizData, setQuizData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const loadData = async () => {
      const allQuizzes = await fetchQuizzes();
      const relevant = allQuizzes.filter(q => q.quiz_id.toString() === quizId);
      
      if (relevant.length > 0) {
        setQuizData({
          id: quizId,
          title: relevant[0].subcategory || relevant[0].category,
          category: relevant[0].category,
          difficulty: relevant[0].difficulty,
          totalQuestions: relevant.length,
          totalTime: relevant.reduce((acc, curr) => acc + (curr.timer || 30), 0),
          totalPoints: relevant.reduce((acc, curr) => acc + (curr.points || 1), 0),
          questions: relevant,
        });
      }
      setLoading(false);
    };
    loadData();
  }, [quizId]);

  if (loading || !quizData) {
    return (
      <View style={styles.loaderContainer}>
        <Text>Loading quiz details...</Text>
      </View>
    );
  }

  const rules = [
    { id: 1, text: `Total ${quizData.totalQuestions} questions.` },
    { id: 2, text: `Each question has a specific timer.` },
    { id: 3, text: `Positive marking: ${quizData.questions[0].points} points per correct answer.` },
    { id: 4, text: `Negative marking: ${quizData.questions[0].negative_marks || 0} points for wrong answers.` },
    { id: 5, text: `Auto-next when the timer expires.` },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color="#1A1A1A" />
        </TouchableOpacity>

        <Animated.View entering={FadeInDown.duration(800).springify()} style={styles.content}>
          <View style={styles.iconWrapper}>
             <Image 
                source={{ uri: 'https://cdn-icons-png.flaticon.com/512/3135/3135810.png' }} 
                style={styles.mainImage}
             />
          </View>
          
          <Text style={styles.title}>{quizData.title}</Text>
          <Text style={styles.category}>{quizData.category}</Text>
          
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <View style={[styles.statIcon, { backgroundColor: '#E3F2FD' }]}>
                <HelpCircle size={20} color="#007AFF" />
              </View>
              <Text style={styles.statValue}>{quizData.totalQuestions}</Text>
              <Text style={styles.statLabel}>Questions</Text>
            </View>
            
            <View style={styles.statItem}>
              <View style={[styles.statIcon, { backgroundColor: '#FFF9E6' }]}>
                <Clock size={20} color="#FF9500" />
              </View>
              <Text style={styles.statValue}>{Math.round(quizData.totalTime / 60)}m</Text>
              <Text style={styles.statLabel}>Total Time</Text>
            </View>
            
            <View style={styles.statItem}>
              <View style={[styles.statIcon, { backgroundColor: '#E8F5E9' }]}>
                <Trophy size={20} color="#34C759" />
              </View>
              <Text style={styles.statValue}>{quizData.totalPoints}</Text>
              <Text style={styles.statLabel}>Points</Text>
            </View>
          </View>

          <View style={styles.rulesSection}>
            <Text style={styles.rulesTitle}>Quiz Rules</Text>
            {rules.map((rule) => (
              <View key={rule.id} style={styles.ruleLine}>
                <CheckCircle2 size={16} color="#34C759" />
                <Text style={styles.ruleText}>{rule.text}</Text>
              </View>
            ))}
          </View>
        </Animated.View>
      </ScrollView>

      <Animated.View entering={FadeInUp.delay(500)} style={styles.footer}>
        <TouchableOpacity 
          style={styles.startButton} 
          onPress={() => router.push({
            pathname: '/quiz/play/[id]',
            params: { id: quizId }
          })}
        >
          <Text style={styles.startButtonText}>Start Quiz</Text>
          <Play size={20} color="#fff" fill="#fff" />
        </TouchableOpacity>
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 120,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: '#F8F9FA',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
  },
  content: {
    alignItems: 'center',
  },
  iconWrapper: {
    marginBottom: 20,
  },
  mainImage: {
    width: 120,
    height: 120,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: '#1A1A1A',
    textAlign: 'center',
  },
  category: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: '700',
    marginTop: 5,
    textTransform: 'uppercase',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 35,
    padding: 20,
    backgroundColor: '#F8F9FA',
    borderRadius: 24,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  statValue: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1A1A1A',
  },
  statLabel: {
    fontSize: 11,
    color: '#666',
    fontWeight: '600',
  },
  rulesSection: {
    width: '100%',
    marginTop: 35,
  },
  rulesTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1A1A1A',
    marginBottom: 15,
  },
  ruleLine: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 10,
  },
  ruleText: {
    fontSize: 14,
    color: '#444',
    fontWeight: '600',
    lineHeight: 20,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 24,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderColor: '#F0F0F0',
  },
  startButton: {
    backgroundColor: '#007AFF',
    flexDirection: 'row',
    height: 60,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 8,
  },
  startButtonText: {
    fontSize: 18,
    fontWeight: '800',
    color: '#fff',
  },
});
