import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch, Linking } from 'react-native';
import { Info, Shield, HelpCircle, Star, Share2, Github, ExternalLink } from 'lucide-react-native';
import Constants from 'expo-constants';

export default function SettingsScreen() {
  const version = Constants.expoConfig?.version || '1.0.0';

  const sections = [
    {
      title: 'App Info',
      items: [
        { icon: Info, label: 'Version', value: version, type: 'text' },
        { icon: Star, label: 'Rate our App', type: 'link', url: '#' },
        { icon: Share2, label: 'Share with friends', type: 'link', url: '#' },
      ]
    },
    {
      title: 'Support',
      items: [
        { icon: Shield, label: 'Privacy Policy', type: 'link', url: 'https://example.com/privacy' },
        { icon: HelpCircle, label: 'Help & FAQ', type: 'link', url: 'https://example.com/faq' },
        { icon: ExternalLink, label: 'Visit Website', type: 'link', url: 'https://example.com' },
      ]
    }
  ];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>

      
      {sections.map((section, idx) => (
        <View key={idx} style={styles.section}>
          <Text style={styles.sectionTitle}>{section.title}</Text>
          <View style={styles.card}>
            {section.items.map((item, itemIdx) => (
              <TouchableOpacity 
                key={itemIdx} 
                style={[styles.item, itemIdx === section.items.length - 1 && styles.lastItem]}
                onPress={() => item.type === 'link' && Linking.openURL(item.url)}
                disabled={item.type === 'text'}
              >
                <item.icon color="#666" size={20} style={{ marginRight: 15 }} />
                <Text style={styles.label}>{item.label}</Text>
                {item.value ? (
                  <Text style={styles.value}>{item.value}</Text>
                ) : (
                  <ExternalLink color="#ccc" size={16} />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>
      ))}

      <View style={styles.footer}>
        <Text style={styles.footerText}>Made with ❤️ by Khalid</Text>
        <Text style={styles.footerSubText}>Digital E-Book Store © 2026</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  content: {
    padding: 20,
    paddingTop: 24,
  },
  header: {
    fontSize: 24,
    fontWeight: '800',
    color: '#333',
    marginBottom: 25,
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#999',
    textTransform: 'uppercase',
    marginBottom: 10,
    marginLeft: 5,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 15,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#eee',
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  lastItem: {
    borderBottomWidth: 0,
  },
  label: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  value: {
    fontSize: 15,
    color: '#999',
  },
  footer: {
    marginTop: 40,
    alignItems: 'center',
    marginBottom: 30,
  },
  footerText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '600',
  },
  footerSubText: {
    fontSize: 12,
    color: '#999',
    marginTop: 5,
  },
});
