import { useCart } from '@/contexts/CartContext';
import { Ionicons } from "@expo/vector-icons";
import { Tabs } from 'expo-router';
import React from 'react';
import { Platform, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type TabBarIconProps = {
  color: string;
  size: number;
  focused?: boolean;
};

export default function TabLayout() {
  const insets = useSafeAreaInsets();
  const { items } = useCart();
  
  const cartItemCount = items.length;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#5D4037',
        tabBarInactiveTintColor: '#9CA3AF',
        tabBarShowLabel: false, // Bỏ chữ, chỉ hiển thị icon
        tabBarIconStyle: {
          marginTop: 4,
        },
        tabBarItemStyle: {
          paddingVertical: 4,
        },
        tabBarStyle: {
          backgroundColor: '#EEEEEE',
          borderTopWidth: 1,
          borderTopColor: '#E5E7EB',
          borderTopLeftRadius: 40,
          borderTopRightRadius: 40,
          height: Platform.OS === 'ios' ? 60 + (insets.bottom || 0) : 60,
          paddingBottom: Platform.OS === 'ios' ? (insets.bottom || 8) : 8,
          paddingTop: 8,
          paddingHorizontal: 0,
          marginHorizontal: 0,
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          elevation: 0,
          shadowOpacity: 0,
        },
        tabBarBackground: () => null,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size, focused }: TabBarIconProps) => (
            <Ionicons 
              name={focused ? "home" : "home-outline"} 
              size={size + 2} 
              color={color} 
            />
          ),
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: 'Search',
          tabBarIcon: ({ color, size, focused }: TabBarIconProps) => (
            <Ionicons 
              name={focused ? "search" : "search-outline"} 
              size={size + 2} 
              color={color} 
            />
          ),
        }}
      />
      <Tabs.Screen
        name="cart"
        options={{
          title: 'Cart',
          tabBarIcon: ({ color, size, focused }: TabBarIconProps) => (
            <View style={{ position: 'relative' }}>
              <Ionicons 
                name={focused ? "bag" : "bag-outline"} 
                size={size + 2} 
                color={color} 
              />
              {cartItemCount > 0 && (
                <View style={{
                  position: 'absolute',
                  top: -6,
                  right: -8,
                  backgroundColor: '#EF4444',
                  borderRadius: 10,
                  minWidth: 10,
                  height: 13,
                  justifyContent: 'center',
                  alignItems: 'center',
                  paddingHorizontal: 4,
                }}>
                  <Text style={{
                    color: '#FFFFFF',
                    fontSize: 10,
                    fontWeight: '600',
                  }}>
                    {cartItemCount > 99 ? '99+' : cartItemCount}
                  </Text>
                </View>
              )}
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size, focused }: TabBarIconProps) => (
            <Ionicons 
              name={focused ? "person" : "person-outline"} 
              size={size + 2} 
              color={color} 
            />
          ),
        }}
      />
    </Tabs>
  );
}
