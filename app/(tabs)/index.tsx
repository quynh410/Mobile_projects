import { Ionicons } from '@expo/vector-icons';
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

export default function HomeScreen() {
  const [selectedCategory, setSelectedCategory] = useState('Women');

  const categories = [
    { id: 'Women', icon: 'person', color: '#5D4037' },
    { id: 'Men', icon: 'person-outline', color: '#E5E7EB' },
    { id: 'Accessories', icon: 'glasses-outline', color: '#E5E7EB' },
    { id: 'Brands', icon: 'shirt-outline', color: '#E5E7EB' },
  ];

  const featureProducts = [
    { id: 1, name: 'Tur Beresh Sweater', price: '$ 39.99', image: 'https://via.placeholder.com/160x200/5D4037/FFFFFF?text=Sweater' },
    { id: 2, name: 'Lang-Sleeve Dress', price: '$ 45.00', image: 'https://via.placeholder.com/160x200/D4A574/FFFFFF?text=Dress' },
    { id: 3, name: 'Product Name', price: '$ 80.00', image: 'https://via.placeholder.com/160x200/E5E7EB/000000?text=Product' },
  ];

  const recommendedProducts = [
    { id: 1, name: 'White fashion hoodie', price: '$ 29.00', image: 'https://via.placeholder.com/80x80/F3F4F6/000000?text=Hoodie' },
    { id: 2, name: 'Cotton', price: '$ 30.10', image: 'https://via.placeholder.com/80x80/E5E7EB/000000?text=Cotton' },
  ];

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity>
            <Ionicons name="menu" size={24} color="#000" />
          </TouchableOpacity>
          <Text style={styles.logo}>GemStore</Text>
          <TouchableOpacity style={styles.notificationContainer}>
            <Ionicons name="notifications-outline" size={24} color="#000" />
            <View style={styles.badge}>
              <Text style={styles.badgeText}>1</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Category Filters */}
        <View style={styles.categoryContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoryScroll}>
            {categories.map((category) => (
              <TouchableOpacity
                key={category.id}
                style={[
                  styles.categoryItem,
                  selectedCategory === category.id && styles.categoryItemSelected,
                ]}
                onPress={() => setSelectedCategory(category.id)}
              >
                <View
                  style={[
                    styles.categoryIcon,
                    selectedCategory === category.id && styles.categoryIconSelected,
                  ]}
                >
                  <Ionicons
                    name={category.icon as any}
                    size={24}
                    color={selectedCategory === category.id ? '#FFF' : '#000'}
                  />
                </View>
                <Text
                  style={[
                    styles.categoryText,
                    selectedCategory === category.id && styles.categoryTextSelected,
                  ]}
                >
                  {category.id}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Promotional Banner - Autumn Collection */}
        <View style={styles.bannerContainer}>
          <View style={styles.autumnBanner}>
            <View style={styles.bannerContent}>
              <Text style={styles.bannerSubtitle}>Autumn Collection</Text>
              <Text style={styles.bannerTitle}>2021</Text>
            </View>
            <Image
              source={{ uri: 'https://via.placeholder.com/120x160/D4A574/FFFFFF?text=Autumn' }}
              style={styles.bannerPlaceholder}
              resizeMode="cover"
            />
          </View>
          <View style={styles.bannerDots}>
            <View style={[styles.dot, styles.dotActive]} />
            <View style={styles.dot} />
            <View style={styles.dot} />
          </View>
        </View>

        {/* Feature Products */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Feature Products</Text>
            <TouchableOpacity>
              <Text style={styles.showAll}>Show all</Text>
            </TouchableOpacity>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.productScroll}>
            {featureProducts.map((product) => (
              <View key={product.id} style={styles.productCard}>
                <Image
                  source={{ uri: product.image }}
                  style={styles.productImage}
                  resizeMode="cover"
                />
                <Text style={styles.productName}>{product.name}</Text>
                <Text style={styles.productPrice}>{product.price}</Text>
              </View>
            ))}
          </ScrollView>
        </View>

        {/* Hang Out & Party Banner */}
        <View style={styles.partyBanner}>
          <View style={styles.partyBannerContent}>
            <Text style={styles.partyBannerSubtitle}>NEW COLLECTION</Text>
            <Text style={styles.partyBannerTitle}>HANG OUT & PARTY</Text>
          </View>
          <Image
            source={{ uri: 'https://via.placeholder.com/100x120/E5E7EB/000000?text=Party' }}
            style={styles.partyBannerImage}
            resizeMode="cover"
          />
        </View>

        {/* Recommended */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recommended</Text>
            <TouchableOpacity>
              <Text style={styles.showAll}>Show all</Text>
            </TouchableOpacity>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.productScroll}>
            {recommendedProducts.map((product) => (
              <View key={product.id} style={styles.recommendedCard}>
                <Image
                  source={{ uri: product.image }}
                  style={styles.recommendedImage}
                  resizeMode="cover"
                />
                <View style={styles.recommendedInfo}>
                  <Text style={styles.recommendedName}>{product.name}</Text>
                  <Text style={styles.recommendedPrice}>{product.price}</Text>
                </View>
              </View>
            ))}
          </ScrollView>
        </View>

        {/* Top Collection */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Top Collection</Text>
            <TouchableOpacity>
              <Text style={styles.showAll}>Show all</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.topCollectionContainer}>
            <View style={styles.topCollectionCard}>
              <View style={styles.topCollectionContent}>
                <Text style={styles.topCollectionSubtitle}>Sale up to 40%</Text>
                <Text style={styles.topCollectionTitle}>FOR SUM & BEAUTY</Text>
              </View>
              <Image
                source={{ uri: 'https://via.placeholder.com/100x120/E5E7EB/000000?text=Beauty' }}
                style={styles.topCollectionImage}
                resizeMode="cover"
              />
            </View>
            <View style={styles.topCollectionCard}>
              <View style={styles.topCollectionContent}>
                <Text style={styles.topCollectionSubtitle}>Summer Collection 2021</Text>
                <Text style={styles.topCollectionTitle}>Most sexy & fabulous design</Text>
              </View>
              <Image
                source={{ uri: 'https://via.placeholder.com/100x120/E5E7EB/000000?text=Summer' }}
                style={styles.topCollectionImage}
                resizeMode="cover"
              />
            </View>
          </View>
        </View>

        {/* Product Categories */}
        <View style={styles.categoryGrid}>
          <View style={styles.categoryGridCard}>
            <Image
              source={{ uri: 'https://via.placeholder.com/60x60/E5E7EB/000000?text=T-Shirt' }}
              style={styles.categoryGridImage}
              resizeMode="cover"
            />
            <View style={styles.categoryGridInfo}>
              <Text style={styles.categoryGridLabel}>T-Shirts</Text>
              <Text style={styles.categoryGridTitle}>The Office Life</Text>
            </View>
          </View>
          <View style={styles.categoryGridCard}>
            <Image
              source={{ uri: 'https://via.placeholder.com/60x60/E5E7EB/000000?text=Dress' }}
              style={styles.categoryGridImage}
              resizeMode="cover"
            />
            <View style={styles.categoryGridInfo}>
              <Text style={styles.categoryGridLabel}>Dresses</Text>
              <Text style={styles.categoryGridTitle}>Elegant Design</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
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
  logo: {
    fontSize: 20,
    fontWeight: 'bold',
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
    fontWeight: 'bold',
  },
  categoryContainer: {
    paddingVertical: 16,
  },
  categoryScroll: {
    paddingHorizontal: 20,
    gap: 16,
  },
  categoryItem: {
    alignItems: 'center',
    marginRight: 16,
  },
  categoryItemSelected: {},
  categoryIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#E5E7EB',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryIconSelected: {
    backgroundColor: '#5D4037',
  },
  categoryText: {
    fontSize: 12,
    color: '#6B7280',
  },
  categoryTextSelected: {
    color: '#000',
    fontWeight: '600',
  },
  bannerContainer: {
    marginVertical: 20,
    paddingHorizontal: 20,
  },
  autumnBanner: {
    backgroundColor: '#D4A574',
    borderRadius: 16,
    height: 200,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    marginBottom: 12,
  },
  bannerContent: {
    flex: 1,
  },
  bannerSubtitle: {
    fontSize: 14,
    color: '#FFF',
    marginBottom: 8,
  },
  bannerTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFF',
  },
  bannerPlaceholder: {
    width: 120,
    height: 160,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 12,
  },
  bannerDots: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#D1D5DB',
  },
  dotActive: {
    backgroundColor: '#5D4037',
  },
  section: {
    marginVertical: 24,
    paddingHorizontal: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  showAll: {
    fontSize: 14,
    color: '#6B7280',
  },
  productScroll: {
    gap: 16,
  },
  productCard: {
    width: 160,
    marginRight: 16,
  },
  productImage: {
    width: 160,
    height: 200,
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    marginBottom: 12,
  },
  productName: {
    fontSize: 14,
    color: '#000',
    marginBottom: 4,
  },
  productPrice: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  partyBanner: {
    backgroundColor: '#F9FAFB',
    marginHorizontal: 20,
    marginVertical: 20,
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  partyBannerContent: {
    flex: 1,
  },
  partyBannerSubtitle: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 8,
  },
  partyBannerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  partyBannerImage: {
    width: 100,
    height: 120,
    backgroundColor: '#E5E7EB',
    borderRadius: 12,
  },
  recommendedCard: {
    flexDirection: 'row',
    width: 280,
    marginRight: 16,
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 12,
  },
  recommendedImage: {
    width: 80,
    height: 80,
    backgroundColor: '#E5E7EB',
    borderRadius: 8,
    marginRight: 12,
  },
  recommendedInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  recommendedName: {
    fontSize: 14,
    color: '#000',
    marginBottom: 4,
  },
  recommendedPrice: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  topCollectionContainer: {
    gap: 16,
  },
  topCollectionCard: {
    flexDirection: 'row',
    backgroundColor: '#F9FAFB',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
  },
  topCollectionContent: {
    flex: 1,
  },
  topCollectionSubtitle: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 8,
  },
  topCollectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  topCollectionImage: {
    width: 100,
    height: 120,
    backgroundColor: '#E5E7EB',
    borderRadius: 12,
  },
  categoryGrid: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 20,
    gap: 16,
  },
  categoryGridCard: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
  },
  categoryGridImage: {
    width: 60,
    height: 60,
    backgroundColor: '#E5E7EB',
    borderRadius: 8,
    marginRight: 12,
  },
  categoryGridInfo: {
    flex: 1,
  },
  categoryGridLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 4,
  },
  categoryGridTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
});
