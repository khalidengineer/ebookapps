import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';

const RECENTLY_VIEWED_KEY = 'RECENTLY_VIEWED_PRODUCTS';
const SAVED_PDFS_KEY = 'SAVED_PDFS_METADATA';
const QUIZ_HISTORY_KEY = 'QUIZ_HISTORY_DATA';
const QUIZ_BOOKMARKS_KEY = 'QUIZ_BOOKMARKS_DATA';

export const saveRecentlyViewed = async (product: any) => {
  try {
    const existing = await AsyncStorage.getItem(RECENTLY_VIEWED_KEY);
    const products = existing ? JSON.parse(existing) : [];
    const filtered = products.filter((p: any) => p.id !== product.id);
    const updated = [{ ...product, viewedAt: new Date().toISOString() }, ...filtered].slice(0, 50); // Increased limit to 50
    await AsyncStorage.setItem(RECENTLY_VIEWED_KEY, JSON.stringify(updated));
  } catch (error) {
    console.error('Error saving recently viewed:', error);
  }
};

export const getRecentlyViewed = async () => {
  try {
    const existing = await AsyncStorage.getItem(RECENTLY_VIEWED_KEY);
    return existing ? JSON.parse(existing) : [];
  } catch (error) {
    console.error('Error fetching recently viewed:', error);
    return [];
  }
};

export const clearRecentlyViewed = async () => {
  try {
    await AsyncStorage.removeItem(RECENTLY_VIEWED_KEY);
  } catch (error) {
    console.error('Error clearing recently viewed:', error);
  }
};

export const downloadPDF = async (url: string, filename: string, onUpdate?: (progress: number) => void) => {
  try {
    const fileUri = `${FileSystem.documentDirectory}${filename}`;
    const downloadResumable = FileSystem.createDownloadResumable(
      url,
      fileUri,
      {},
      (downloadProgress) => {
        const progress = downloadProgress.totalBytesWritten / downloadProgress.totalBytesExpectedToWrite;
        if (onUpdate) onUpdate(progress);
      }
    );

    const result = await downloadResumable.downloadAsync();
    return result?.uri;
  } catch (error) {
    console.error('Error downloading PDF:', error);
    return null;
  }
};

export const savePDFMetadata = async (product: any, localUri: string) => {
  try {
    const existing = await AsyncStorage.getItem(SAVED_PDFS_KEY);
    const saved = existing ? JSON.parse(existing) : [];
    const updated = [...saved, { ...product, localUri }];
    await AsyncStorage.setItem(SAVED_PDFS_KEY, JSON.stringify(updated));
  } catch (error) {
    console.error('Error saving PDF metadata:', error);
  }
};

export const getSavedPDFs = async () => {
  try {
    const existing = await AsyncStorage.getItem(SAVED_PDFS_KEY);
    return existing ? JSON.parse(existing) : [];
  } catch (error) {
    console.error('Error fetching saved PDFs:', error);
    return [];
  }
};

export const deleteSavedPDF = async (productId: number, localUri: string) => {
  try {
    await FileSystem.deleteAsync(localUri);
    const existing = await AsyncStorage.getItem(SAVED_PDFS_KEY);
    const saved = existing ? JSON.parse(existing) : [];
    const updated = saved.filter((p: any) => p.id !== productId);
    await AsyncStorage.setItem(SAVED_PDFS_KEY, JSON.stringify(updated));
  } catch (error) {
    console.error('Error deleting PDF:', error);
  }
};

const ONBOARDING_COMPLETED_KEY = 'ONBOARDING_COMPLETED';

export const isOnboardingCompleted = async () => {
  try {
    const value = await AsyncStorage.getItem(ONBOARDING_COMPLETED_KEY);
    return value === 'true';
  } catch (error) {
    console.error('Error checking onboarding status:', error);
    return false;
  }
};

export const setOnboardingCompleted = async () => {
  try {
    await AsyncStorage.setItem(ONBOARDING_COMPLETED_KEY, 'true');
  } catch (error) {
    console.error('Error saving onboarding status:', error);
  }
};

export const saveQuizResult = async (result: any) => {
  try {
    const existing = await AsyncStorage.getItem(QUIZ_HISTORY_KEY);
    const history = existing ? JSON.parse(existing) : [];
    const updated = [{ ...result, id: Date.now(), date: new Date().toISOString() }, ...history].slice(0, 50);
    await AsyncStorage.setItem(QUIZ_HISTORY_KEY, JSON.stringify(updated));
  } catch (error) {
    console.error('Error saving quiz result:', error);
  }
};

export const getQuizHistory = async () => {
  try {
    const existing = await AsyncStorage.getItem(QUIZ_HISTORY_KEY);
    return existing ? JSON.parse(existing) : [];
  } catch (error) {
    console.error('Error fetching quiz history:', error);
    return [];
  }
};

export const toggleBookmarkQuestion = async (question: any) => {
  try {
    const existing = await AsyncStorage.getItem(QUIZ_BOOKMARKS_KEY);
    const bookmarks = existing ? JSON.parse(existing) : [];
    const isBookmarked = bookmarks.find((b: any) => b.quiz_id === question.quiz_id && b.question === question.question);
    
    let updated;
    if (isBookmarked) {
      updated = bookmarks.filter((b: any) => !(b.quiz_id === question.quiz_id && b.question === question.question));
    } else {
      updated = [...bookmarks, { ...question, bookmarkedAt: new Date().toISOString() }];
    }
    
    await AsyncStorage.setItem(QUIZ_BOOKMARKS_KEY, JSON.stringify(updated));
    return !isBookmarked;
  } catch (error) {
    console.error('Error toggling bookmark:', error);
    return false;
  }
};

export const getBookmarkedQuestions = async () => {
  try {
    const existing = await AsyncStorage.getItem(QUIZ_BOOKMARKS_KEY);
    return existing ? JSON.parse(existing) : [];
  } catch (error) {
    console.error('Error fetching bookmarked questions:', error);
    return [];
  }
};
