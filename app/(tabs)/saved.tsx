import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { HardDriveDownload, Trash2, Eye, FileText } from 'lucide-react-native';
import { getSavedPDFs, deleteSavedPDF } from '../../src/services/storage';

export default function SavedScreen() {
  const [savedPDFs, setSavedPDFs] = useState<any[]>([]);
  const router = useRouter();

  const loadSaved = async () => {
    const data = await getSavedPDFs();
    setSavedPDFs(data);
  };

  useEffect(() => {
    loadSaved();
  }, []);

  const handleDelete = (id: number, uri: string) => {
    Alert.alert(
      'Delete PDF',
      'Are you sure you want to remove this PDF from offline storage?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: async () => {
            await deleteSavedPDF(id, uri);
            loadSaved();
          }
        }
      ]
    );
  };

  const handleOpen = (pdf: any) => {
    router.push({
      pathname: '/pdf-viewer',
      params: { localPath: pdf.localUri, title: pdf.product_name }
    });
  };

  if (savedPDFs.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <HardDriveDownload size={60} color="#ccc" />
        <Text style={styles.emptyText}>No offline PDFs saved yet.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>

      <FlatList
        data={savedPDFs}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Image source={{ uri: item.thumbnail_url }} style={styles.thumbnail} />
            <View style={styles.content}>
              <Text style={styles.title} numberOfLines={1}>{item.product_name}</Text>
              <Text style={styles.category}>{item.category}</Text>
              <View style={styles.actions}>
                <TouchableOpacity style={styles.openButton} onPress={() => handleOpen(item)}>
                  <Eye size={16} color="#007AFF" />
                  <Text style={styles.openText}>Open</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.deleteButton} onPress={() => handleDelete(item.id, item.localUri)}>
                  <Trash2 size={16} color="#FF3B30" />
                  <Text style={styles.deleteText}>Remove</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  header: {
    fontSize: 24,
    fontWeight: '800',
    color: '#333',
    marginBottom: 20,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  emptyText: {
    marginTop: 15,
    fontSize: 16,
    color: '#999',
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#f8f9fa',
    borderRadius: 15,
    padding: 10,
    marginBottom: 15,
    alignItems: 'center',
  },
  thumbnail: {
    width: 60,
    height: 80,
    borderRadius: 8,
  },
  content: {
    flex: 1,
    marginLeft: 15,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
  },
  category: {
    fontSize: 12,
    color: '#999',
    marginTop: 2,
  },
  actions: {
    flexDirection: 'row',
    marginTop: 10,
    gap: 15,
  },
  openButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  openText: {
    marginLeft: 5,
    fontSize: 14,
    color: '#007AFF',
    fontWeight: '600',
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  deleteText: {
    marginLeft: 5,
    fontSize: 14,
    color: '#FF3B30',
    fontWeight: '600',
  },
});
