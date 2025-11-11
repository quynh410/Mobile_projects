import { useWishlist } from '@/contexts/WishlistContext';
import { formatVND } from '@/utils/formatCurrency';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    Dimensions,
    FlatList,
    Image,
    Platform,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');
const itemWidth = (width - 60) / 2;

export default function WishlistScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { items, removeItem, isInWishlist } = useWishlist();
  const [activeTab, setActiveTab] = useState<'all' | 'boards'>('all');

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    const starColor = "#20B2AA";

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Ionicons key={i} name="star" size={14} color={starColor} />
      );
    }
    if (hasHalfStar) {
      stars.push(
        <Ionicons key="half" name="star-half" size={14} color={starColor} />
      );
    }
    for (let i = stars.length; i < 5; i++) {
      stars.push(
        <Ionicons key={i} name="star-outline" size={14} color={starColor} />
      );
    }
    return stars;
  };

  const handleToggleFavorite = (productId: number) => {
    if (isInWishlist(productId)) {
      removeItem(productId);
    }
  };

  const renderProduct = ({ item }: { item: typeof items[0] }) => {
    const rating = 4.5;
    const reviewCount = Math.floor(Math.random() * 100) + 20;

    return (
      <TouchableOpacity
        style={styles.productCard}
        onPress={() => router.push(`/product/${item.productId}` as any)}
      >
        <View style={styles.imageContainer}>
          <Image
            source={
              item.imageUrl
                ? { uri: item.imageUrl }
                : require('@/assets/images/24642656f175b762469766070dae1ee73196af89.png')
            }
            style={styles.productImage}
            resizeMode="cover"
          />
          <TouchableOpacity
            style={styles.favoriteButton}
            onPress={() => handleToggleFavorite(item.productId)}
          >
            <Ionicons
              name="heart"
              size={20}
              color="#FF6B6B"
            />
          </TouchableOpacity>
        </View>
        <View style={styles.productInfo}>
          <Text style={styles.productName} numberOfLines={2}>
            {item.productName}
          </Text>
          <Text style={styles.productPrice}>
            {formatVND(item.price)}
          </Text>
          <View style={styles.ratingContainer}>
            <View style={styles.starsContainer}>
              {renderStars(rating)}
            </View>
            <Text style={styles.reviewCount}>({reviewCount})</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: Platform.OS === 'ios' ? 0 : insets.top }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.headerButton}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Wishlist</Text>
        <TouchableOpacity style={styles.headerButton}>
          <Ionicons name="notifications-outline" size={24} color="#000" />
          <View style={styles.notificationBadge}>
            <View style={styles.badgeDot} />
          </View>
        </TouchableOpacity>
      </View>

      {/* Tabs */}
      <View style={styles.tabsContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'all' && styles.tabActive]}
          onPress={() => setActiveTab('all')}
        >
          <Text style={[styles.tabText, activeTab === 'all' && styles.tabTextActive]}>
            All items
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'boards' && styles.tabActive]}
          onPress={() => setActiveTab('boards')}
        >
          <Text style={[styles.tabText, activeTab === 'boards' && styles.tabTextActive]}>
            Boards
          </Text>
        </TouchableOpacity>
      </View>

      {items.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="heart-outline" size={64} color="#9CA3AF" />
          <Text style={styles.emptyText}>Your wishlist is empty</Text>
          <Text style={styles.emptySubtext}>Start adding products you love!</Text>
        </View>
      ) : (
        <FlatList
          data={items}
          renderItem={renderProduct}
          keyExtractor={(item) => item.productId.toString()}
          numColumns={2}
          contentContainerStyle={styles.listContent}
          columnWrapperStyle={styles.row}
          showsVerticalScrollIndicator={false}
        />
      )}
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
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerButton: {
    padding: 8,
    position: 'relative',
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: 'Product Sans Medium',
    fontWeight: '500',
    color: '#000',
  },
  notificationBadge: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#EF4444',
  },
  badgeDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#EF4444',
  },
  tabsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  tab: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    marginRight: 8,
    alignItems: 'center',
  },
  tabActive: {
    backgroundColor: '#000000',
  },
  tabText: {
    fontSize: 14,
    fontFamily: 'Product Sans Medium',
    fontWeight: '500',
    color: '#000',
  },
  tabTextActive: {
    color: '#FFFFFF',
  },
  listContent: {
    padding: 20,
    paddingBottom: 100,
  },
  row: {
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  productCard: {
    width: itemWidth,
  },
  imageContainer: {
    position: 'relative',
    marginBottom: 12,
  },
  productImage: {
    width: itemWidth,
    height: itemWidth * 1.25,
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
  },
  favoriteButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  productInfo: {
    minHeight: 80,
  },
  productName: {
    fontSize: 14,
    fontFamily: 'Product Sans Medium',
    fontWeight: '500',
    color: '#000',
    marginBottom: 6,
    minHeight: 36,
    lineHeight: 18,
  },
  productPrice: {
    fontSize: 16,
    fontFamily: 'Product Sans Medium',
    fontWeight: '500',
    color: '#000',
    marginBottom: 6,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  starsContainer: {
    flexDirection: 'row',
    marginRight: 4,
  },
  reviewCount: {
    fontSize: 12,
    fontFamily: 'Product Sans Medium',
    fontWeight: '500',
    color: '#6B7280',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 80,
  },
  emptyText: {
    fontSize: 18,
    fontFamily: 'Product Sans Medium',
    fontWeight: '500',
    color: '#1F2937',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    fontFamily: 'Product Sans Medium',
    fontWeight: '500',
    color: '#6B7280',
  },
});

