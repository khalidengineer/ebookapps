import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Dimensions } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { usePreventScreenCapture } from 'expo-screen-capture';
import { WebView } from 'react-native-webview';
import { ChevronLeft, Info } from 'lucide-react-native';

export default function PdfViewerScreen() {
  usePreventScreenCapture();
  const { url, title, localPath } = useLocalSearchParams();
  const router = useRouter();
  
  // For Expo Go compatibility, we use Google Docs viewer for remote PDFs
  // If localPath is provided, we can attempt to render that directly (WebView supports local files on some platforms)
  const viewerUrl = localPath 
    ? localPath 
    : `https://docs.google.com/viewer?url=${encodeURIComponent(url as string)}&embedded=true`;

  const handleBack = () => {
    router.back();
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <ChevronLeft color="#333" size={28} />
        </TouchableOpacity>
        <Text style={styles.title} numberOfLines={1}>{title || 'PDF Preview'}</Text>
        <TouchableOpacity style={styles.infoButton}>
          <Info color="#333" size={24} />
        </TouchableOpacity>
      </View>

      <WebView
        source={{ uri: viewerUrl as string }}
        style={styles.webview}
        startInLoadingState={true}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 24,
  },
  header: {
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  backButton: {
    padding: 5,
  },
  title: {
    flex: 1,
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center',
    marginHorizontal: 10,
    color: '#333',
  },
  infoButton: {
    padding: 5,
  },
  webview: {
    flex: 1,
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
});
