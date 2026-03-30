import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, SafeAreaView, TouchableOpacity, Image } from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { getBookmarkedQuestions, toggleBookmarkQuestion } from '../../src/services/storage';
import { ArrowLeft, Trash2, Bookmark as BookmarkIcon, HelpCircle, ChevronRight } from 'lucide-react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

export default function BookmarksScreen() {
  const [bookmarks, setBookmarks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const loadBookmarks = async () => {
    const data = await getBookmarkedQuestions();
    setBookmarks(data);
    setLoading(false);
  };

  useEffect(() => {
    loadBookmarks();
  }, []);

  const handleRemove = async (question: any) => {
    await toggleBookmarkQuestion(question);
    loadBookmarks();
  };

  if (bookmarks.length === 0 && !loading) {
    return (
      <SafeAreaView style={styles.container}>
        <Stack.Screen options={{ headerShown: false }} />
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <ArrowLeft size={24} color="#1A1A1A" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Bookmarks</Text>
        </View>
        <View style={styles.emptyContainer}>
          <BookmarkIcon size={80} color="#ccc" />
          <Text style={styles.emptyText}>No bookmarked questions yet.</Text>
          <Text style={styles.emptySubtext}>Questions you bookmark during a quiz will appear here.</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color="#1A1A1A" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Saved Questions</Text>
      </View>

      <FlatList
        data={bookmarks}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={styles.listContent}
        renderItem={({ item, index }) => (
          <Animated.View entering={FadeInDown.delay(index * 100).duration(500)} style={styles.card}>
            <View style={styles.cardHeader}>
              <View style={styles.categoryBadge}>
                <Text style={styles.categoryText}>{item.category}</Text>
              </View>
              <TouchableOpacity onPress={() => handleRemove(item)}>
                <Trash2 size={18} color="#FF3B30" />
              </TouchableOpacity>
            </View>
            
            <Text style={styles.questionText}>{item.question}</Text>
            
            <View style={styles.answerContainer}>
               <Text style={styles.answerLabel}>Correct Answer:</Text>
               <Text style={styles.answerValue}>{item[`option_${item.correct_answer}`]}</Text>
            </View>

            {item.explanation && (
              <View style={styles.explanationBox}>
                <Text style={styles.explanationText}>{item.explanation}</Text>
              </View>
            )}

            <TouchableOpacity 
              style={styles.retryButton} 
              onPress={() => router.push({
                pathname: '/quiz/start/[id]',
                params: { id: item.quiz_id }
              })}
            >
               <Text style={styles.retryText}>Go to Quiz</Text>
               <ChevronRight size={16} color="#007AFF" />
            </TouchableOpacity>
          </Animated.View>
        )}
      />
    </SafeAreaView>
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
  listContent: {
    paddingHorizontal: 24,
    paddingTop: 10,
    paddingBottom: 30,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#F0F0F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  categoryBadge: {
    backgroundColor: '#E3F2FD',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  categoryText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#007AFF',
    textTransform: 'uppercase',
  },
  questionText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1A1A1A',
    lineHeight: 22,
    marginBottom: 15,
  },
  answerContainer: {
    backgroundColor: '#F1F8E9',
    padding: 12,
    borderRadius: 12,
    marginBottom: 10,
  },
  answerLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: '#2E7D32',
    marginBottom: 2,
  },
  answerValue: {
    fontSize: 14,
    color: '#1B5E20',
    fontWeight: '600',
  },
  explanationBox: {
    padding: 10,
    borderLeftWidth: 3,
    borderLeftColor: '#E0E0E0',
    marginBottom: 15,
  },
  explanationText: {
    fontSize: 13,
    color: '#666',
    fontStyle: 'italic',
    lineHeight: 18,
  },
  retryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 4,
  },
  retryText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#007AFF',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1A1A1A',
    marginTop: 20,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginTop: 10,
    lineHeight: 20,
  },
});
