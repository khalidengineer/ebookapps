import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Animated, { FadeInRight } from 'react-native-reanimated';
import { ChevronRight, Brain, Clock, HelpCircle, Trophy } from 'lucide-react-native';

interface QuizCardProps {
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  onPress: () => void;
  type: 'category' | 'history' | 'daily';
  stats?: {
    questions?: number;
    score?: string;
    difficulty?: string;
  };
}

const QuizCard: React.FC<QuizCardProps> = ({ title, subtitle, icon, onPress, type, stats }) => {
  const getIcon = () => {
    if (icon) return icon;
    switch (type) {
      case 'daily': return <Trophy size={24} color="#FFD700" />;
      case 'history': return <Clock size={24} color="#007AFF" />;
      default: return <Brain size={24} color="#007AFF" />;
    }
  };

  const getBackgroundColor = () => {
    switch (type) {
      case 'daily': return '#FFF9E6';
      default: return '#fff';
    }
  };

  return (
    <Animated.View entering={FadeInRight.duration(400)}>
      <TouchableOpacity 
        style={[styles.card, { backgroundColor: getBackgroundColor() }]} 
        onPress={onPress}
        activeOpacity={0.7}
      >
        <View style={styles.iconContainer}>
          {getIcon()}
        </View>
        
        <View style={styles.content}>
          <Text style={styles.title} numberOfLines={1}>{title}</Text>
          {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
          
          {stats && (
             <View style={styles.statsContainer}>
               {stats.questions !== undefined && (
                 <View style={styles.stat}>
                   <HelpCircle size={12} color="#666" />
                   <Text style={styles.statText}>{stats.questions} Qs</Text>
                 </View>
               )}
               {stats.score !== undefined && (
                 <View style={[styles.stat, styles.scoreStat]}>
                   <Trophy size={12} color="#34C759" />
                   <Text style={[styles.statText, styles.scoreText]}>{stats.score}</Text>
                 </View>
               )}
               {stats.difficulty && (
                 <View style={styles.stat}>
                   <View style={[styles.indicator, { backgroundColor: getDifficultyColor(stats.difficulty) }]} />
                   <Text style={styles.statText}>{stats.difficulty}</Text>
                 </View>
               )}
             </View>
          )}
        </View>
        
        <ChevronRight size={20} color="#ccc" />
      </TouchableOpacity>
    </Animated.View>
  );
};

const getDifficultyColor = (d: string) => {
  switch (d.toLowerCase()) {
    case 'easy': return '#34C759';
    case 'medium': return '#FF9500';
    case 'hard': return '#FF3B30';
    default: return '#007AFF';
  }
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 20,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#F0F0F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 15,
    backgroundColor: 'rgba(0, 122, 255, 0.05)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  subtitle: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  statsContainer: {
    flexDirection: 'row',
    marginTop: 8,
    gap: 12,
  },
  stat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statText: {
    fontSize: 11,
    color: '#666',
    fontWeight: '600',
  },
  scoreStat: {
    backgroundColor: 'rgba(52, 199, 89, 0.1)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  scoreText: {
    color: '#34C759',
  },
  indicator: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
});

export default QuizCard;
