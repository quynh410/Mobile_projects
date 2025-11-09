import Sidebar from '@/components/Sidebar';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import {
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface SettingItem {
  id: string;
  title: string;
  icon: keyof typeof Ionicons.glyphMap;
  onPress: () => void;
}

export default function SettingScreen() {
  const router = useRouter();
  const [sidebarVisible, setSidebarVisible] = React.useState(false);

  const settingItems: SettingItem[] = [
    {
      id: 'language',
      title: 'Language',
      icon: 'globe',
      onPress: () => {
        console.log('Language pressed');
      },
    },
    {
      id: 'notification',
      title: 'Notification',
      icon: 'notifications-outline',
      onPress: () => {
        router.push('/notification-setting');
      },
    },
    {
      id: 'terms',
      title: 'Terms of Use',
      icon: 'document-text-outline',
      onPress: () => {
        console.log('Terms of Use pressed');
      },
    },
    {
      id: 'privacy',
      title: 'Privacy Policy',
      icon: 'information-circle-outline',
      onPress: () => {
        console.log('Privacy Policy pressed');
      },
    },
    {
      id: 'chat',
      title: 'Chat support',
      icon: 'paper-plane-outline',
      onPress: () => {
        console.log('Chat support pressed');
      },
    },
  ];

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Sidebar visible={sidebarVisible} onClose={() => setSidebarVisible(false)} />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => setSidebarVisible(true)}
          style={styles.menuButton}
        >
          <Ionicons name="menu" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Setting</Text>
        <View style={styles.headerSpacer} />
      </View>

      {/* Setting Options */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.settingCard}>
          {settingItems.map((item, index) => (
            <TouchableOpacity
              key={item.id}
              style={[
                styles.settingItem,
                index === settingItems.length - 1 && styles.settingItemLast,
              ]}
              onPress={item.onPress}
            >
              <Ionicons name={item.icon} size={24} color="#000" style={styles.settingIcon} />
              <Text style={styles.settingText}>{item.title}</Text>
              <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    paddingTop: Platform.OS === 'ios' ? 8 : 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  menuButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: 'Product Sans Medium',
    fontWeight: '700',
    color: '#000',
    flex: 1,
    textAlign: 'center',
  },
  headerSpacer: {
    width: 32,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 20,
    paddingBottom: 20,
  },
  settingCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginHorizontal: 20,
    overflow: 'hidden',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  settingItemLast: {
    borderBottomWidth: 0,
  },
  settingIcon: {
    marginRight: 16,
  },
  settingText: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Product Sans Medium',
    fontWeight: '500',
    color: '#000',
  },
});

