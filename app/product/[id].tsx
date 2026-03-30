import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, Image, ScrollView, TouchableOpacity, ActivityIndicator, Share, Alert, Modal, FlatList } from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { ChevronLeft, Download, Eye, Share2, Bookmark, CheckCircle2, Brain, ChevronRight, FileText } from 'lucide-react-native';
import { fetchProducts, Product, fetchQuizzes, fetchPastPapers, PastPaper } from '../../src/services/api';
import { saveRecentlyViewed, downloadPDF, savePDFMetadata, getSavedPDFs } from '../../src/services/storage';
import Animated, { FadeInUp } from 'react-native-reanimated';

export default function ProductDetailScreen() {
  const { id } = useLocalSearchParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [relatedQuizzes, setRelatedQuizzes] = useState<any[]>([]);
  const [pastPapers, setPastPapers] = useState<PastPaper[]>([]);
  const [showQuizModal, setShowQuizModal] = useState(false);
  const [showPapersModal, setShowPapersModal] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const loadProduct = async () => {
      const products = await fetchProducts();
      const found = products.find(p => p.id.toString() === id);
      if (found) {
        setProduct(found);
        saveRecentlyViewed(found);
        // Find all matching quizzes
        const allQuizzes = await fetchQuizzes();
        const matches = allQuizzes.filter(q => 
          q.book_id?.toString() === found.id.toString() || 
          q.quiz_id.toString() === found.id.toString()
        );
        
        // Group by unique quiz_id
        const uniqueGroups = Object.values(matches.reduce((acc: any, curr) => {
          if (!acc[curr.quiz_id]) {
            acc[curr.quiz_id] = {
              id: curr.quiz_id,
              title: curr.subcategory || `${curr.category} Quiz`,
              questions: 0,
              difficulty: curr.difficulty,
            };
          }
          acc[curr.quiz_id].questions++;
          return acc;
        }, {}));
        
        setRelatedQuizzes(uniqueGroups);
        
        // Find matching past papers
        const allPapers = await fetchPastPapers();
        const relatedPapers = allPapers.filter(p => p.book_id.toString() === found.id.toString());
        setPastPapers(relatedPapers);
      }
      setLoading(false);
    };
    loadProduct();
  }, [id]);

  const handleShare = async () => {
    if (!product) return;
    try {
      await Share.share({
        message: `Check out this E-book: ${product.product_name}\n${product.pdf_link}`,
        title: product.product_name,
      });
    } catch (error) {
      console.error(error);
    }
  };

  const handleDownload = async () => {
    if (!product || downloading || isSaved) return;
    setDownloading(true);
    const filename = `${product.product_name.replace(/\s+/g, '_')}_${product.id}.pdf`;
    const uri = await downloadPDF(product.pdf_link, filename);
    if (uri) {
      await savePDFMetadata(product, uri);
      setIsSaved(true);
      Alert.alert('Success', 'PDF downloaded for offline use.');
    } else {
      Alert.alert('Error', 'Failed to download PDF.');
    }
    setDownloading(false);
  };

  const handlePreview = () => {
    if (!product) return;
    router.push({
      pathname: '/pdf-viewer',
      params: { url: product.pdf_link, title: product.product_name }
    });
  };

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  if (!product) {
    return (
      <View style={styles.loaderContainer}>
        <Text>Product not found.</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { paddingTop: 24 }]}>
      <Stack.Screen options={{ 
        headerShown: false, 
      }} />

      <ScrollView showsVerticalScrollIndicator={false}>
        <Image style={styles.thumbnail} source={{ uri: product.thumbnail_url }} resizeMode="cover" />
        
        <View style={styles.content}>
          <View style={styles.header}>
            <View>
              <Text style={styles.category}>{product.category} › {product.subcategory}</Text>
              <Text style={styles.title}>{product.product_name}</Text>
            </View>
            <Text style={styles.price}>${product.price}</Text>
          </View>

          <View style={styles.divider} />

          <Text style={styles.sectionTitle}>About this E-book</Text>
          <Text style={styles.description}>{product.description}</Text>

          <View style={styles.infoRow}>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Format</Text>
              <Text style={styles.infoValue}>PDF</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Access</Text>
              <Text style={styles.infoValue}>Life-time</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footerGrid}>
        <TouchableOpacity 
          style={[styles.gridButton, styles.previewButton]} 
          onPress={handlePreview}
        >
          <Eye color="#333" size={20} />
          <Text style={styles.gridButtonText}>Read</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.gridButton, styles.papersButton]} 
          onPress={() => {
            if (pastPapers.length === 1) {
              router.push({
                pathname: '/pdf-viewer',
                params: { url: pastPapers[0].pdf_url, title: pastPapers[0].title }
              });
            } else if (pastPapers.length > 1) {
              setShowPapersModal(true);
            } else {
              Alert.alert("Coming Soon", "Past papers for this book will be added soon!");
            }
          }}
        >
          <FileText color="#fff" size={20} />
          <Text style={[styles.gridButtonText, { color: '#fff' }]}>Past Papers</Text>
        </TouchableOpacity>

        {relatedQuizzes.length > 0 ? (
          <TouchableOpacity 
            style={[styles.gridButton, styles.quizFooterButton]} 
            onPress={() => {
              if (relatedQuizzes.length === 1) {
                router.push({
                   pathname: '/quiz/start/[id]',
                   params: { id: relatedQuizzes[0].id }
                });
              } else {
                setShowQuizModal(true);
              }
            }}
          >
            <Brain color="#fff" size={20} />
            <Text style={[styles.gridButtonText, { color: '#fff' }]}>Quiz</Text>
          </TouchableOpacity>
        ) : (
          <View style={[styles.gridButton, styles.disabledButton]}>
             <Brain color="#999" size={20} />
             <Text style={[styles.gridButtonText, { color: '#999' }]}>No Quiz</Text>
          </View>
        )}

        <TouchableOpacity 
          style={[styles.gridButton, styles.downloadButton, (isSaved || downloading) && styles.disabledButton]} 
          onPress={handleDownload}
          disabled={isSaved || downloading}
        >
          {downloading ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : isSaved ? (
            <>
              <CheckCircle2 color="#fff" size={20} />
              <Text style={[styles.gridButtonText, { color: '#fff' }]}>Saved</Text>
            </>
          ) : (
            <>
              <Download color="#fff" size={20} />
              <Text style={[styles.gridButtonText, { color: '#fff' }]}>Save</Text>
            </>
          )}
        </TouchableOpacity>
      </View>

      {/* Multi-Quiz Selection Modal */}
      <Modal
        visible={showQuizModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowQuizModal(false)}
      >
        <View style={styles.modalOverlay}>
          <TouchableOpacity 
            style={styles.modalDismiss} 
            onPress={() => setShowQuizModal(false)} 
          />
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Choose a Quiz</Text>
              <TouchableOpacity onPress={() => setShowQuizModal(false)}>
                <Text style={styles.closeModalText}>Cancel</Text>
              </TouchableOpacity>
            </View>
            <FlatList
              data={relatedQuizzes}
              keyExtractor={(item) => item.id.toString()}
              contentContainerStyle={styles.modalList}
              renderItem={({ item }) => (
                <TouchableOpacity 
                  style={styles.quizListItem}
                  activeOpacity={0.7}
                  onPress={() => {
                    setShowQuizModal(false);
                    setTimeout(() => {
                      router.push({
                        pathname: '/quiz/start/[id]',
                        params: { id: item.id }
                      });
                    }, 100);
                  }}
                >
                   <View style={styles.quizListIcon}>
                     <Brain size={22} color="#007AFF" />
                   </View>
                   <View style={{ flex: 1 }}>
                     <Text style={styles.quizListTitle} numberOfLines={1}>{item.title}</Text>
                     <View style={styles.quizListMetaRow}>
                        <Text style={styles.quizListMeta}>{item.questions} Questions</Text>
                        <View style={styles.dot} />
                        <Text style={[styles.quizListMeta, { color: '#007AFF' }]}>{item.difficulty}</Text>
                     </View>
                   </View>
                   <View style={styles.startBadge}>
                      <Text style={styles.startBadgeText}>START</Text>
                   </View>
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </Modal>

      {/* Past Papers Selection Modal */}
      <Modal
        visible={showPapersModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowPapersModal(false)}
      >
        <View style={styles.modalOverlay}>
          <TouchableOpacity 
            style={styles.modalDismiss} 
            onPress={() => setShowPapersModal(false)} 
          />
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Past Papers</Text>
              <TouchableOpacity onPress={() => setShowPapersModal(false)}>
                <Text style={styles.closeModalText}>Cancel</Text>
              </TouchableOpacity>
            </View>
            <FlatList
              data={pastPapers}
              keyExtractor={(item) => item.id.toString()}
              contentContainerStyle={styles.modalList}
              renderItem={({ item }) => (
                <TouchableOpacity 
                  style={styles.quizListItem}
                  activeOpacity={0.7}
                  onPress={() => {
                    setShowPapersModal(false);
                    router.push({
                      pathname: '/pdf-viewer',
                      params: { url: item.pdf_url, title: item.title }
                    });
                  }}
                >
                   <View style={[styles.quizListIcon, { backgroundColor: '#F3E5F5' }]}>
                     <FileText size={22} color="#9C27B0" />
                   </View>
                   <View style={{ flex: 1 }}>
                     <Text style={styles.quizListTitle} numberOfLines={1}>{item.title}</Text>
                     <Text style={styles.quizListMeta}>PDF Document</Text>
                   </View>
                   <View style={[styles.startBadge, { backgroundColor: '#F3E5F5' }]}>
                      <Text style={[styles.startBadgeText, { color: '#9C27B0' }]}>VIEW</Text>
                   </View>
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </Modal>
    </View>
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
  thumbnail: {
    width: '100%',
    height: 400,
  },
  content: {
    paddingHorizontal: 24,
    paddingTop: 30,
    backgroundColor: '#fff',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    marginTop: -30,
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 5,
  },
  category: {
    fontSize: 13,
    color: '#007AFF',
    textTransform: 'uppercase',
    fontWeight: '700',
    marginBottom: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: '#333',
    maxWidth: '80%',
  },
  price: {
    fontSize: 24,
    fontWeight: '800',
    color: '#007AFF',
  },
  divider: {
    height: 1,
    backgroundColor: '#eee',
    marginVertical: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
  },
  infoRow: {
    flexDirection: 'row',
    marginTop: 25,
    backgroundColor: '#f8f9fa',
    padding: 15,
    borderRadius: 15,
  },
  infoItem: {
    flex: 1,
    alignItems: 'center',
  },
  infoLabel: {
    fontSize: 12,
    color: '#999',
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 15,
    fontWeight: '700',
    color: '#333',
  },
  footerGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 20,
    paddingTop: 15,
    paddingBottom: 30,
    borderTopWidth: 1,
    borderColor: '#eee',
    gap: 10,
    justifyContent: 'space-between',
  },
  gridButton: {
    width: '48%',
    height: 52,
    borderRadius: 14,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  gridButtonText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#333',
    marginLeft: 6,
  },
  papersButton: {
    backgroundColor: '#9C27B0', // Purple for Past Papers
  },
  previewButton: {
    backgroundColor: '#f0f0f0',
  },
  downloadButton: {
    backgroundColor: '#007AFF',
  },
  disabledButton: {
    backgroundColor: '#f5f5f5',
  },
  quizFooterButton: {
    backgroundColor: '#FF9500', // Distinct orange for Quiz
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalDismiss: {
    flex: 1,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingTop: 20,
    maxHeight: '60%',
    paddingBottom: 40,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1A1A1A',
  },
  closeModalText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#666',
  },
  modalList: {
    padding: 24,
  },
  quizListItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    padding: 15,
    borderRadius: 18,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  quizListIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  quizListTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  quizListMeta: {
    fontSize: 11,
    color: '#666',
    fontWeight: '600',
  },
  quizListMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 2,
  },
  dot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: '#ccc',
  },
  startBadge: {
    backgroundColor: '#E3F2FD',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
  },
  startBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#007AFF',
  },
});
