import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, Image, ScrollView, TouchableOpacity, ActivityIndicator, Share, Alert } from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { ChevronLeft, Download, Eye, Share2, Bookmark, CheckCircle2 } from 'lucide-react-native';
import { fetchProducts, Product } from '../../src/services/api';
import { saveRecentlyViewed, downloadPDF, savePDFMetadata, getSavedPDFs } from '../../src/services/storage';

export default function ProductDetailScreen() {
  const { id } = useLocalSearchParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const loadProduct = async () => {
      const products = await fetchProducts();
      const found = products.find(p => p.id.toString() === id);
      if (found) {
        setProduct(found);
        saveRecentlyViewed(found);
        const saved = await getSavedPDFs();
        setIsSaved(saved.some((p: any) => p.id === found.id));
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

      <View style={styles.footer}>
        <TouchableOpacity 
          style={[styles.actionButton, styles.previewButton]} 
          onPress={handlePreview}
        >
          <Eye color="#333" size={20} style={{ marginRight: 8 }} />
          <Text style={styles.previewButtonText}>Preview</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.actionButton, styles.downloadButton, (isSaved || downloading) && styles.disabledButton]} 
          onPress={handleDownload}
          disabled={isSaved || downloading}
        >
          {downloading ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : isSaved ? (
            <>
              <CheckCircle2 color="#fff" size={20} style={{ marginRight: 8 }} />
              <Text style={styles.downloadButtonText}>Saved Offline</Text>
            </>
          ) : (
            <>
              <Download color="#fff" size={20} style={{ marginRight: 8 }} />
              <Text style={styles.downloadButtonText}>Download</Text>
            </>
          )}
        </TouchableOpacity>
      </View>
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
    padding: 20,
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
    fontSize: 12,
    color: '#999',
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
  footer: {
    flexDirection: 'row',
    padding: 20,
    paddingBottom: 35,
    borderTopWidth: 1,
    borderColor: '#eee',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    height: 55,
    borderRadius: 15,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  previewButton: {
    backgroundColor: '#f0f0f0',
  },
  previewButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
  },
  downloadButton: {
    backgroundColor: '#007AFF',
  },
  downloadButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
});
