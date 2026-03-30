import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Dimensions, Platform, TouchableWithoutFeedback } from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { usePreventScreenCapture } from 'expo-screen-capture';
import { WebView } from 'react-native-webview';
import { ChevronLeft, AlertCircle, Share2 } from 'lucide-react-native';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { StatusBar } from 'expo-status-bar';
import Animated, { FadeIn, FadeOut, SlideInUp, SlideOutUp } from 'react-native-reanimated';

export default function PdfViewerScreen() {
  usePreventScreenCapture();
  const { url, title, localPath } = useLocalSearchParams();
  const [fileExists, setFileExists] = useState<boolean | null>(null);
  const [base64Data, setBase64Data] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [controlsVisible, setControlsVisible] = useState(true);
  const router = useRouter();
  
  useEffect(() => {
    if (localPath) {
      checkFile();
    }
  }, [localPath]);

  // Auto-hide controls after 3.5 seconds
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (controlsVisible && !loading) {
      timer = setTimeout(() => {
        setControlsVisible(false);
      }, 3500);
    }
    return () => clearTimeout(timer);
  }, [controlsVisible, loading]);

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

  const handleShare = async () => {
    const path = localPath as string;
    if (path && await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(path, {
        mimeType: 'application/pdf',
        dialogTitle: title as string,
        UTI: 'com.adobe.pdf'
      });
    } else if (url) {
      await Sharing.shareAsync(url as string);
    }
  };

  const toggleControls = () => {
    setControlsVisible(!controlsVisible);
  };

  const getViewerUrl = () => {
    if (localPath) return localPath as string;
    if (Platform.OS === 'ios') return url as string;
    return `https://docs.google.com/viewer?url=${encodeURIComponent(url as string)}&embedded=true`;
  };

  // Advanced JS for Edge-to-Edge and Paginated Reading
  const injectedJS = `
    (function() {
      const meta = document.createElement('meta');
      meta.name = 'viewport';
      meta.content = 'width=device-width, initial-scale=1.0, maximum-scale=3.0, user-scalable=yes, viewport-fit=cover';
      document.getElementsByTagName('head')[0].appendChild(meta);

      const style = document.createElement('style');
      style.innerHTML = ' * { box-sizing: border-box !important; -webkit-tap-highlight-color: transparent !important; } html, body { width: 100vw !important; height: 100vh !important; background-color: #1a1a1a !important; overflow-x: hidden !important; overflow-y: scroll !important; scroll-snap-type: y mandatory !important; scroll-behavior: smooth !important; -webkit-overflow-scrolling: touch !important; margin: 0 !important; padding: 0 !important; } .ndf-view-container, .ndf-view-container-offset, div[role="page"], .page-container, .pdf-viewer-page { scroll-snap-align: start !important; scroll-snap-stop: always !important; width: 100vw !important; height: 100vh !important; min-height: 100vh !important; display: flex !important; justify-content: center !important; align-items: center !important; background-color: #1a1a1a !important; border: none !important; margin: 0 !important; padding: 0 !important; position: relative !important; overflow: hidden !important; } img, canvas, .ndf-view-container-canvas { max-width: 100vw !important; max-height: 100vh !important; width: auto !important; height: auto !important; object-fit: contain !important; display: block !important; margin: auto !important; padding: 0 !important; } .ndf-footer-container, .ndf-header-container, .ndf-buttons-container, div[role="toolbar"], .ndf-title-container, .doc-info, .ndf-action-bar, .ndf-navigation-bar, .ndf-scroll-shimmer, .ndf-shimmer, .goog-inline-block, .ndf-paged-viewer-footer, .ndf-paged-viewer-header, .ndf-view-container-paged-viewer-navigation-bar, .ndf-view-container-paged-viewer-footer { display: none !important; height: 0 !important; visibility: hidden !important; opacity: 0 !important; pointer-events: none !important; position: absolute !important; left: -9999px !important; } ';
      document.head.appendChild(style);
      
      const selectorsToHide = [
        'div[role="toolbar"]', 
        '.ndf-footer-container', 
        '.ndf-header-container', 
        '.ndf-action-bar', 
        '.ndf-navigation-bar',
        '.ndf-buttons-container',
        '.goog-inline-block',
        '.ndf-shimmer',
        '.ndf-scroll-shimmer',
        '.ndf-paged-viewer-footer',
        '.ndf-paged-viewer-header'
      ];

      const cleanup = () => {
        selectorsToHide.forEach(selector => {
          const els = document.querySelectorAll(selector);
          els.forEach(el => {
            if (el.style.display !== "none") {
              el.style.display = "none";
              el.style.visibility = "hidden";
              el.style.height = "0";
            }
          });
        });
        document.body.style.width = "100vw";
      };

      // Persistent Cleanup with MutationObserver
      const observer = new MutationObserver(cleanup);
      observer.observe(document.body, { childList: true, subtree: true });
      
      // Also run on interval for extra safety
      setInterval(cleanup, 500);
      cleanup();

      document.addEventListener("click", function() {
        window.ReactNativeWebView.postMessage("toggleControls");
      });
    })();
    true;
  `;

  const handleBack = () => {
    router.back();
  };

  return (
    <View style={styles.container}>
      <StatusBar hidden={!controlsVisible} style="light" animated />
      <Stack.Screen options={{ headerShown: false }} />

      <View style={styles.fullscreenWrapper}>
        <View style={styles.contentContainer}>
          {loading ? (
            <View style={styles.loadingContainer}>
              <Animated.View entering={FadeIn} style={styles.loadingBox}>
                <Text style={styles.loadingText}>Preparing your book...</Text>
              </Animated.View>
            </View>
          ) : localPath && fileExists === false ? (
            <View style={styles.errorContainer}>
              <AlertCircle color="#FF3131" size={60} />
              <Text style={styles.errorText}>Oops! Book file not found.</Text>
              <TouchableOpacity style={styles.retryButton} onPress={handleBack}>
                <Text style={styles.retryText}>Return to Library</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <WebView
              source={{ uri: base64Data || getViewerUrl() }}
              style={styles.webview}
              injectedJavaScript={injectedJS}
              onMessage={(event) => {
                if (event.nativeEvent.data === 'toggleControls') {
                  toggleControls();
                }
              }}
              startInLoadingState={true}
              renderLoading={() => (
                <View style={styles.webviewLoading}>
                  <Text style={styles.loadingText}>Loading pages...</Text>
                </View>
              )}
              backgroundColor="#1a1a1a"
              scalesPageToFit={true}
              domStorageEnabled={true}
              javaScriptEnabled={true}
              scrollEnabled={true}
              originWhitelist={['*']}
            />
          )}
        </View>
      </View>

      {/* Header Controls (Overlays) */}
      {controlsVisible && (
        <Animated.View 
          entering={SlideInUp.duration(300)} 
          exiting={SlideOutUp.duration(300)}
          style={styles.header}
        >
          <TouchableOpacity onPress={handleBack} style={styles.iconButton}>
            <ChevronLeft color="#fff" size={28} />
          </TouchableOpacity>
          
          <View style={styles.titleContainer}>
            <Text style={styles.title} numberOfLines={1}>{title || 'Reading'}</Text>
          </View>
          
          <TouchableOpacity onPress={handleShare} style={styles.iconButton}>
            <Share2 color="#fff" size={22} />
          </TouchableOpacity>
        </Animated.View>
      )}

      {/* Hint for first-time use */}
      {controlsVisible && !loading && (
        <Animated.View 
          entering={FadeIn.delay(500)} 
          exiting={FadeOut}
          style={styles.hintContainer}
        >
          <Text style={styles.hintText}>Tap screen to hide/show controls</Text>
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },
  fullscreenWrapper: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: Platform.OS === 'ios' ? 100 : 80,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingTop: Platform.OS === 'ios' ? 40 : 20,
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    zIndex: 100,
  },
  iconButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  titleContainer: {
    flex: 1,
    marginHorizontal: 15,
  },
  title: {
    fontSize: 17,
    fontWeight: '700',
    color: '#fff',
    textAlign: 'center',
  },
  contentContainer: {
    flex: 1,
  },
  webview: {
    flex: 1,
    backgroundColor: '#1a1a1a',
    width: '100%',
    height: '100%',
  },
  webviewLoading: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#1a1a1a',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingBox: {
    padding: 24,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 15,
    color: 'rgba(255, 255, 255, 0.7)',
    fontWeight: '600',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  errorText: {
    fontSize: 20,
    color: '#fff',
    fontWeight: '700',
    marginTop: 20,
    marginBottom: 30,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 30,
  },
  retryText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '700',
  },
  hintContainer: {
    position: 'absolute',
    bottom: 40,
    left: 20,
    right: 20,
    alignItems: 'center',
  },
  hintText: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.4)',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    overflow: 'hidden',
  },
});
