import React, { useState, useEffect, useCallback, useRef } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Image, ScrollView, Modal, Dimensions } from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { fetchQuizzes, QuizItem } from '../../../src/services/api';
import { saveQuizResult, toggleBookmarkQuestion, getBookmarkedQuestions } from '../../../src/services/storage';
import { X, Bookmark, HelpCircle, Timer, ChevronRight, CheckCircle2, AlertCircle, Trophy } from 'lucide-react-native';
import QuizOption from '../../../src/components/QuizOption';
import Animated, { 
  FadeInRight, 
  FadeOutLeft, 
  LinearTransition, 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming,
  Easing,
  FadeInUp
} from 'react-native-reanimated';

const { width } = Dimensions.get('window');

export default function QuizPlayScreen() {
  const { id: quizId } = useLocalSearchParams<{ id: string }>();
  const [questions, setQuestions] = useState<QuizItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [score, setScore] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  const [isAnswered, setIsAnswered] = useState(false);
  const [bookmarks, setBookmarks] = useState<number[]>([]);
  const [stats, setStats] = useState({
    correct: 0,
    wrong: 0,
    skipped: 0,
  });

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const router = useRouter();
  const progress = useSharedValue(0);

  // Load Quiz Data
  useEffect(() => {
    const loadData = async () => {
      const allQuizzes = await fetchQuizzes();
      let relevant = allQuizzes.filter(q => q.quiz_id.toString() === quizId);
      
      // Shuffle logic if needed (optional)
      relevant = relevant.sort(() => Math.random() - 0.5);
      
      setQuestions(relevant);
      const bks = await getBookmarkedQuestions();
      setBookmarks(bks.map((b: any) => b.quiz_id));
      setLoading(false);
      
      if (relevant.length > 0) {
        setTimeLeft(relevant[0].timer || 30);
        startTimer();
      }
    };
    loadData();
    return () => stopTimer();
  }, [quizId]);

  // Timer Logic
  const startTimer = useCallback(() => {
    stopTimer();
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          handleAutoNext();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, []);

  const stopTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
  }, []);

  const handleAutoNext = () => {
    if (!isAnswered) {
      setStats(prev => ({ ...prev, skipped: prev.skipped + 1 }));
      handleNext();
    }
  };

  const handleOptionSelect = (option: string) => {
    if (isAnswered) return;
    
    stopTimer();
    setSelectedOption(option);
    setIsAnswered(true);
    
    const currentQ = questions[currentIndex];
    const isCorrect = option.toLowerCase() === currentQ.correct_answer.toLowerCase();
    
    if (isCorrect) {
      setScore(prev => prev + (currentQ.points || 1));
      setStats(prev => ({ ...prev, correct: prev.correct + 1 }));
    } else {
      setScore(prev => prev - (currentQ.negative_marks || 0));
      setStats(prev => ({ ...prev, wrong: prev.wrong + 1 }));
    }
    
    setShowExplanation(true);
  };

  const handleNext = () => {
    setShowExplanation(false);
    setIsAnswered(false);
    setSelectedOption(null);
    
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setTimeLeft(questions[currentIndex + 1].timer || 30);
      progress.value = withTiming((currentIndex + 1) / questions.length, { duration: 500 });
      startTimer();
    } else {
      finishQuiz();
    }
  };

  const finishQuiz = async () => {
     stopTimer();
     const result = {
       quizId,
       category: questions[0].category,
       score,
       totalPoints: questions.reduce((acc, q) => acc + (q.points || 1), 0),
       totalQuestions: questions.length,
       correct: stats.correct,
       wrong: stats.wrong,
       skipped: stats.skipped,
     };
     await saveQuizResult(result);
     router.replace({
       pathname: '/quiz/result',
       params: { result: JSON.stringify(result) }
     });
  };

  const handleBookmark = async () => {
    const currentQ = questions[currentIndex];
    const bookmarked = await toggleBookmarkQuestion(currentQ);
    if (bookmarked) {
      setBookmarks(prev => [...prev, currentQ.quiz_id]);
    } else {
      setBookmarks(prev => prev.filter(id => id !== currentQ.quiz_id));
    }
  };

  const quitQuiz = () => {
    stopTimer();
    router.back();
  };

  if (loading || questions.length === 0) {
    return <View style={styles.loaderContainer}><Text>Loading...</Text></View>;
  }

  const currentQuestion = questions[currentIndex];
  const progressWidth = ((currentIndex + 1) / questions.length) * 100;

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={quitQuiz} style={styles.closeButton}>
          <X size={24} color="#1A1A1A" />
        </TouchableOpacity>
        
        <View style={styles.progressContainer}>
           <View style={styles.progressBarBg}>
              <Animated.View style={[styles.progressBarFill, { width: `${progressWidth}%` }]} />
           </View>
           <Text style={styles.progressText}>Question {currentIndex + 1}/{questions.length}</Text>
        </View>

        <TouchableOpacity onPress={handleBookmark} style={styles.bookmarkButton}>
          <Bookmark 
            size={24} 
            color={bookmarks.includes(currentQuestion.quiz_id) ? "#007AFF" : "#1A1A1A"} 
            fill={bookmarks.includes(currentQuestion.quiz_id) ? "#007AFF" : "none"}
          />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Timer & Score Row */}
        <View style={styles.infoRow}>
           <View style={[styles.infoBadge, timeLeft < 10 && styles.warningBadge]}>
              <Timer size={16} color={timeLeft < 10 ? "#FF3B30" : "#007AFF"} />
              <Text style={[styles.infoValue, timeLeft < 10 && styles.warningText]}>{timeLeft}s</Text>
           </View>
           <View style={styles.infoBadge}>
              <Trophy size={16} color="#34C759" />
              <Text style={styles.infoValue}>Score: {score}</Text>
           </View>
        </View>

        {/* Question Card */}
        <Animated.View 
          key={currentIndex} 
          entering={FadeInRight.duration(400)} 
          exiting={FadeOutLeft.duration(400)}
          style={styles.questionCard}
        >
          {currentQuestion.image_url && (
            <Image source={{ uri: currentQuestion.image_url }} style={styles.questionImage} />
          )}
          <Text style={styles.questionText}>{currentQuestion.question}</Text>
          
          <View style={styles.optionsContainer}>
            {['a', 'b', 'c', 'd'].map((opt) => {
              const label = currentQuestion[`option_${opt}` as keyof QuizItem] as string;
              if (!label) return null;
              
              const isSelected = selectedOption === opt;
              const isCorrect = isAnswered && opt === currentQuestion.correct_answer;
              const isWrong = isAnswered && isSelected && opt !== currentQuestion.correct_answer;

              return (
                <QuizOption 
                  key={opt}
                  label={label}
                  isSelected={isSelected}
                  isCorrect={isCorrect}
                  isWrong={isWrong}
                  disabled={isAnswered}
                  onPress={() => handleOptionSelect(opt)}
                />
              );
            })}
          </View>
        </Animated.View>
      </ScrollView>

      {/* Footer / Explanation Sidebar */}
      {isAnswered && (
        <Animated.View entering={FadeInUp.duration(500)} style={styles.explanationFooter}>
          <View style={styles.explanationHeader}>
             <View style={styles.resultIndicator}>
                {selectedOption === currentQuestion.correct_answer ? (
                   <CheckCircle2 color="#34C759" size={24} />
                ) : (
                   <AlertCircle color="#FF3B30" size={24} />
                )}
                <Text style={[
                  styles.resultText, 
                  { color: selectedOption === currentQuestion.correct_answer ? "#34C759" : "#FF3B30" }
                ]}>
                  {selectedOption === currentQuestion.correct_answer ? 'Correct Answer!' : 'Wrong Answer!'}
                </Text>
             </View>
             <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
                <Text style={styles.nextButtonText}>Next</Text>
                <ChevronRight size={20} color="#fff" />
             </TouchableOpacity>
          </View>
          
          {currentQuestion.explanation && (
            <View style={styles.explanationBody}>
               <Text style={styles.explanationTitle}>Explanation:</Text>
               <Text style={styles.explanationText}>{currentQuestion.explanation}</Text>
            </View>
          )}
        </Animated.View>
      )}
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
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 15,
  },
  closeButton: {
    padding: 8,
  },
  progressContainer: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 15,
  },
  progressBarBg: {
    width: '100%',
    height: 6,
    backgroundColor: '#F0F0F0',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#007AFF',
  },
  progressText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#666',
    marginTop: 6,
  },
  bookmarkButton: {
    padding: 8,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 200,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 15,
  },
  infoBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    gap: 6,
    borderWidth: 1,
    borderColor: '#eee',
  },
  warningBadge: {
    backgroundColor: '#FFF0F0',
    borderColor: '#FFE0E0',
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '800',
    color: '#007AFF',
  },
  warningText: {
    color: '#FF3B30',
  },
  questionCard: {
    marginTop: 10,
  },
  questionImage: {
    width: '100%',
    height: 180,
    borderRadius: 20,
    marginBottom: 20,
    backgroundColor: '#F8F9FA',
  },
  questionText: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1A1A1A',
    lineHeight: 28,
    marginBottom: 25,
  },
  optionsContainer: {
    gap: 5,
  },
  explanationFooter: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    padding: 24,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 20,
  },
  explanationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  resultIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  resultText: {
    fontSize: 18,
    fontWeight: '800',
  },
  nextButton: {
    backgroundColor: '#007AFF',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 15,
    gap: 5,
  },
  nextButtonText: {
    color: '#fff',
    fontWeight: '800',
    fontSize: 16,
  },
  explanationBody: {
    backgroundColor: '#F8F9FA',
    padding: 15,
    borderRadius: 15,
  },
  explanationTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#1A1A1A',
    marginBottom: 5,
  },
  explanationText: {
    fontSize: 13,
    color: '#666',
    lineHeight: 18,
    fontWeight: '500',
  },
});
