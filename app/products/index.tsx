import { getAllProducts, getColorsByProductId, getProductsByCategory } from '@/apis';
import { useFilter } from '@/contexts/FilterContext';
import { useWishlist } from '@/contexts/WishlistContext';
import { ProductResponse } from '@/types/product';
import { formatVND } from '@/utils/formatCurrency';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import {
    ActivityIndicator,
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

export default function AllProductsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { addItem: addToWishlist, removeItem: removeFromWishlist, isInWishlist } = useWishlist();
  const { filters, hasActiveFilters } = useFilter();
  const params = useLocalSearchParams<{ categoryId?: string }>();
  const categoryId = params.categoryId ? parseInt(params.categoryId, 10) : undefined;
  
  const [allProducts, setAllProducts] = useState<ProductResponse[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<ProductResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [productColors, setProductColors] = useState<{ [key: number]: number[] }>({});

  const handleToggleFavorite = (product: ProductResponse) => {
    if (isInWishlist(product.productId)) {
      removeFromWishlist(product.productId);
    } else {
      addToWishlist({
        productId: product.productId,
        productName: product.productName,
        price: product.price,
        imageUrl: product.imageUrl,
        stockQuantity: product.stockQuantity,
        categoryId: product.categoryId,
        categoryName: product.categoryName,
      });
    }
  };

  // Load products when categoryId or filter category changes
  useEffect(() => {
    setPage(0);
    setAllProducts([]);
    setFilteredProducts([]);
    setHasMore(true);
    loadProducts(0, false);
  }, [categoryId, filters.selectedCategory]);

  // Apply filters when filters or allProducts change
  useEffect(() => {
    if (allProducts.length > 0) {
      applyFilters();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters, allProducts.length, productColors]);

  // Reload when screen is focused (in case filters changed)
  useFocusEffect(
    useCallback(() => {
      if (allProducts.length > 0) {
        applyFilters();
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filters])
  );

  const loadProducts = async (pageNum: number = 0, append: boolean = false) => {
    if (append) {
      setIsLoadingMore(true);
    } else {
      setIsLoading(true);
    }

    try {
      let result;
      // Priority: filter category > route categoryId > all products
      if (filters.selectedCategory) {
        result = await getProductsByCategory(filters.selectedCategory, pageNum, 50);
      } else if (categoryId) {
        result = await getProductsByCategory(categoryId, pageNum, 50);
      } else {
        result = await getAllProducts(pageNum, 50, 'productId', 'DESC');
      }
      
      if (result.data?.content) {
        const content = result.data.content;
        let newProducts: ProductResponse[];
        if (append) {
          newProducts = [...allProducts, ...content];
        } else {
          newProducts = content;
        }
        setAllProducts(newProducts);
        
        // Load colors for new products
        await loadProductColors(newProducts.slice(append ? allProducts.length : 0));
        
        const currentPage = result.data.number || 0;
        const totalPages = result.data.totalPages || 0;
        setHasMore(currentPage < totalPages - 1);
        setPage(currentPage);
      }
    } catch (error) {
      console.error('Error loading products:', error);
    } finally {
      setIsLoading(false);
      setIsLoadingMore(false);
    }
  };

  const loadProductColors = async (products: ProductResponse[]) => {
    const colorPromises = products.map(async (product) => {
      try {
        const colorsRes = await getColorsByProductId(product.productId);
        if (colorsRes.data && colorsRes.data.length > 0) {
          return {
            productId: product.productId,
            colorIds: colorsRes.data.map(c => c.colorId),
          };
        }
        return null;
      } catch (error) {
        return null;
      }
    });

    const colorResults = await Promise.all(colorPromises);
    const newProductColors: { [key: number]: number[] } = {};
    colorResults.forEach((result) => {
      if (result) {
        newProductColors[result.productId] = result.colorIds;
      }
    });
    setProductColors((prev) => ({ ...prev, ...newProductColors }));
  };

  const applyFilters = () => {
    let filtered = [...allProducts];

    // Filter by price range
    if (filters.priceRange.min !== 0 || filters.priceRange.max !== 10000000) {
      filtered = filtered.filter(
        (product) =>
          product.price >= filters.priceRange.min && product.price <= filters.priceRange.max
      );
    }

    // Category is already filtered in loadProducts, so no need to filter again here

    // Filter by color
    if (filters.selectedColor) {
      filtered = filtered.filter((product) => {
        const productColorIds = productColors[product.productId] || [];
        return productColorIds.includes(filters.selectedColor!);
      });
    }

    // Filter by rating (mock - since API doesn't have rating)
    // In a real app, this would check product.rating
    if (filters.selectedRating) {
      // For now, we'll skip rating filter as we don't have rating data
      // You can add a mock rating to products if needed
    }

    setFilteredProducts(filtered);
  };

  const loadMore = () => {
    if (!isLoadingMore && hasMore && !hasActiveFilters()) {
      const nextPage = page + 1;
      loadProducts(nextPage, true);
    }
  };

  const renderProduct = ({ item }: { item: ProductResponse }) => (
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
          onPress={() => handleToggleFavorite(item)}
        >
          <Ionicons
            name={isInWishlist(item.productId) ? "heart" : "heart-outline"}
            size={20}
            color={isInWishlist(item.productId) ? "#FF6B6B" : "#000"}
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
      </View>
    </TouchableOpacity>
  );

  const renderFooter = () => {
    if (!isLoadingMore) return null;
    return (
      <View style={styles.footerLoader}>
        <ActivityIndicator size="small" color="#5D4037" />
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: Platform.OS === 'ios' ? 0 : insets.top }]}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {categoryId ? 'Products by Category' : 'All Products'}
        </Text>
        <TouchableOpacity onPress={() => router.push('/(tabs)/search/filter')}>
          <Ionicons name="filter-outline" size={24} color="#000" />
        </TouchableOpacity>
      </View>

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#5D4037" />
        </View>
      ) : (
        <>
          {hasActiveFilters() && (
            <View style={styles.filterIndicator}>
              <Text style={styles.filterIndicatorText}>
                {filteredProducts.length} products found
              </Text>
              <TouchableOpacity
                onPress={() => router.push('/(tabs)/search/filter')}
                style={styles.filterButton}
              >
                <Ionicons name="filter" size={20} color="#5D4037" />
              </TouchableOpacity>
            </View>
          )}
          <FlatList
            data={hasActiveFilters() ? filteredProducts : allProducts}
            renderItem={renderProduct}
            keyExtractor={(item) => item.productId.toString()}
            numColumns={2}
            contentContainerStyle={styles.listContent}
            columnWrapperStyle={styles.row}
            onEndReached={loadMore}
            onEndReachedThreshold={0.5}
            ListFooterComponent={renderFooter}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Ionicons name="search-outline" size={64} color="#9CA3AF" />
                <Text style={styles.emptyText}>No products found</Text>
                <Text style={styles.emptySubtext}>Try adjusting your filters</Text>
              </View>
            }
            showsVerticalScrollIndicator={false}
          />
        </>
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
    paddingVertical: Platform.OS === 'ios' ? 12 : 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: 'Product Sans Medium',
    fontWeight: '500',
    color: '#000',
  },
  headerRight: {
    width: 24,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    padding: 20,
    paddingBottom: 40,
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
    minHeight: 60,
    justifyContent: 'space-between',
  },
  productName: {
    fontSize: 14,
    fontFamily: 'Product Sans Medium',
    fontWeight: '500',
    color: '#000',
    marginBottom: 8,
    minHeight: 36,
    lineHeight: 18,
  },
  productPrice: {
    fontSize: 16,
    fontFamily: 'Product Sans Medium',
    fontWeight: '500',
    color: '#000',
    marginTop: 'auto',
  },
  footerLoader: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  filterIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: '#F9FAFB',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  filterIndicatorText: {
    fontSize: 14,
    fontFamily: 'Product Sans Medium',
    fontWeight: '500',
    color: '#6B7280',
  },
  filterButton: {
    padding: 4,
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

