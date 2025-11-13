import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { usePathname, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  Animated,
  Dimensions,
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');
const SIDEBAR_WIDTH = width * 0.75;

interface UserData {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
}

interface SidebarProps {
  visible: boolean;
  onClose: () => void;
}

interface MenuItem {
  id: string;
  title: string;
  icon: keyof typeof Ionicons.glyphMap;
  route?: string;
  onPress?: () => void;
}

export default function Sidebar({ visible, onClose }: SidebarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const insets = useSafeAreaInsets();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const slideAnim = React.useRef(new Animated.Value(-SIDEBAR_WIDTH)).current;
  const opacityAnim = React.useRef(new Animated.Value(0)).current;

  useEffect(() => {
    loadUserData();
  }, []);

  useEffect(() => {
    if (visible) {
      loadUserData();
    }
  }, [visible]);

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: -SIDEBAR_WIDTH,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

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

  const handleMenuItemPress = (item: MenuItem) => {
    if (item.onPress) {
      item.onPress();
    } else if (item.route) {
      router.push(item.route as any);
      onClose();
    }
  };

  const handleThemeToggle = (newTheme: 'light' | 'dark') => {
    setTheme(newTheme);
  };

  const navigationItems: MenuItem[] = [
    {
      id: 'homepage',
      title: 'Homepage',
      icon: 'home',
      route: '/(tabs)',
    },
    {
      id: 'discover',
      title: 'Discover',
      icon: 'search',
      route: '/(tabs)/search',
    },
    {
      id: 'my-order',
      title: 'My Order',
      icon: 'bag',
      route: '/orders',
    },
    {
      id: 'my-profile',
      title: 'My profile',
      icon: 'person',
      route: '/(tabs)/profile',
    },
  ];

  const otherItems: MenuItem[] = [
    {
      id: 'setting',
      title: 'Setting',
      icon: 'settings',
      route: '/setting',
    },
    {
      id: 'support',
      title: 'Support',
      icon: 'mail',
      onPress: () => {
        console.log('Support pressed');
        onClose();
      },
    },
    {
      id: 'about-us',
      title: 'About us',
      icon: 'information-circle',
      onPress: () => {
        console.log('About us pressed');
        onClose();
      },
    },
  ];

  const getActiveRoute = () => {
    const currentPath = pathname || '';
    if (currentPath.includes('/setting')) return 'setting';
    if (currentPath.includes('/profile')) return 'my-profile';
    if (currentPath.includes('/search')) return 'discover';
    if (currentPath.includes('/orders')) return 'my-order';
    if (currentPath.includes('/cart')) return 'my-order';
    if (currentPath === '/(tabs)' || currentPath === '/(tabs)/' || currentPath.includes('/(tabs)/index') || currentPath === '/') return 'homepage';
    return 'homepage';
  };

  const activeRoute = getActiveRoute();

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        {/* Overlay */}
        <TouchableOpacity
          style={styles.overlay}
          activeOpacity={1}
          onPress={onClose}
        >
          <Animated.View
            style={[
              styles.overlayAnimated,
              {
                opacity: opacityAnim,
              },
            ]}
          />
        </TouchableOpacity>

        {/* Sidebar */}
        <Animated.View
          style={[
            styles.sidebar,
            {
              transform: [{ translateX: slideAnim }],
            },
          ]}
        >
          <SafeAreaView style={styles.sidebarContent} edges={['top', 'left']}>
            <ScrollView
              style={styles.scrollView}
              contentContainerStyle={styles.scrollContent}
              showsVerticalScrollIndicator={false}
            >
              {/* User Profile Section */}
              <View style={styles.profileSection}>
                <View style={styles.avatarContainer}>
                  <View style={styles.avatar}>
                    {userData?.avatarUrl ? (
                      <Image 
                        source={{ uri: userData.avatarUrl }} 
                        style={styles.avatarImage}
                        resizeMode="cover"
                      />
                    ) : (
                      <Ionicons name="person" size={40} color="#9CA3AF" />
                    )}
                  </View>
                </View>
                <Text style={styles.userName}>
                  {userData?.name || 'User Name'}
                </Text>
                <Text style={styles.userEmail}>
                  {userData?.email || 'user@example.com'}
                </Text>
              </View>

              {/* Navigation Items */}
              <View style={styles.menuSection}>
                {navigationItems.map((item) => (
                  <TouchableOpacity
                    key={item.id}
                    style={[
                      styles.menuItem,
                      activeRoute === item.id && styles.menuItemActive,
                    ]}
                    onPress={() => handleMenuItemPress(item)}
                  >
                    <Ionicons
                      name={item.icon}
                      size={24}
                      color={activeRoute === item.id ? '#000' : '#6B7280'}
                      style={styles.menuIcon}
                    />
                    <Text
                      style={[
                        styles.menuText,
                        activeRoute === item.id && styles.menuTextActive,
                      ]}
                    >
                      {item.title}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* OTHER Section */}
              <View style={styles.otherSection}>
                <Text style={styles.sectionLabel}>OTHER</Text>
                {otherItems.map((item) => (
                  <TouchableOpacity
                    key={item.id}
                    style={[
                      styles.menuItem,
                      activeRoute === item.id && styles.menuItemActive,
                    ]}
                    onPress={() => handleMenuItemPress(item)}
                  >
                    <Ionicons
                      name={item.icon}
                      size={24}
                      color={activeRoute === item.id ? '#000' : '#6B7280'}
                      style={styles.menuIcon}
                    />
                    <Text
                      style={[
                        styles.menuText,
                        activeRoute === item.id && styles.menuTextActive,
                      ]}
                    >
                      {item.title}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Theme Toggle */}
              <View style={styles.themeSection}>
                <View style={styles.themeToggle}>
                  <TouchableOpacity
                    style={[
                      styles.themeOption,
                      theme === 'light' && styles.themeOptionActive,
                    ]}
                    onPress={() => handleThemeToggle('light')}
                  >
                    <Ionicons
                      name="sunny"
                      size={20}
                      color={theme === 'light' ? '#000' : '#9CA3AF'}
                    />
                    <Text
                      style={[
                        styles.themeText,
                        theme === 'light' && styles.themeTextActive,
                      ]}
                    >
                      Light
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.themeOption,
                      theme === 'dark' && styles.themeOptionActive,
                    ]}
                    onPress={() => handleThemeToggle('dark')}
                  >
                    <Ionicons
                      name="moon"
                      size={20}
                      color={theme === 'dark' ? '#000' : '#9CA3AF'}
                    />
                    <Text
                      style={[
                        styles.themeText,
                        theme === 'dark' && styles.themeTextActive,
                      ]}
                    >
                      Dark
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </ScrollView>
          </SafeAreaView>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'transparent',
  },
  overlayAnimated: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  sidebar: {
    width: SIDEBAR_WIDTH,
    height: '100%',
    backgroundColor: '#FFFFFF',
    borderTopRightRadius: 20,
    borderBottomRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 2,
      height: 0,
    },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 10,
  },
  sidebarContent: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  profileSection: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  avatarContainer: {
    marginBottom: 16,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  userName: {
    fontSize: 18,
    fontFamily: 'Product Sans Medium',
    fontWeight: '600',
    color: '#000',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    fontFamily: 'Product Sans Medium',
    fontWeight: '400',
    color: '#6B7280',
  },
  menuSection: {
    paddingTop: 8,
    paddingBottom: 8,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  menuItemActive: {
    backgroundColor: '#F3F4F6',
  },
  menuIcon: {
    marginRight: 16,
  },
  menuText: {
    fontSize: 16,
    fontFamily: 'Product Sans Medium',
    fontWeight: '500',
    color: '#6B7280',
  },
  menuTextActive: {
    color: '#000',
    fontWeight: '600',
  },
  otherSection: {
    paddingTop: 24,
    paddingBottom: 8,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  sectionLabel: {
    fontSize: 12,
    fontFamily: 'Product Sans Medium',
    fontWeight: '500',
    color: '#9CA3AF',
    paddingHorizontal: 20,
    paddingBottom: 12,
    letterSpacing: 0.5,
  },
  themeSection: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 32,
  },
  themeToggle: {
    flexDirection: 'row',
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    padding: 4,
  },
  themeOption: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 8,
    gap: 8,
  },
  themeOptionActive: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  themeText: {
    fontSize: 14,
    fontFamily: 'Product Sans Medium',
    fontWeight: '500',
    color: '#9CA3AF',
  },
  themeTextActive: {
    color: '#000',
    fontWeight: '600',
  },
});

