import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Dimensions } from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { usePreventScreenCapture } from 'expo-screen-capture';
import { WebView } from 'react-native-webview';
import { ChevronLeft, Info, ExternalLink, AlertCircle } from 'lucide-react-native';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';

export default function PdfViewerScreen() {
  usePreventScreenCapture();
  const { url, title, localPath } = useLocalSearchParams();
  const [fileExists, setFileExists] = React.useState<boolean | null>(null);
  const [base64Data, setBase64Data] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);
  const router = useRouter();
  
  React.useEffect(() => {
    if (localPath) {
      checkFile();
    }
  }, [localPath]);

  const checkFile = async () => {
    const info = await FileSystem.getInfoAsync(localPath as string);
    setFileExists(info.exists);
    if (info.exists) {
      loadBase64();
    }
  };

  const loadBase64 = async () => {
    setLoading(true);
    try {
      const base64 = await FileSystem.readAsStringAsync(localPath as string, {
        encoding: FileSystem.EncodingType.Base64,
      });
      setBase64Data(`data:application/pdf;base64,${base64}`);
    } catch (e) {
      console.error('Error loading base64 PDF:', e);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenSystem = async () => {
    if (localPath && await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(localPath as string, {
        mimeType: 'application/pdf',
        dialogTitle: title as string,
        UTI: 'com.adobe.pdf'
      });
    }
  };

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
        {localPath && (
          <TouchableOpacity onPress={handleOpenSystem} style={styles.infoButton}>
            <ExternalLink color="#007AFF" size={20} />
          </TouchableOpacity>
        )}
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Preparing offline preview...</Text>
        </View>
      ) : localPath && fileExists === false ? (
        <View style={styles.errorContainer}>
          <AlertCircle color="#FF3B30" size={48} />
          <Text style={styles.errorText}>File not found or corrupted.</Text>
          <TouchableOpacity style={styles.retryButton} onPress={handleBack}>
            <Text style={styles.retryText}>Back to Library</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <WebView
          source={{ uri: base64Data || viewerUrl as string }}
          style={styles.webview}
          startInLoadingState={true}
          originWhitelist={['*']}
          allowFileAccess={true}
          allowFileAccessFromFileURLs={true}
          allowUniversalAccessFromFileURLs={true}
        />
      )}
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
    padding: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 14,
    color: '#666',
    fontWeight: '600',
  },
  webview: {
    flex: 1,
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
  offlineContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
    backgroundColor: '#F8F9FB',
  },
  offlineInfo: {
    alignItems: 'center',
    marginBottom: 30,
  },
  offlineTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#1A1A1A',
    marginTop: 15,
  },
  offlineSub: {
    fontSize: 14,
    color: '#999',
    marginTop: 5,
  },
  openSystemButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 16,
    paddingHorizontal: 30,
    borderRadius: 16,
    width: '100%',
    alignItems: 'center',
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  openSystemText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '800',
  },
  hintText: {
    fontSize: 12,
    color: '#999',
    marginTop: 20,
    textAlign: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
  },
  errorText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '600',
    marginTop: 15,
    marginBottom: 25,
  },
  retryButton: {
    backgroundColor: '#F0F0F0',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
  },
  retryText: {
    fontSize: 14,
    color: '#333',
    fontWeight: '700',
  },
});
