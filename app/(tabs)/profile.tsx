import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface UserData {
  id: string;
  name: string;
  email: string;
}

interface MenuItem {
  id: string;
  title: string;
  icon: keyof typeof Ionicons.glyphMap;
  onPress: () => void;
}

export default function ProfileScreen() {
  const router = useRouter();
  const [userData, setUserData] = useState<UserData | null>(null);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const userDataString = await AsyncStorage.getItem('userData');
      if (userDataString) {
        const user = JSON.parse(userDataString);
        setUserData(user);
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  const handleLogout = async () => {
    await AsyncStorage.removeItem('userToken');
    await AsyncStorage.removeItem('userData');
    router.replace('/(auth)');
  };

  const handleSettings = () => {
    router.push('/profile-setting' as any);
  };

  const menuItems: MenuItem[] = [
    {
      id: 'address',
      title: 'Address',
      icon: 'location-outline',
      onPress: () => console.log('Address pressed'),
    },
    {
      id: 'payment',
      title: 'Payment method',
      icon: 'card-outline',
      onPress: () => console.log('Payment method pressed'),
    },
    {
      id: 'voucher',
      title: 'Voucher',
      icon: 'pricetag-outline',
      onPress: () => console.log('Voucher pressed'),
    },
    {
      id: 'wishlist',
      title: 'My Wishlist',
      icon: 'heart-outline',
      onPress: () => router.push('/wishlist' as any),
    },
    {
      id: 'rate',
      title: 'Rate this app',
      icon: 'star-outline',
      onPress: () => console.log('Rate app pressed'),
    },
    {
      id: 'logout',
      title: 'Log out',
      icon: 'log-out-outline',
      onPress: handleLogout,
    },
  ];

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {userData?.name?.charAt(0).toUpperCase() || 'U'}
              </Text>
            </View>
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.title}>{userData?.name || 'User'}</Text>
            <Text style={styles.email}>{userData?.email || ''}</Text>
          </View>
          <TouchableOpacity style={styles.settingsButton} onPress={handleSettings}>
            <Ionicons name="settings-outline" size={24} color="#000" />
          </TouchableOpacity>
        </View>

        {/* Menu Options */}
        <View style={styles.menuCard}>
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={item.id}
              style={[
                styles.menuItem,
                index === menuItems.length - 1 && styles.menuItemLast,
              ]}
              onPress={item.onPress}
            >
              <Ionicons name={item.icon} size={24} color="#000" style={styles.menuIcon} />
              <Text style={styles.menuText}>{item.title}</Text>
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 20 : 24,
    paddingBottom: 24,
    backgroundColor: '#FFFFFF',
  },
  avatarContainer: {
    marginRight: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#E5E7EB',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  avatarText: {
    fontSize: 32,
    fontFamily: 'Product Sans Medium',
    fontWeight: '500',
    color: '#6B7280',
  },
  profileInfo: {
    flex: 1,
  },
  title: {
    fontSize: 20,
    fontFamily: 'Product Sans Medium',
    fontWeight: '500',
    color: '#000',
    marginBottom: 4,
  },
  email: {
    fontSize: 14,
    fontFamily: 'Product Sans Medium',
    fontWeight: '500',
    color: '#6B7280',
  },
  settingsButton: {
    padding: 8,
  },
  menuCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginHorizontal: 20,
    marginTop: 20,
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  menuItemLast: {
    borderBottomWidth: 0,
  },
  menuIcon: {
    marginRight: 16,
  },
  menuText: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Product Sans Medium',
    fontWeight: '500',
    color: '#000',
  },
});
