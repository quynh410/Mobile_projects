import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    Dimensions,
    Image,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

export default function DiscoverScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    {
      id: 'clothing',
      title: 'CLOTHING',
      image: 'https://via.placeholder.com/200x250/9CAF88/FFFFFF?text=CLOTHING',
      backgroundColor: '#9CAF88',
    },
    {
      id: 'accessories',
      title: 'ACCESSORIES',
      image: 'https://via.placeholder.com/200x250/B8A99A/FFFFFF?text=ACCESSORIES',
      backgroundColor: '#B8A99A',
    },
    {
      id: 'shoes',
      title: 'SHOES',
      image: 'https://via.placeholder.com/200x250/6B7B8C/FFFFFF?text=SHOES',
      backgroundColor: '#6B7B8C',
    },
    {
      id: 'collection',
      title: 'COLLECTION',
      image: 'https://via.placeholder.com/200x250/A8A5B8/FFFFFF?text=COLLECTION',
      backgroundColor: '#A8A5B8',
    },
  ];

  const clothingSubcategories = [
    { name: 'Jacket', count: 120 },
    { name: 'Skirts', count: 40 },
    { name: 'Dresses', count: 36 },
    { name: 'Sweaters', count: 24 },
    { name: 'Jeans', count: 14 },
    { name: 'T-Shirts', count: 12 },
    { name: 'Pants', count: 9 },
  ];

  const handleCategoryPress = (categoryId: string) => {
    if (categoryId === 'clothing') {
      // Có thể navigate đến trang detail
      console.log('Navigate to clothing detail');
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity>
          <Ionicons name="menu" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Discover</Text>
        <TouchableOpacity style={styles.notificationContainer}>
          <Ionicons name="notifications-outline" size={24} color="#000" />
          <View style={styles.badge}>
            <Text style={styles.badgeText}>1</Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <TouchableOpacity
          style={styles.searchBar}
          onPress={() => router.push('/(tabs)/search/search')}
        >
          <Ionicons name="search" size={20} color="#9CA3AF" style={styles.searchIcon} />
          <Text style={styles.searchPlaceholder}>Search</Text>
          <TouchableOpacity
            onPress={(e) => {
              e.stopPropagation();
              router.push('/(tabs)/search/filter');
            }}
          >
            <Ionicons name="options-outline" size={20} color="#9CA3AF" />
          </TouchableOpacity>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollView}>
        {/* Clothing Category with Subcategories */}
        <View style={styles.categorySection}>
          <TouchableOpacity
            style={[styles.categoryBanner, { backgroundColor: categories[0].backgroundColor }]}
            onPress={() => handleCategoryPress('clothing')}
          >
            <View style={styles.categoryBannerLeft}>
              <Text style={styles.categoryBannerTitle}>{categories[0].title}</Text>
            </View>
            <Image
              source={{ uri: categories[0].image }}
              style={styles.categoryBannerImage}
              resizeMode="cover"
            />
          </TouchableOpacity>

          {/* Subcategories List */}
          <View style={styles.subcategoriesContainer}>
            {clothingSubcategories.map((subcat, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.subcategoryItem,
                  index === clothingSubcategories.length - 1 && styles.subcategoryItemLast,
                ]}
              >
                <Text style={styles.subcategoryName}>{subcat.name}</Text>
                <View style={styles.subcategoryRight}>
                  <Text style={styles.subcategoryCount}>{subcat.count} items</Text>
                  <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Other Categories */}
        {categories.slice(1).map((category) => (
          <TouchableOpacity
            key={category.id}
            style={[styles.categoryBanner, { backgroundColor: category.backgroundColor }]}
            onPress={() => handleCategoryPress(category.id)}
          >
            <View style={styles.categoryBannerLeft}>
              <Text style={styles.categoryBannerTitle}>{category.title}</Text>
            </View>
            <Image
              source={{ uri: category.image }}
              style={styles.categoryBannerImage}
              resizeMode="cover"
            />
          </TouchableOpacity>
        ))}
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
    paddingVertical: Platform.OS === 'ios' ? 12 : 16,
    paddingTop: Platform.OS === 'ios' ? 8 : 16,
    backgroundColor: '#FFFFFF',
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: 'Product Sans Medium',
    fontWeight: '500',
    color: '#000',
  },
  notificationContainer: {
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: '#EF4444',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: '#FFF',
    fontSize: 10,
    fontFamily: 'Product Sans Medium',
    fontWeight: '500',
  },
  searchContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  searchIcon: {
    marginRight: 12,
  },
  searchPlaceholder: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Product Sans Medium',
    fontWeight: '500',
    color: '#1F2937',
  },
  scrollView: {
    flex: 1,
  },
  categorySection: {
    marginBottom: 20,
  },
  categoryBanner: {
    flexDirection: 'row',
    borderRadius: 16,
    marginHorizontal: 20,
    marginBottom: 16,
    overflow: 'hidden',
    height: 160,
  },
  categoryBannerLeft: {
    flex: 1,
    justifyContent: 'center',
    paddingLeft: 24,
    paddingRight: 16,
  },
  categoryBannerTitle: {
    fontSize: 24,
    fontFamily: 'Product Sans Medium',
    fontWeight: '500',
    color: '#FFFFFF',
    letterSpacing: 1,
  },
  categoryBannerImage: {
    width: 200,
    height: 160,
  },
  subcategoriesContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginHorizontal: 20,
    overflow: 'hidden',
  },
  subcategoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  subcategoryItemLast: {
    borderBottomWidth: 0,
  },
  subcategoryName: {
    fontSize: 16,
    fontFamily: 'Product Sans Medium',
    fontWeight: '500',
    color: '#000',
  },
  subcategoryRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  subcategoryCount: {
    fontSize: 14,
    fontFamily: 'Product Sans Medium',
    fontWeight: '500',
    color: '#1F2937',
  },
});

