import { getAllProducts, searchProducts } from '@/apis';
import { useFilter } from '@/contexts/FilterContext';
import { useWishlist } from '@/contexts/WishlistContext';
import { ProductResponse } from '@/types/product';
import { formatVND } from '@/utils/formatCurrency';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { useNavigation, useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');
const itemWidth = (width - 60) / 2;
const RECENT_SEARCHES_KEY = '@recent_searches';
const MAX_RECENT_SEARCHES = 10;

export default function SearchScreen() {
  const router = useRouter();
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const { filters, hasActiveFilters } = useFilter();
  const { addItem: addToWishlist, removeItem: removeFromWishlist, isInWishlist } = useWishlist();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [rawSearchResults, setRawSearchResults] = useState<ProductResponse[]>([]); // Raw results from API
  const [searchResults, setSearchResults] = useState<ProductResponse[]>([]); // Filtered results
  const [popularProducts, setPopularProducts] = useState<ProductResponse[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isLoadingPopular, setIsLoadingPopular] = useState(true);
  const [hasSearched, setHasSearched] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  
  const searchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useFocusEffect(
    React.useCallback(() => {
      const parent = navigation.getParent();
      if (parent) {
        parent.setOptions({
          tabBarStyle: { display: 'none' },
        });
      }
      return () => {
        if (parent) {
          parent.setOptions({
            tabBarStyle: {
              backgroundColor: '#FFFFFF',
              borderTopWidth: 1,
              borderTopColor: '#E5E7EB',
              height: Platform.OS === 'ios' ? 60 + insets.bottom : 60,
              paddingBottom: Platform.OS === 'ios' ? insets.bottom : 8,
              paddingTop: 8,
            },
          });
        }
      };
    }, [navigation, insets.bottom])
  );

  useEffect(() => {
    loadRecentSearches();
    loadPopularProducts();
  }, []);

  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    if (searchQuery.trim().length >= 2) {
      searchTimeoutRef.current = setTimeout(() => {
        performSearch(searchQuery.trim());
      }, 500);
    } else if (searchQuery.trim().length === 0 && hasSearched) {
      setRawSearchResults([]);
      setSearchResults([]);
      setHasSearched(false);
      setSearchError(null);
    }

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [searchQuery]);

  useEffect(() => {
    if (hasSearched) {
      applyFiltersToResults();
    }
  }, [filters, rawSearchResults.length, hasSearched]);

  const loadRecentSearches = async () => {
    try {
      const stored = await AsyncStorage.getItem(RECENT_SEARCHES_KEY);
      if (stored) {
        const searches = JSON.parse(stored);
        setRecentSearches(searches);
      }
    } catch (error) {
      console.error('Error loading recent searches:', error);
    }
  };

  const saveRecentSearch = async (query: string) => {
    try {
      const trimmedQuery = query.trim();
      if (!trimmedQuery) return;

      let updatedSearches = [...recentSearches];
      updatedSearches = updatedSearches.filter((s) => s.toLowerCase() !== trimmedQuery.toLowerCase());
      updatedSearches.unshift(trimmedQuery);
      updatedSearches = updatedSearches.slice(0, MAX_RECENT_SEARCHES);
      
      setRecentSearches(updatedSearches);
      await AsyncStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updatedSearches));
    } catch (error) {
      console.error('Error saving recent search:', error);
    }
  };

  const loadPopularProducts = async () => {
    try {
      setIsLoadingPopular(true);
      const result = await getAllProducts(0, 10, 'productId', 'DESC');
      if (result.data?.content) {
        setPopularProducts(result.data.content);
      }
    } catch (error) {
      console.error('Error loading popular products:', error);
    } finally {
      setIsLoadingPopular(false);
    }
  };

  const performSearch = async (query: string) => {
    if (!query.trim()) {
      setRawSearchResults([]);
      setSearchResults([]);
      setHasSearched(false);
      setSearchError(null);
      return;
    }

    setIsSearching(true);
    setHasSearched(true);
    setSearchError(null);
    
    try {
      console.log('Searching for:', query);
      
      let apiResults: ProductResponse[] = [];
      try {
        const result = await searchProducts(query, 0, 100);
        console.log('Search API response:', result);
        
        if (result.data?.content && result.data.content.length > 0) {
          apiResults = result.data.content;
          console.log(`API found ${apiResults.length} products for query: "${query}"`);
        } else {
          console.log('API returned empty results');
        }
      } catch (apiError) {
        console.log('API search failed, trying fallback:', apiError);
      }
      try {
        console.log('Performing local search to complement API results...');
        const allProductsResult = await getAllProducts(0, 200, 'productId', 'DESC');
        if (allProductsResult.data?.content) {
          const allProducts = allProductsResult.data.content;
          const queryLower = query.toLowerCase().trim();
          const queryWords = queryLower.split(/\s+/).filter(word => word.length > 0);
          
          const localResults = allProducts.filter((product) => {
            const productName = (product.productName || '').toLowerCase();
            const categoryName = (product.categoryName || '').toLowerCase();
            const description = (product.description || '').toLowerCase();
            
            return queryWords.some(word => 
              productName.includes(word) ||
              categoryName.includes(word) ||
              description.includes(word)
            ) || 
            productName.includes(queryLower) ||
            categoryName.includes(queryLower) ||
            description.includes(queryLower);
          });
          
          console.log(`Local search found ${localResults.length} products`);
          
          const combinedResults = [...apiResults];
          const apiProductIds = new Set(apiResults.map(p => p.productId));
          
          let localAddedCount = 0;
          localResults.forEach(localProduct => {
            if (!apiProductIds.has(localProduct.productId)) {
              combinedResults.push(localProduct);
              localAddedCount++;
            }
          });
          
          console.log(`Combined results: ${apiResults.length} from API + ${localAddedCount} new from local = ${combinedResults.length} total`);
          
          if (combinedResults.length > 0) {
            setRawSearchResults(combinedResults);
            setSearchError(null);
          } else {
            setRawSearchResults([]);
          }
        } else {
          setRawSearchResults(apiResults);
        }
      } catch (fallbackError) {
        console.error('Local search error:', fallbackError);
        if (apiResults.length > 0) {
          setRawSearchResults(apiResults);
        } else {
          setRawSearchResults([]);
        }
      }
      
      await saveRecentSearch(query);
    } catch (error: any) {
      console.error('Error in search process:', error);
      setSearchError(error.message || 'Search failed');
      setRawSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const applyFiltersToResults = () => {
    if (!hasSearched) {
      setSearchResults([]);
      return;
    }

    if (rawSearchResults.length === 0) {
      setSearchResults([]);
      return;
    }

    if (!hasActiveFilters()) {
      setSearchResults([...rawSearchResults]);
      return;
    }

    let filtered = [...rawSearchResults];
    console.log(`Applying filters to ${filtered.length} raw results`);

    if (filters.priceRange.min !== 0 || filters.priceRange.max !== 10000000) {
      const beforeCount = filtered.length;
      filtered = filtered.filter(
        (product) =>
          product.price >= filters.priceRange.min && product.price <= filters.priceRange.max
      );
      console.log(`Price filter: ${beforeCount} -> ${filtered.length} products`);
    }

    // Filter by category
    if (filters.selectedCategory) {
      const beforeCount = filtered.length;
      filtered = filtered.filter((product) => product.categoryId === filters.selectedCategory);
      console.log(`Category filter (${filters.selectedCategory}): ${beforeCount} -> ${filtered.length} products`);
    }

    // Filter by color - would need to load product colors (simplified for now)
    // Note: This would require async loading of colors for each product
    // For now, we skip color filtering in search to avoid performance issues

    // Filter by rating - skip for now as API doesn't provide rating data

    console.log(`Final filtered results: ${filtered.length} products`);
    setSearchResults(filtered);
  };

  const handleSearchSubmit = () => {
    if (searchQuery.trim()) {
      performSearch(searchQuery.trim());
    }
  };

  const handleRecentSearchPress = (search: string) => {
    setSearchQuery(search);
    performSearch(search);
  };

  const handleRemoveRecentSearch = async (index: number) => {
    const updated = recentSearches.filter((_, i) => i !== index);
    setRecentSearches(updated);
    try {
      await AsyncStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
    } catch (error) {
      console.error('Error removing recent search:', error);
    }
  };

  const handleClearRecentSearches = async () => {
    setRecentSearches([]);
    try {
      await AsyncStorage.removeItem(RECENT_SEARCHES_KEY);
    } catch (error) {
      console.error('Error clearing recent searches:', error);
    }
  };

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

  const handleOpenFilter = () => {
    router.push('/(tabs)/search/filter');
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
        <Text style={styles.productPrice}>{formatVND(item.price)}</Text>
      </View>
    </TouchableOpacity>
  );

  const showSearchResults = hasSearched && (searchQuery.trim().length >= 2 || searchResults.length > 0);
  const showRecentSearches = !showSearchResults && recentSearches.length > 0;
  const showPopularProducts = !showSearchResults && !isLoadingPopular;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <View style={styles.searchBarContainer}>
          <Ionicons name="search" size={20} color="#9CA3AF" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search products..."
            placeholderTextColor="#9CA3AF"
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={handleSearchSubmit}
            returnKeyType="search"
            autoFocus
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => {
              setSearchQuery('');
              setRawSearchResults([]);
              setSearchResults([]);
              setHasSearched(false);
              setSearchError(null);
            }}>
              <Ionicons name="close-circle" size={20} color="#9CA3AF" />
            </TouchableOpacity>
          )}
          <TouchableOpacity onPress={handleOpenFilter}>
            <Ionicons name="options-outline" size={20} color="#9CA3AF" />
          </TouchableOpacity>
        </View>
      </View>

      {isSearching ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#5D4037" />
          <Text style={styles.loadingText}>Searching...</Text>
        </View>
      ) : showSearchResults ? (
        <View style={styles.resultsContainer}>
          <View style={styles.filterIndicator}>
            <Text style={styles.filterIndicatorText}>
              {searchResults.length} {searchResults.length === 1 ? 'result' : 'results'} found
              {hasActiveFilters() && ` (${rawSearchResults.length} before filters)`}
            </Text>
            {hasActiveFilters() && (
              <TouchableOpacity
                onPress={() => router.push('/(tabs)/search/filter')}
                style={styles.filterButton}
              >
                <Ionicons name="filter" size={20} color="#5D4037" />
              </TouchableOpacity>
            )}
          </View>
          {searchError && (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{searchError}</Text>
            </View>
          )}
          {searchResults.length > 0 ? (
            <FlatList
              data={searchResults}
              renderItem={renderProduct}
              keyExtractor={(item) => item.productId.toString()}
              numColumns={2}
              contentContainerStyle={styles.listContent}
              columnWrapperStyle={styles.row}
              showsVerticalScrollIndicator={false}
              ListHeaderComponent={
                <View style={styles.resultsHeader}>
                  <Text style={styles.resultsHeaderText}>
                    Search results for "{searchQuery}"
                  </Text>
                  {rawSearchResults.length > searchResults.length && (
                    <Text style={styles.filteredInfo}>
                      {rawSearchResults.length - searchResults.length} products hidden by filters
                    </Text>
                  )}
                </View>
              }
            />
          ) : rawSearchResults.length > 0 ? (
            <View style={styles.emptyContainer}>
              <Ionicons name="filter-outline" size={64} color="#9CA3AF" />
              <Text style={styles.emptyText}>No products match your filters</Text>
              <Text style={styles.emptySubtext}>
                Found {rawSearchResults.length} products, but none match your current filters
              </Text>
              <TouchableOpacity
                style={styles.clearFiltersButton}
                onPress={() => router.push('/(tabs)/search/filter')}
              >
                <Text style={styles.clearFiltersText}>Adjust Filters</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.emptyContainer}>
              <Ionicons name="search-outline" size={64} color="#9CA3AF" />
              <Text style={styles.emptyText}>No products found</Text>
              <Text style={styles.emptySubtext}>
                Try a different search term{hasActiveFilters() && ' or adjust your filters'}
              </Text>
            </View>
          )}
        </View>
      ) : (
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          {/* Recent Searches */}
          {showRecentSearches && (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Recent Searches</Text>
                <TouchableOpacity onPress={handleClearRecentSearches}>
                  <Ionicons name="trash-outline" size={20} color="#9CA3AF" />
                </TouchableOpacity>
              </View>
              <View style={styles.tagsContainer}>
                {recentSearches.map((search, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.tag}
                    onPress={() => handleRecentSearchPress(search)}
                  >
                    <Ionicons name="time-outline" size={16} color="#6B7280" />
                    <Text style={styles.tagText}>{search}</Text>
                    <TouchableOpacity
                      onPress={() => handleRemoveRecentSearch(index)}
                      style={styles.tagClose}
                    >
                      <Ionicons name="close" size={16} color="#6B7280" />
                    </TouchableOpacity>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

          {/* Popular This Week */}
          {showPopularProducts && (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Popular Products</Text>
                <TouchableOpacity onPress={() => router.push('/products' as any)}>
                  <Text style={styles.showAll}>Show all</Text>
                </TouchableOpacity>
              </View>
              {isLoadingPopular ? (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator size="small" color="#5D4037" />
                </View>
              ) : (
                <FlatList
                  data={popularProducts}
                  renderItem={renderProduct}
                  keyExtractor={(item) => item.productId.toString()}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.popularProductsList}
                />
              )}
            </View>
          )}
        </ScrollView>
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
    paddingHorizontal: 20,
    paddingVertical: Platform.OS === 'ios' ? 12 : 16,
    paddingTop: Platform.OS === 'ios' ? 8 : 16,
    backgroundColor: '#FFFFFF',
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  searchBarContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    gap: 8,
  },
  searchIcon: {
    marginRight: 4,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Product Sans Medium',
    fontWeight: '500',
    color: '#000',
  },
  scrollContent: {
    paddingBottom: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    fontFamily: 'Product Sans Medium',
    fontWeight: '500',
    color: '#6B7280',
  },
  resultsContainer: {
    flex: 1,
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
    flex: 1,
    fontSize: 14,
    fontFamily: 'Product Sans Medium',
    fontWeight: '500',
    color: '#6B7280',
  },
  filterButton: {
    padding: 4,
    marginLeft: 8,
  },
  errorContainer: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: '#FEF2F2',
    borderBottomWidth: 1,
    borderBottomColor: '#FEE2E2',
  },
  errorText: {
    fontSize: 14,
    fontFamily: 'Product Sans Medium',
    fontWeight: '500',
    color: '#DC2626',
  },
  resultsHeader: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 12,
  },
  resultsHeaderText: {
    fontSize: 16,
    fontFamily: 'Product Sans Medium',
    fontWeight: '500',
    color: '#000',
    marginBottom: 4,
  },
  filteredInfo: {
    fontSize: 12,
    fontFamily: 'Product Sans Medium',
    fontWeight: '500',
    color: '#6B7280',
    marginTop: 4,
  },
  listContent: {
    padding: 20,
    paddingTop: 0,
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
  },
  section: {
    paddingHorizontal: 20,
    paddingVertical: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Product Sans Medium',
    fontWeight: '500',
    color: '#000',
  },
  showAll: {
    fontSize: 14,
    fontFamily: 'Product Sans Medium',
    fontWeight: '500',
    color: '#1F2937',
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 8,
  },
  tagText: {
    fontSize: 14,
    fontFamily: 'Product Sans Medium',
    fontWeight: '500',
    color: '#000',
  },
  tagClose: {
    padding: 2,
  },
  popularProductsList: {
    paddingRight: 20,
    gap: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 80,
    paddingHorizontal: 20,
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
    textAlign: 'center',
    marginBottom: 16,
  },
  clearFiltersButton: {
    backgroundColor: '#5D4037',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 8,
  },
  clearFiltersText: {
    fontSize: 14,
    fontFamily: 'Product Sans Medium',
    fontWeight: '500',
    color: '#FFFFFF',
  },
});
