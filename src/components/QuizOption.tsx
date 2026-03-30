import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import Animated, { 
  useAnimatedStyle, 
  useSharedValue, 
  withSpring, 
  interpolateColor,
  useDerivedValue,
  withTiming,
  Easing
} from 'react-native-reanimated';
import { Check, XCircle } from 'lucide-react-native';

interface QuizOptionProps {
  label: string;
  isSelected?: boolean;
  isCorrect?: boolean;
  isWrong?: boolean;
  disabled?: boolean;
  onPress: () => void;
}

const QuizOption: React.FC<QuizOptionProps> = ({ label, isSelected, isCorrect, isWrong, disabled, onPress }) => {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    backgroundColor: isCorrect 
      ? '#E8F5E9' 
      : isWrong 
      ? '#FFEBEE' 
      : isSelected 
      ? '#E3F2FD' 
      : '#fff',
    borderColor: isCorrect 
      ? '#4CAF50' 
      : isWrong 
      ? '#F44336' 
      : isSelected 
      ? '#2196F3' 
      : '#EEEEEE',
  }));

  const handlePressIn = () => {
    if (!disabled) scale.value = withSpring(0.98);
  };

  const handlePressOut = () => {
    if (!disabled) scale.value = withSpring(1);
  };

  return (
    <Animated.View style={[styles.container, animatedStyle]}>
      <TouchableOpacity 
        style={styles.button}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled}
        activeOpacity={1}
      >
        <Text style={[
          styles.text, 
          isCorrect && styles.correctText,
          isWrong && styles.wrongText,
          isSelected && !isCorrect && !isWrong && styles.selectedText
        ]}>
          {label}
        </Text>
        
        {isCorrect && (
          <View style={[styles.iconContainer, { backgroundColor: '#4CAF50' }]}>
            <Check size={16} color="#fff" />
          </View>
        )}
        
        {isWrong && (
          <View style={[styles.iconContainer, { backgroundColor: '#F44336' }]}>
            <XCircle size={16} color="#fff" />
          </View>
        )}
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    borderWidth: 2,
    marginBottom: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 18,
    minHeight: 65,
  },
  text: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: '#444',
    lineHeight: 22,
  },
  selectedText: {
    color: '#2196F3',
  },
  correctText: {
    color: '#2E7D32',
  },
  wrongText: {
    color: '#C62828',
  },
  iconContainer: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
});

export default QuizOption;
