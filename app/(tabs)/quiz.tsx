import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl, SafeAreaView, TouchableOpacity, Image } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { Brain, Trophy, History, Bookmark, Flame, Settings, ChevronRight } from 'lucide-react-native';
import { fetchQuizzes, QuizItem } from '../../src/services/api';
import { getQuizHistory, getBookmarkedQuestions } from '../../src/services/storage';
import QuizCard from '../../src/components/QuizCard';
import Animated, { FadeInDown } from 'react-native-reanimated';

export default function QuizMainScreen() {
  const [quizzes, setQuizzes] = useState<QuizItem[]>([]);
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const router = useRouter();

  const loadData = async () => {
    setLoading(true);
    const [qData, hData] = await Promise.all([fetchQuizzes(), getQuizHistory()]);
    setQuizzes(qData);
    setHistory(hData);
    setLoading(false);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [])
  );

  const categories = Array.from(new Set(quizzes.map(q => q.category)));
  const dailyQuiz = quizzes.find(q => q.is_daily);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Quiz Zone</Text>
          <Text style={styles.headerSubtitle}>Test your knowledge and earn points</Text>
        </View>

        {dailyQuiz && (
          <Animated.View entering={FadeInDown.delay(100)} style={styles.dailyBanner}>
            <TouchableOpacity 
              style={styles.dailyContent} 
              onPress={() => router.push(`/quiz/start/${dailyQuiz.quiz_id}`)}
              activeOpacity={0.9}
            >
              <View style={styles.dailyTextContainer}>
                <View style={styles.pill}>
                  <Flame size={14} color="#FF9500" />
                  <Text style={styles.pillText}>DAILY CHALLENGE</Text>
                </View>
                <Text style={styles.dailyTitle}>{dailyQuiz.category}</Text>
                <Text style={styles.dailySubtitle}>Answer 10 questions and earn bonus points!</Text>
              </View>
              <Image 
                source={{ uri: 'https://cdn-icons-png.flaticon.com/512/3135/3135810.png' }} 
                style={styles.dailyImage}
              />
            </TouchableOpacity>
          </Animated.View>
        )}

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Categories</Text>
            <TouchableOpacity onPress={() => router.push('/quiz/all')}>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.categoriesGrid}>
            {categories.map((category) => (
              <QuizCard 
                key={category}
                title={category}
                subtitle={`${quizzes.filter(q => q.category === category).length} Quizzes`}
                type="category"
                onPress={() => router.push({
                   pathname: '/quiz/category/[id]',
                   params: { id: category }
                })}
              />
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Browse All Quizzes</Text>
          </View>
          {quizzes.length > 0 && Array.from(new Set(quizzes.map(q => q.quiz_id))).slice(0, 5).map((quizId) => {
            const quizGroup = quizzes.filter(q => q.quiz_id === quizId);
            return (
              <QuizCard 
                key={quizId}
                title={quizGroup[0].subcategory || quizGroup[0].category}
                subtitle={`${quizGroup.length} Questions`}
                type="category"
                stats={{
                  questions: quizGroup.length,
                  difficulty: quizGroup[0].difficulty,
                }}
                onPress={() => router.push({
                   pathname: '/quiz/start/[id]',
                   params: { id: quizId }
                })}
              />
            );
          })}
        </View>

        {history.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Quiz History</Text>
            </View>
            {history.slice(0, 3).map((item, index) => (
              <QuizCard 
                key={item.id}
                title={item.category}
                subtitle={new Date(item.date).toLocaleDateString()}
                type="history"
                stats={{
                  questions: item.totalQuestions,
                  score: `${item.score}/${item.totalPoints}`,
                }}
                onPress={() => {}}
              />
            ))}
          </View>
        )}

        <View style={styles.quickActions}>
          <TouchableOpacity style={styles.actionButton} onPress={() => router.push('/quiz/bookmarks')}>
            <View style={[styles.actionIcon, { backgroundColor: '#E3F2FD' }]}>
               <Bookmark size={24} color="#007AFF" />
            </View>
            <Text style={styles.actionText}>Bookmarks</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionButton} onPress={() => {}}>
            <View style={[styles.actionIcon, { backgroundColor: '#E8F5E9' }]}>
               <Trophy size={24} color="#34C759" />
            </View>
            <Text style={styles.actionText}>Leaderboard</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 10,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1A1A1A',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  dailyBanner: {
    marginHorizontal: 24,
    marginTop: 20,
    marginBottom: 25,
  },
  dailyContent: {
    flexDirection: 'row',
    backgroundColor: '#002E5D',
    borderRadius: 24,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#002E5D',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 15,
    elevation: 8,
  },
  dailyTextContainer: {
    flex: 1,
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 149, 0, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
    alignSelf: 'flex-start',
    marginBottom: 10,
    gap: 4,
  },
  pillText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#FF9500',
  },
  dailyTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#fff',
    marginBottom: 4,
  },
  dailySubtitle: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.7)',
  },
  dailyImage: {
    width: 80,
    height: 80,
    marginLeft: 10,
  },
  section: {
    paddingHorizontal: 24,
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  seeAllText: {
    fontSize: 14,
    color: '#007AFF',
    fontWeight: '600',
  },
  categoriesGrid: {
    // We could use numColumns wrapping, but QuizCard is horizontal row for now
  },
  quickActions: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    marginBottom: 30,
    gap: 15,
  },
  actionButton: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  actionIcon: {
    width: 48,
    height: 48,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  actionText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1A1A1A',
  },
});
