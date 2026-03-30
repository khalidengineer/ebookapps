import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, SafeAreaView, TouchableOpacity, ScrollView, TextInput } from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { fetchQuizzes, QuizItem } from '../../src/services/api';
import QuizCard from '../../src/components/QuizCard';
import { ArrowLeft, Search, Filter, Loader2 } from 'lucide-react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

export default function AllQuizzesScreen() {
  const [quizzes, setQuizzes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [difficulty, setDifficulty] = useState<'All' | 'Easy' | 'Medium' | 'Hard'>('All');
  const router = useRouter();

  useEffect(() => {
    const loadData = async () => {
      const allData = await fetchQuizzes();
      
      // Group by quiz_id
      const grouped = allData.reduce((acc: any, curr) => {
        if (!acc[curr.quiz_id]) {
          acc[curr.quiz_id] = {
            id: curr.quiz_id,
            title: curr.subcategory || curr.category,
            category: curr.category,
            difficulty: curr.difficulty,
            questions: [],
          };
        }
        acc[curr.quiz_id].questions.push(curr);
        return acc;
      }, {});
      
      setQuizzes(Object.values(grouped));
      setLoading(false);
    };
    loadData();
  }, []);

  const filteredQuizzes = quizzes.filter(q => {
    const matchesSearch = q.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          q.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDifficulty = difficulty === 'All' || q.difficulty === difficulty;
    return matchesSearch && matchesDifficulty;
  });

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <Loader2 color="#007AFF" size={40} />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color="#1A1A1A" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>All Quizzes</Text>
      </View>

      <View style={styles.searchBarContainer}>
        <View style={styles.searchBar}>
          <Search size={20} color="#999" />
          <TextInput 
            placeholder="Search quizzes or topics..." 
            style={styles.searchInput}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      <View style={styles.filterContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterScroll}>
          {['All', 'Easy', 'Medium', 'Hard'].map((d) => (
            <TouchableOpacity 
              key={d} 
              onPress={() => setDifficulty(d as any)}
              style={[styles.filterPill, difficulty === d && styles.activeFilterPill]}
            >
              <Text style={[styles.filterText, difficulty === d && styles.activeFilterText]}>{d}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <FlatList
        data={filteredQuizzes}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContent}
        renderItem={({ item, index }) => (
          <QuizCard 
            title={item.title}
            subtitle={`${item.questions.length} Questions`}
            type="category"
            stats={{
              questions: item.questions.length,
              difficulty: item.difficulty,
            }}
            onPress={() => router.push({
               pathname: '/quiz/start/[id]',
               params: { id: item.id }
            })}
          />
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No quizzes match your criteria.</Text>
          </View>
        }
      />
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 15,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#F8F9FA',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#1A1A1A',
  },
  searchBarContainer: {
    paddingHorizontal: 24,
    marginBottom: 15,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    paddingHorizontal: 15,
    height: 50,
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
    color: '#1A1A1A',
  },
  filterContainer: {
    marginBottom: 15,
  },
  filterScroll: {
    paddingHorizontal: 24,
    gap: 10,
  },
  filterPill: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: '#F8F9FA',
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  activeFilterPill: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  filterText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#666',
  },
  activeFilterText: {
    color: '#fff',
  },
  listContent: {
    paddingHorizontal: 24,
    paddingBottom: 30,
  },
  emptyContainer: {
    marginTop: 100,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
  },
});
