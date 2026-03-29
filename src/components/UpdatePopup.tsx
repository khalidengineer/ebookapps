import React, { useEffect, useState } from 'react';
import { View, Text, Modal, StyleSheet, TouchableOpacity, Linking, Platform } from 'react-native';
import { fetchConfig } from '../services/api';
import Constants from 'expo-constants';
import { AlertCircle, Download } from 'lucide-react-native';

const UpdatePopup: React.FC = () => {
  const [showUpdate, setShowUpdate] = useState(false);
  const [updateInfo, setUpdateInfo] = useState({ version: '', force: false, url: '' });

  useEffect(() => {
    const checkVersion = async () => {
      const config = await fetchConfig();
      const currentVersion = Constants.expoConfig?.version || '1.0.0';
      const latestVersion = config['app_version'] || '1.0.0';
      
      if (latestVersion !== currentVersion) {
        setUpdateInfo({ 
          version: latestVersion, 
          force: config['force_update'] === 'true',
          url: config['update_url'] || (Platform.OS === 'ios' ? 'https://apps.apple.com' : 'https://play.google.com')
        });
        setShowUpdate(true);
      }
    };
    checkVersion();
  }, []);

  const handleUpdate = () => {
    Linking.openURL(updateInfo.url);
  };

  return (
    <Modal visible={showUpdate} transparent={true} animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <AlertCircle color="#007AFF" size={50} style={{ marginBottom: 15 }} />
          <Text style={styles.title}>Update Available</Text>
          <Text style={styles.message}>
            A new version ({updateInfo.version}) of the Digital E-Book Store is available. 
            Please update to enjoy the latest features and improvements.
          </Text>
          
          <TouchableOpacity style={styles.button} onPress={handleUpdate}>
            <Download color="#fff" size={20} style={{ marginRight: 10 }} />
            <Text style={styles.buttonText}>Update Now</Text>
          </TouchableOpacity>

          {!updateInfo.force && (
            <TouchableOpacity style={styles.skipButton} onPress={() => setShowUpdate(false)}>
              <Text style={styles.skipButtonText}>Maybe Later</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modal: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 25,
    alignItems: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: '#333',
    marginBottom: 10,
  },
  message: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 25,
  },
  button: {
    width: '100%',
    height: 55,
    backgroundColor: '#007AFF',
    borderRadius: 15,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 18,
    color: '#fff',
    fontWeight: '700',
  },
  skipButton: {
    marginTop: 15,
  },
  skipButtonText: {
    fontSize: 15,
    color: '#999',
    fontWeight: '600',
  },
});

export default UpdatePopup;
