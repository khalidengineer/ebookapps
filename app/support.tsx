import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  TextInput, 
  KeyboardAvoidingView, 
  Platform, 
  ActivityIndicator, 
  Alert,
  Image,
  Dimensions
} from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, User, Mail, Phone, FileText, Camera, Send, X, CheckCircle2 } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import Animated, { FadeInDown, FadeInUp, Layout } from 'react-native-reanimated';
import { StatusBar } from 'expo-status-bar';
import { submitContactForm } from '../src/services/api';

const { width } = Dimensions.get('window');

export default function SupportScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  
  const [form, setForm] = useState({
    name: '',
    email: '',
    number: '',
    details: '',
    image: null as string | null
  });

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.5,
      base64: true,
    });

    if (!result.canceled) {
      setForm({ ...form, image: `data:image/jpeg;base64,${result.assets[0].base64}` });
    }
  };

  const removeImage = () => {
    setForm({ ...form, image: null });
  };

  const handleSubmit = async () => {
    if (!form.name || !form.email || !form.details) {
      Alert.alert('Error', 'Please fill all required fields');
      return;
    }

    setLoading(true);
    try {
      const success = await submitContactForm(form);
      if (success) {
        setSubmitted(true);
      } else {
        Alert.alert('Error', 'Something went wrong. Please try again.');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to submit form.');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <View style={styles.container}>
        <StatusBar style="dark" />
        <View style={styles.successContainer}>
          <Animated.View entering={FadeInDown.duration(800)}>
            <CheckCircle2 color="#22c55e" size={80} strokeWidth={1.5} />
          </Animated.View>
          <Animated.Text entering={FadeInDown.delay(200).duration(800)} style={styles.successTitle}>
            Thank You!
          </Animated.Text>
          <Animated.Text entering={FadeInDown.delay(400).duration(800)} style={styles.successDesc}>
            Your message has been successfully submitted. Our team will get back to you soon.
          </Animated.Text>
          <TouchableOpacity style={styles.doneButton} onPress={() => router.back()}>
            <Text style={styles.doneButtonText}>Done</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <StatusBar style="dark" />
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ArrowLeft color="#333" size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Support Form</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView 
        showsVerticalScrollIndicator={false} 
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        

        {/* Name Field */}
        <Animated.View entering={FadeInDown.delay(200).duration(600)} style={styles.inputGroup}>
          <Text style={styles.label}>Name*</Text>
          <View style={styles.inputWrapper}>
            <User color="#64748b" size={20} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Your full name"
              value={form.name}
              onChangeText={(text) => setForm({ ...form, name: text })}
            />
          </View>
        </Animated.View>

        {/* Email Field */}
        <Animated.View entering={FadeInDown.delay(300).duration(600)} style={styles.inputGroup}>
          <Text style={styles.label}>Email Address*</Text>
          <View style={styles.inputWrapper}>
            <Mail color="#64748b" size={20} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Your email address"
              keyboardType="email-address"
              autoCapitalize="none"
              value={form.email}
              onChangeText={(text) => setForm({ ...form, email: text })}
            />
          </View>
        </Animated.View>

        {/* Phone Number Field */}
        <Animated.View entering={FadeInDown.delay(400).duration(600)} style={styles.inputGroup}>
          <Text style={styles.label}>Phone Number</Text>
          <View style={styles.inputWrapper}>
            <Phone color="#64748b" size={20} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Your contact number"
              keyboardType="phone-pad"
              value={form.number}
              onChangeText={(text) => setForm({ ...form, number: text })}
            />
          </View>
        </Animated.View>

        {/* Details Field */}
        <Animated.View entering={FadeInDown.delay(500).duration(600)} style={styles.inputGroup}>
          <Text style={styles.label}>Details*</Text>
          <View style={[styles.inputWrapper, styles.multilineWrapper]}>
            <FileText color="#64748b" size={20} style={[styles.inputIcon, { marginTop: 12 }]} />
            <TextInput
              style={[styles.input, styles.multilineInput]}
              placeholder="How can we help you?"
              multiline
              numberOfLines={4}
              value={form.details}
              onChangeText={(text) => setForm({ ...form, details: text })}
            />
          </View>
        </Animated.View>

        {/* Image Upload Field */}
        <Animated.View entering={FadeInDown.delay(600).duration(600)} style={styles.inputGroup}>
          <Text style={styles.label}>Upload Screenshot (Optional)</Text>
          
          {form.image ? (
            <View style={styles.imagePreviewContainer}>
              <Image source={{ uri: form.image }} style={styles.previewImage} />
              <TouchableOpacity style={styles.removeImageBtn} onPress={removeImage}>
                <X color="#fff" size={16} />
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity style={styles.uploadBtn} onPress={pickImage}>
              <Camera color="#6366f1" size={24} />
              <Text style={styles.uploadText}>Select Image</Text>
            </TouchableOpacity>
          )}
        </Animated.View>

        {/* Submit Button */}
        <Animated.View entering={FadeInUp.delay(700).duration(600)} style={{ marginTop: 20 }}>
          <TouchableOpacity 
            style={[styles.submitButton, loading && styles.submitButtonDisabled]} 
            onPress={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <>
                <Text style={styles.submitButtonText}>Submit Request</Text>
                <Send color="#fff" size={20} style={{ marginLeft: 8 }} />
              </>
            )}
          </TouchableOpacity>
        </Animated.View>

      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f8f9fa',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1a1a1a',
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  formLabel: {
    fontSize: 16,
    color: '#64748b',
    marginBottom: 25,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 8,
    marginLeft: 4,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    paddingHorizontal: 16,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    height: 54,
    fontSize: 15,
    color: '#1a1a1a',
  },
  multilineWrapper: {
    alignItems: 'flex-start',
    paddingVertical: 4,
  },
  multilineInput: {
    height: 120,
    textAlignVertical: 'top',
    paddingTop: 12,
  },
  uploadBtn: {
    height: 100,
    backgroundColor: '#f5f7ff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e0e7ff',
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
  },
  uploadText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6366f1',
    marginTop: 8,
  },
  imagePreviewContainer: {
    width: '100%',
    height: 180,
    borderRadius: 16,
    overflow: 'hidden',
    position: 'relative',
  },
  previewImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  removeImageBtn: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitButton: {
    flexDirection: 'row',
    height: 58,
    backgroundColor: '#6366f1',
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#6366f1',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 8,
  },
  submitButtonDisabled: {
    backgroundColor: '#94a3b8',
    elevation: 0,
    shadowOpacity: 0,
  },
  submitButtonText: {
    fontSize: 17,
    fontWeight: '700',
    color: '#fff',
  },
  successContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  successTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1a1a1a',
    marginTop: 30,
    marginBottom: 10,
  },
  successDesc: {
    fontSize: 16,
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 30,
  },
  doneButton: {
    width: 140,
    height: 50,
    backgroundColor: '#f1f5f9',
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  doneButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#334155',
  },
});
