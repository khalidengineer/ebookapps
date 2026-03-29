import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { Folder, ChevronRight } from 'lucide-react-native';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';

interface CategoryFolderProps {
  title: string;
  onPress: () => void;
  count?: number;
  color?: string;
}

const CategoryFolder: React.FC<CategoryFolderProps> = ({ title, onPress, count, color = "#007AFF" }) => {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.92);
  };

  const handlePressOut = () => {
    scale.value = withSpring(1);
  };

  return (
    <Animated.View style={[styles.container, animatedStyle]}>
      <TouchableOpacity 
        onPress={onPress} 
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={1}
        style={styles.touchable}
      >
        <View style={[styles.iconContainer, { backgroundColor: color + '10' }]}>
          <Folder size={26} color={color} fill={color + '15'} />
        </View>
        <Text style={styles.title} numberOfLines={2}>{title}</Text>
        {count !== undefined && (
          <Text style={styles.countText}>{count} items</Text>
        )}
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '31%',
    aspectRatio: 1,
    backgroundColor: '#FFF',
    borderRadius: 24,
    marginBottom: 12,
    marginRight: '2%',
    borderWidth: 1,
    borderColor: '#F0F0F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  touchable: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
  },
  iconContainer: {
    width: 52,
    height: 52,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
  },
  title: {
    fontSize: 12,
    fontWeight: '800',
    color: '#1A1A1A',
    textAlign: 'center',
    lineHeight: 14,
    textTransform: 'capitalize',
  },
  countText: {
    fontSize: 10,
    color: '#999',
    marginTop: 2,
  },
});

export default CategoryFolder;
