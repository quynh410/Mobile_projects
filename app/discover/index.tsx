import { getAllCategoriesNoPaging, getProductsByCategory } from '@/apis';
import { CategoryResponse } from '@/types/category';
import { ProductResponse } from '@/types/product';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
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

const defaultColors = [
  '#9CAF88',
  '#B8A99A',
  '#6B7B8C',
  '#A8A5B8',
  '#8B9DC3',
  '#C8B99C',
  '#9F8F8F',
  '#B5A5A5',
];

interface CategoryWithProducts extends CategoryResponse {
  products?: ProductResponse[];
  isLoadingProducts?: boolean;
  totalProducts?: number;
}

export default function DiscoverScreen() {
  const router = useRouter();
  const [categories, setCategories] = useState<CategoryWithProducts[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedCategoryId, setExpandedCategoryId] = useState<number | null>(null);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await getAllCategoriesNoPaging();
      if (response.data) {
        setCategories(response.data.map(cat => ({ ...cat, products: [], isLoadingProducts: false })));
      }
    } catch (err: any) {
      console.error('Error loading categories:', err);
      setError(err.message || 'Không thể tải danh mục');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCategoryPress = async (category: CategoryWithProducts) => {
    if (expandedCategoryId === category.categoryId) {
      setExpandedCategoryId(null);
    } else {
      setExpandedCategoryId(category.categoryId);
      
      if (!category.products || category.products.length === 0) {
        await loadCategoryProducts(category.categoryId);
      }
    }
  };

  const loadCategoryProducts = async (categoryId: number) => {
    try {
      setCategories(prev => prev.map(cat => 
        cat.categoryId === categoryId 
          ? { ...cat, isLoadingProducts: true }
          : cat
      ));

      const response = await getProductsByCategory(categoryId, 0, 20);
      if (response.data?.content) {
        setCategories(prev => prev.map(cat => 
          cat.categoryId === categoryId 
            ? { 
                ...cat, 
                products: response.data!.content,
                totalProducts: response.data!.totalElements,
                isLoadingProducts: false
              }
            : cat
        ));
      }
    } catch (err: any) {
      console.error('Error loading category products:', err);
      setCategories(prev => prev.map(cat => 
        cat.categoryId === categoryId 
          ? { ...cat, isLoadingProducts: false }
          : cat
      ));
    }
  };

  const handleProductPress = (product: ProductResponse) => {
    router.push(`/product/${product.productId}` as any);
  };

  const handleViewAllProducts = (category: CategoryResponse) => {
    router.push({
      pathname: '/products',
      params: { categoryId: category.categoryId.toString() },
    } as any);
  };

  const getCategoryBackgroundColor = (index: number): string => {
    return defaultColors[index % defaultColors.length];
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

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#5D4037" />
          <Text style={styles.loadingText}>Đang tải danh mục...</Text>
        </View>
      ) : error ? (
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle-outline" size={48} color="#EF4444" />
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={loadCategories}
          >
            <Text style={styles.retryButtonText}>Thử lại</Text>
          </TouchableOpacity>
        </View>
      ) : categories.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="folder-outline" size={48} color="#9CA3AF" />
          <Text style={styles.emptyText}>Không có danh mục nào</Text>
        </View>
      ) : (
        <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollView}>
          {categories.map((category, index) => {
            const isExpanded = expandedCategoryId === category.categoryId;
            const categoryProducts = category.products || [];
            
            return (
              <View key={category.categoryId} style={styles.categorySection}>
                {/* Category Banner */}
                <TouchableOpacity
                  style={[
                    styles.categoryBanner,
                    { backgroundColor: getCategoryBackgroundColor(index) },
                  ]}
                  onPress={() => handleCategoryPress(category)}
                >
                  <View style={styles.categoryBannerLeft}>
                    <Text style={styles.categoryBannerTitle}>
                      {category.categoryName.toUpperCase()}
                    </Text>
                  </View>
                  <View style={styles.categoryBannerRight}>
                    {category.imageUrl ? (
                      <Image
                        source={{ uri: category.imageUrl }}
                        style={styles.categoryBannerImage}
                        resizeMode="contain"
                      />
                    ) : (
                      <View style={styles.categoryBannerPlaceholder}>
                        <Ionicons name="image-outline" size={48} color="#FFFFFF" />
                      </View>
                    )}
                  </View>
                </TouchableOpacity>

                {/* Products List - Shown when expanded */}
                {isExpanded && (
                  <View style={styles.productsContainer}>
                    {category.isLoadingProducts ? (
                      <View style={styles.productsLoadingContainer}>
                        <ActivityIndicator size="small" color="#5D4037" />
                        <Text style={styles.productsLoadingText}>Đang tải sản phẩm...</Text>
                      </View>
                    ) : categoryProducts.length > 0 ? (
                      <>
                        {categoryProducts.map((product, productIndex) => (
                          <TouchableOpacity
                            key={product.productId}
                            style={[
                              styles.productItem,
                              productIndex === categoryProducts.length - 1 && styles.productItemLast,
                            ]}
                            onPress={() => handleProductPress(product)}
                          >
                            <Text style={styles.productItemName}>
                              {product.productName}
                            </Text>
                            <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
                          </TouchableOpacity>
                        ))}
                        {category.totalProducts && category.totalProducts > categoryProducts.length && (
                          <TouchableOpacity
                            style={styles.viewAllButton}
                            onPress={() => handleViewAllProducts(category)}
                          >
                            <Text style={styles.viewAllText}>
                              Xem tất cả {category.totalProducts} sản phẩm
                            </Text>
                            <Ionicons name="arrow-forward" size={20} color="#5D4037" />
                          </TouchableOpacity>
                        )}
                      </>
                    ) : (
                      <View style={styles.emptyProductsContainer}>
                        <Ionicons name="cube-outline" size={48} color="#9CA3AF" />
                        <Text style={styles.emptyProductsText}>Không có sản phẩm nào</Text>
                      </View>
                    )}
                  </View>
                )}
              </View>
            );
          })}
        </ScrollView>
      )}
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    fontFamily: 'Product Sans Medium',
    fontWeight: '500',
    color: '#6B7280',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  errorText: {
    marginTop: 16,
    fontSize: 16,
    fontFamily: 'Product Sans Medium',
    fontWeight: '500',
    color: '#EF4444',
    textAlign: 'center',
  },
  retryButton: {
    marginTop: 24,
    backgroundColor: '#5D4037',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Product Sans Medium',
    fontWeight: '500',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    marginTop: 16,
    fontSize: 16,
    fontFamily: 'Product Sans Medium',
    fontWeight: '500',
    color: '#9CA3AF',
  },
  categoryBanner: {
    flexDirection: 'row',
    borderRadius: 16,
    marginHorizontal: 20,
    marginBottom: 16,
    overflow: 'hidden',
    height: 160,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
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
    fontWeight: '600',
    color: '#FFFFFF',
    letterSpacing: 1,
  },
  categoryBannerRight: {
    width: 140,
    height: 160,
    justifyContent: 'center',
    alignItems: 'center',
    paddingRight: 16,
    paddingVertical: 12,
  },
  categoryBannerImage: {
    width: '100%',
    height: '100%',
    borderRadius: 12,
  },
  categoryBannerPlaceholder: {
    width: '100%',
    height: '100%',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  categorySection: {
    marginBottom: 20,
  },
  productsContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginHorizontal: 20,
    marginTop: -8,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  productsLoadingContainer: {
    paddingVertical: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  productsLoadingText: {
    marginTop: 12,
    fontSize: 14,
    fontFamily: 'Product Sans Medium',
    fontWeight: '400',
    color: '#6B7280',
  },
  productItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  productItemLast: {
    borderBottomWidth: 0,
  },
  productItemName: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Product Sans Medium',
    fontWeight: '500',
    color: '#000',
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    backgroundColor: '#F9FAFB',
  },
  viewAllText: {
    fontSize: 14,
    fontFamily: 'Product Sans Medium',
    fontWeight: '500',
    color: '#5D4037',
    marginRight: 8,
  },
  emptyProductsContainer: {
    paddingVertical: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyProductsText: {
    marginTop: 12,
    fontSize: 14,
    fontFamily: 'Product Sans Medium',
    fontWeight: '400',
    color: '#9CA3AF',
  },
});

