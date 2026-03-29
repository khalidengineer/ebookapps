import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';

const RECENTLY_VIEWED_KEY = 'RECENTLY_VIEWED_PRODUCTS';
const SAVED_PDFS_KEY = 'SAVED_PDFS_METADATA';

export const saveRecentlyViewed = async (product: any) => {
  try {
    const existing = await AsyncStorage.getItem(RECENTLY_VIEWED_KEY);
    const products = existing ? JSON.parse(existing) : [];
    const filtered = products.filter((p: any) => p.id !== product.id);
    const updated = [product, ...filtered].slice(0, 20); // Keep last 20
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
