import { getAllProducts, getColorsByProductId, getProductById, getProductsByCategory, getSizesByProductId } from '@/apis';
import { useCart } from '@/contexts/CartContext';
import { useWishlist } from '@/contexts/WishlistContext';
import { ColorResponse } from '@/types/color';
import { ProductResponse } from '@/types/product';
import { SizeResponse } from '@/types/size';
import { formatVND } from '@/utils/formatCurrency';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Dimensions,
    FlatList,
    Image,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

export default function ProductDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const insets = useSafeAreaInsets();
  const { addItem } = useCart();
  const { addItem: addToWishlist, removeItem: removeFromWishlist, isInWishlist } = useWishlist();
  const [product, setProduct] = useState<ProductResponse | null>(null);
  const [colors, setColors] = useState<ColorResponse[]>([]);
  const [sizes, setSizes] = useState<SizeResponse[]>([]);
  const [similarProducts, setSimilarProducts] = useState<ProductResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedColor, setSelectedColor] = useState<number | null>(null);
  const [selectedSize, setSelectedSize] = useState<number | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [expandedDescription, setExpandedDescription] = useState(false);
  const [expandedReviews, setExpandedReviews] = useState(false);
  const [expandedSimilar, setExpandedSimilar] = useState(false);

  useEffect(() => {
    loadProductData();
  }, [id]);

  useEffect(() => {
    // Reset quantity when product changes
    setQuantity(1);
  }, [product?.productId]);

  const handleToggleFavorite = () => {
    if (!product) return;
    
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

  const loadProductData = async () => {
    if (!id) return;
    
    setIsLoading(true);
    try {
      const productId = typeof id === 'string' ? parseInt(id, 10) : Array.isArray(id) ? parseInt(id[0], 10) : id;
      
      if (isNaN(productId)) {
        throw new Error('Invalid product ID');
      }
      
      const productData = await getProductById(productId);
      setProduct(productData);

      try {
        const colorsData = await getColorsByProductId(productId);
        if (colorsData.data && colorsData.data.length > 0) {
          setColors(colorsData.data);
          setSelectedColor(colorsData.data[0].colorId);
        }
      } catch (colorError) {
        console.warn('Error loading colors:', colorError);
      }

      try {
        const sizesData = await getSizesByProductId(productId);
        console.log('111111111111111111111111111111111111111111111111111111111:', sizesData.data);
        if (sizesData.data && sizesData.data?.length > 0) {
          setSizes(sizesData.data);
          setSelectedSize(sizesData.data[0].sizeId);
        } 
      } catch (sizeError) {
        console.warn('Error loading sizes:', sizeError);
      }

      try {
        let similarProductsData: ProductResponse[] = [];
        if (productData.categoryId) {
          const categoryProducts = await getProductsByCategory(productData.categoryId, 0, 10);
          if (categoryProducts.data?.content) {
            similarProductsData = categoryProducts.data.content.filter(
              (p: ProductResponse) => p.productId !== productId
            ).slice(0, 3);
          }
        }
        
        if (similarProductsData.length < 3) {
          const allProducts = await getAllProducts(0, 10, 'productId', 'DESC');
          if (allProducts.data?.content) {
            const additional = allProducts.data.content
              .filter((p: ProductResponse) => p.productId !== productId && !similarProductsData.find((sp: ProductResponse) => sp.productId === p.productId))
              .slice(0, 3 - similarProductsData.length);
            similarProductsData = [...similarProductsData, ...additional];
          }
        }
        
        setSimilarProducts(similarProductsData);
      } catch (similarError) {
        console.warn('Error loading similar products:', similarError);
        setSimilarProducts([]);
      }
    } catch (error) {
      console.error('Error loading product data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const reviews = [
    {
      id: 1,
      name: 'Jennifer Rose',
      avatar: 'https://via.placeholder.com/40/9CA3AF/FFFFFF?text=JR',
      rating: 5,
      time: '5m ago',
      text: 'I love it. Awesome customer service!! Helped me out with adding an additional item to my order. Thanks again!',
    },
    {
      id: 2,
      name: 'Kelly Rihana',
      avatar: 'https://via.placeholder.com/40/9CA3AF/FFFFFF?text=KR',
      rating: 5,
      time: '8m ago',
      text: "I'm very happy with order, it was delivered on and good quality. Recommended.",
    },
  ];

  const ratingBreakdown = {
    5: 90,
    4: 12,
    3: 5,
    2: 3,
    1: 0,
  };


  const getColorHex = (colorName: string): string => {
    const colorMap: { [key: string]: string } = {
      'Beige': '#F5E6D3',
      'Black': '#000000',
      'White': '#FFFFFF',
      'Coral': '#FF6B6B',
      'Red': '#FF0000',
      'Blue': '#0000FF',
      'Green': '#00FF00',
      'Yellow': '#FFFF00',
      'Pink': '#FFC0CB',
      'Gray': '#808080',
      'Grey': '#808080',
      'Brown': '#A52A2A',
      'Purple': '#800080',
      'Orange': '#FFA500',
      'Cream': '#F5F5DC',
      'Khaki': '#F0E68C',
      'Maroon': '#800000',
      'Navy': '#000080',
      'Olive': '#808000',
      'Silver': '#C0C0C0',
      'Gold': '#FFD700',
      'Platinum': '#E5E4E2',
      'Emerald': '#50C878',
      'Turquoise': '#40E0D0',
      'Violet': '#8A2BE2',
      'Indigo': '#4B0082',
      'Lavender': '#E6E6FA',
      'Fuchsia': '#FF00FF',
      'Magenta': '#FF00FF',
      'Crimson': '#DC143C',
      'Ruby': '#E0115F',
      'Sapphire': '#0F52BA',
      'Topaz': '#FFC300',
      'Cyan': '#00FFFF',
      'Teal': '#008080',
    };
    return colorMap[colorName] || '#CCCCCC';
  };

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    const starColor = "#20B2AA";

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Ionicons key={i} name="star" size={16} color={starColor} />
      );
    }
    if (hasHalfStar) {
      stars.push(
        <Ionicons key="half" name="star-half" size={16} color={starColor} />
      );
    }
    for (let i = stars.length; i < 5; i++) {
      stars.push(
        <Ionicons key={i} name="star-outline" size={16} color={starColor} />
      );
    }
    return stars;
  };

  const handleAddToCart = () => {
    if (!product) return;

    if (product.stockQuantity < quantity) {
      Alert.alert('Lỗi', 'Số lượng sản phẩm không đủ trong kho');
      return;
    }
    if (colors.length > 0 && !selectedColor) {
      Alert.alert('Lỗi', 'Vui lòng chọn màu sắc');
      return;
    }

    if (sizes.length > 0 && !selectedSize) {
      Alert.alert('Lỗi', 'Vui lòng chọn kích thước');
      return;
    }
    const selectedColorData = colors.find(c => c.colorId === selectedColor);
    const selectedSizeData = sizes.find(s => s.sizeId === selectedSize);

    addItem({
      productId: product.productId,
      productName: product.productName,
      price: product.price,
      imageUrl: product.imageUrl,
      quantity: quantity,
      colorId: selectedColor || undefined,
      colorName: selectedColorData?.colorName,
      sizeId: selectedSize || undefined,
      sizeName: selectedSizeData?.sizeName,
      stockQuantity: product.stockQuantity,
    });

    Alert.alert(
      'Thành công',
      'Đã thêm sản phẩm vào giỏ hàng',
      [
        {
          text: 'Tiếp tục mua sắm',
          style: 'cancel',
        },
        {
          text: 'Xem giỏ hàng',
          onPress: () => router.push('/(tabs)/cart' as any),
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: Platform.OS === 'ios' ? 0 : insets.top }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.headerButton}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={handleToggleFavorite}
          style={styles.headerButton}
        >
          <Ionicons
            name={product && isInWishlist(product.productId) ? "heart" : "heart-outline"}
            size={24}
            color={product && isInWishlist(product.productId) ? "#FF6B6B" : "#000"}
          />
        </TouchableOpacity>
      </View>

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#5D4037" />
        </View>
      ) : product ? (
        <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollView}>
          {/* Product Image Carousel */}
          <View style={styles.imageContainer}>
            <FlatList
              data={product.imageUrl ? [product.imageUrl] : []}
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              keyExtractor={(item, index) => index.toString()}
              onMomentumScrollEnd={(event) => {
                const index = Math.round(event.nativeEvent.contentOffset.x / width);
                setCurrentImageIndex(index);
              }}
              renderItem={({ item }) => (
                <Image
                  source={{ uri: item }}
                  style={styles.productImage}
                  resizeMode="cover"
                />
              )}
            />
            {product.imageUrl && (
              <View style={styles.imageDots}>
                <View
                  style={[
                    styles.dot,
                    styles.dotActive,
                  ]}
                />
              </View>
            )}
          </View>

          {/* Product Info */}
          <View style={styles.productInfo}>
            <View style={styles.productHeader}>
              <Text style={styles.productName}>{product.productName}</Text>
              <Text style={styles.productPrice}>{formatVND(product.price)}</Text>
            </View>

            {/* Rating */}
            <View style={styles.ratingContainer}>
              <View style={styles.starsContainer}>
                {renderStars(4.5)}
              </View>
              <Text style={styles.reviewCount}>(83)</Text>
            </View>

            {/* Color Selection */}
            {(colors.length > 0 || true) && (
              <View>
                <View style={styles.divider} />
                <View style={styles.selectionRow}>
                {colors.length > 0 && (
                  <View style={styles.selectionGroup}>
                    <Text style={styles.selectionLabel}>Color</Text>
                    <View style={styles.colorContainer}>
                      {colors.map((color) => (
                        <TouchableOpacity
                          key={color.colorId}
                          onPress={() => setSelectedColor(color.colorId)}
                          style={[
                            styles.colorSwatch,
                            {
                              backgroundColor: getColorHex(color.colorName),
                              borderWidth: selectedColor === color.colorId ? 3 : 1,
                              borderColor: selectedColor === color.colorId ? '#000' : '#E5E7EB',
                            },
                          ]}
                        />
                      ))}
                    </View>
                  </View>
                )}

                {/* Size Selection */}
                <View style={styles.selectionGroup}>
                  <Text style={styles.selectionLabel}>Size</Text>
                  {sizes.length > 0 ? (
                    <View style={styles.sizeContainer}>
                      {sizes.map((size) => (
                        <TouchableOpacity
                          key={size.sizeId}
                          onPress={() => setSelectedSize(size.sizeId)}
                          style={[
                            styles.sizeButton,
                            selectedSize === size.sizeId && styles.sizeButtonSelected,
                          ]}
                        >
                          <Text
                            style={[
                              styles.sizeText,
                              selectedSize === size.sizeId && styles.sizeTextSelected,
                            ]}
                          >
                            {size.sizeName}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  ) : null}
                </View>
                </View>
              </View>
            )}

            {/* Quantity Selector */}
            <View style={styles.quantitySection}>
              <Text style={styles.quantityLabel}>Quantity</Text>
              <View style={styles.quantitySelector}>
                <TouchableOpacity
                  style={[styles.quantityButtonSmall, quantity <= 1 && styles.quantityButtonDisabled]}
                  onPress={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                >
                  <Ionicons name="remove" size={20} color={quantity <= 1 ? "#9CA3AF" : "#000"} />
                </TouchableOpacity>
                <Text style={styles.quantityText}>{quantity}</Text>
                <TouchableOpacity
                  style={[
                    styles.quantityButtonSmall,
                    quantity >= (product?.stockQuantity || 1) && styles.quantityButtonDisabled
                  ]}
                  onPress={() => setQuantity(Math.min(product?.stockQuantity || 1, quantity + 1))}
                  disabled={quantity >= (product?.stockQuantity || 1)}
                >
                  <Ionicons 
                    name="add" 
                    size={20} 
                    color={quantity >= (product?.stockQuantity || 1) ? "#9CA3AF" : "#000"} 
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* Description */}
            {product.description && (
              <>
                <TouchableOpacity
                  style={styles.sectionHeader}
                  onPress={() => setExpandedDescription(!expandedDescription)}
                >
                  <Text style={styles.sectionTitle}>Description</Text>
                  <Ionicons
                    name={expandedDescription ? "chevron-up" : "chevron-down"}
                    size={20}
                    color="#000"
                  />
                </TouchableOpacity>
                {expandedDescription && (
                  <View style={styles.descriptionContainer}>
                    <Text style={styles.descriptionText}>{product.description}</Text>
                    <Text style={styles.readMore}>Read more</Text>
                  </View>
                )}
              </>
            )}

          {/* Reviews */}
          <TouchableOpacity
            style={styles.sectionHeader}
            onPress={() => setExpandedReviews(!expandedReviews)}
          >
            <Text style={styles.sectionTitle}>Reviews</Text>
            <Ionicons
              name={expandedReviews ? "chevron-up" : "chevron-down"}
              size={20}
              color="#000"
            />
          </TouchableOpacity>
          {expandedReviews && (
            <View style={styles.reviewsContainer}>
              {/* Overall Rating */}
              <View style={styles.overallRating}>
                <View style={styles.ratingNumberContainer}>
                  <Text style={styles.ratingNumber}>4.9</Text>
                  <Text style={styles.ratingOutOf}>OUT OF 5</Text>
                </View>
                <View style={styles.ratingStarsContainer}>
                  <View style={styles.starsContainer}>
                    {renderStars(4.9)}
                  </View>
                  <Text style={styles.ratingsCount}>85 ratings</Text>
                </View>
              </View>

              {/* Rating Breakdown */}
              <View style={styles.ratingBreakdown}>
                {[5, 4, 3, 2, 1].map((star) => (
                  <View key={star} style={styles.breakdownRow}>
                    <Text style={styles.breakdownStar}>{star}</Text>
                    <View style={styles.breakdownBarContainer}>
                      <View
                        style={[
                          styles.breakdownBar,
                          {
                            width: `${ratingBreakdown[star as keyof typeof ratingBreakdown]}%`,
                            backgroundColor: '#4CAF50',
                          },
                        ]}
                      />
                    </View>
                    <Text style={styles.breakdownPercent}>
                      {ratingBreakdown[star as keyof typeof ratingBreakdown]}%
                    </Text>
                  </View>
                ))}
              </View>

              {/* Review Actions */}
              <View style={styles.reviewActions}>
                <Text style={styles.reviewCountText}>47 Reviews</Text>
                <TouchableOpacity style={styles.writeReviewButton}>
                  <Ionicons name="create-outline" size={16} color="#000" />
                  <Text style={styles.writeReviewText}>WRITE A REVIEW</Text>
                </TouchableOpacity>
              </View>

              {/* Individual Reviews */}
              {reviews.map((review) => (
                <View key={review.id} style={styles.reviewItem}>
                  <Image
                    source={{ uri: review.avatar }}
                    style={styles.reviewAvatar}
                  />
                  <View style={styles.reviewContent}>
                    <View style={styles.reviewHeader}>
                      <Text style={styles.reviewName}>{review.name}</Text>
                      <View style={styles.reviewStars}>
                        {renderStars(review.rating)}
                      </View>
                      <Text style={styles.reviewTime}>{review.time}</Text>
                    </View>
                    <Text style={styles.reviewText}>{review.text}</Text>
                  </View>
                </View>
              ))}
            </View>
          )}

          {/* Similar Products */}
          <TouchableOpacity
            style={styles.sectionHeader}
            onPress={() => setExpandedSimilar(!expandedSimilar)}
          >
            <Text style={styles.sectionTitle}>Similar Product</Text>
            <Ionicons
              name={expandedSimilar ? "chevron-up" : "chevron-down"}
              size={20}
              color="#000"
            />
          </TouchableOpacity>
          {expandedSimilar && (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.similarProductsContainer}
            >
              {similarProducts.length > 0 ? (
                similarProducts.map((item) => (
                  <TouchableOpacity
                    key={item.productId}
                    style={styles.similarProductCard}
                    onPress={() => router.push(`/product/${item.productId}` as any)}
                  >
                    <Image
                      source={
                        item.imageUrl
                          ? { uri: item.imageUrl }
                          : require('@/assets/images/24642656f175b762469766070dae1ee73196af89.png')
                      }
                      style={styles.similarProductImage}
                      resizeMode="cover"
                    />
                    <Text style={styles.similarProductName} numberOfLines={2}>
                      {item.productName}
                    </Text>
                    <Text style={styles.similarProductPrice}>
                      {formatVND(item.price)}
                    </Text>
                  </TouchableOpacity>
                ))
              ) : (
                <Text style={styles.noSimilarProducts}>Không có sản phẩm tương tự</Text>
              )}
            </ScrollView>
          )}
        </View>
        </ScrollView>
      ) : (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Không thể tải thông tin sản phẩm</Text>
        </View>
      )}

      {/* Add To Cart Button */}
      {product && (
        <View style={[styles.bottomBar, { paddingBottom: Platform.OS === 'ios' ? insets.bottom : 0 }]}>
          <TouchableOpacity style={styles.addToCartButton} onPress={handleAddToCart}>
            <Ionicons name="bag-outline" size={24} color="#FFF" />
            <Text style={styles.addToCartText}>Add To Cart</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: '#FFF',
  },
  headerButton: {
    padding: 8,
  },
  scrollView: {
    flex: 1,
  },
  imageContainer: {
    width: width,
    height: width * 1.25,
    position: 'relative',
    overflow: 'hidden',
  },
  productImage: {
    width: width,
    height: width * 1.25,
    backgroundColor: '#F5E6D3',
    borderRadius: 12,
  },
  imageDots: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#9CA3AF',
    marginHorizontal: 4,
  },
  dotActive: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#000',
  },
  productInfo: {
    padding: 20,
  },
  productHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  productName: {
    fontSize: 24,
    fontFamily: 'Product Sans Medium',
    fontWeight: '500',
    color: '#000',
    flex: 1,
  },
  productPrice: {
    fontSize: 24,
    fontFamily: 'Product Sans Medium',
    fontWeight: '500',
    color: '#000',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  starsContainer: {
    flexDirection: 'row',
    marginRight: 8,
  },
  reviewCount: {
    fontSize: 14,
    fontFamily: 'Product Sans Medium',
    fontWeight: '500',
    color: '#1F2937',
  },
  divider: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginBottom: 24,
  },
  selectionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 32,
    gap: 20,
  },
  selectionGroup: {
    flex: 1,
  },
  selectionLabel: {
    fontSize: 14,
    fontFamily: 'Product Sans Medium',
    fontWeight: '500',
    color: '#000',
    marginBottom: 12,
  },
  quantitySection: {
    marginTop: 24,
    marginBottom: 24,
  },
  quantityLabel: {
    fontSize: 14,
    fontFamily: 'Product Sans Medium',
    fontWeight: '500',
    color: '#000',
    marginBottom: 12,
  },
  quantitySelector: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    alignSelf: 'flex-start',
    paddingHorizontal: 4,
    paddingVertical: 4,
  },
  quantityButtonSmall: {
    padding: 8,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 36,
  },
  quantityButtonDisabled: {
    opacity: 0.5,
  },
  quantityText: {
    fontSize: 16,
    fontFamily: 'Product Sans Medium',
    fontWeight: '500',
    color: '#000',
    paddingHorizontal: 16,
    minWidth: 40,
    textAlign: 'center',
  },
  colorContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  colorSwatch: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
  },
  sizeContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  sizeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sizeButtonSelected: {
    backgroundColor: '#000',
  },
  sizeText: {
    fontSize: 14,
    fontFamily: 'Product Sans Medium',
    fontWeight: '500',
    color: '#000',
  },
  sizeTextSelected: {
    color: '#FFF',
  },
  noSizeText: {
    fontSize: 14,
    fontFamily: 'Product Sans Medium',
    fontWeight: '500',
    color: '#6B7280',
    fontStyle: 'italic',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Product Sans Medium',
    fontWeight: '500',
    color: '#000',
  },
  descriptionContainer: {
    paddingBottom: 16,
  },
  descriptionText: {
    fontSize: 14,
    fontFamily: 'Product Sans Medium',
    fontWeight: '500',
    color: '#1F2937',
    lineHeight: 20,
    marginBottom: 8,
  },
  readMore: {
    fontSize: 14,
    fontFamily: 'Product Sans Medium',
    fontWeight: '500',
    color: '#5D4037',
  },
  reviewsContainer: {
    paddingBottom: 16,
  },
  overallRating: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  ratingNumberContainer: {
    marginRight: 24,
  },
  ratingNumber: {
    fontSize: 32,
    fontFamily: 'Product Sans Medium',
    fontWeight: '500',
    color: '#000',
  },
  ratingOutOf: {
    fontSize: 12,
    fontFamily: 'Product Sans Medium',
    fontWeight: '500',
    color: '#1F2937',
  },
  ratingStarsContainer: {
    flex: 1,
  },
  ratingsCount: {
    fontSize: 14,
    fontFamily: 'Product Sans Medium',
    fontWeight: '500',
    color: '#1F2937',
    marginTop: 4,
  },
  ratingBreakdown: {
    marginBottom: 24,
  },
  breakdownRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  breakdownStar: {
    fontSize: 14,
    fontFamily: 'Product Sans Medium',
    fontWeight: '500',
    color: '#000',
    width: 20,
  },
  breakdownBarContainer: {
    flex: 1,
    height: 8,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
    marginHorizontal: 12,
    overflow: 'hidden',
  },
  breakdownBar: {
    height: '100%',
    borderRadius: 4,
  },
  breakdownPercent: {
    fontSize: 12,
    fontFamily: 'Product Sans Medium',
    fontWeight: '500',
    color: '#1F2937',
    width: 40,
    textAlign: 'right',
  },
  reviewActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  reviewCountText: {
    fontSize: 14,
    fontFamily: 'Product Sans Medium',
    fontWeight: '500',
    color: '#000',
  },
  writeReviewButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  writeReviewText: {
    fontSize: 12,
    fontFamily: 'Product Sans Medium',
    fontWeight: '500',
    color: '#000',
  },
  reviewItem: {
    flexDirection: 'row',
    marginBottom: 24,
  },
  reviewAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E5E7EB',
    marginRight: 12,
  },
  reviewContent: {
    flex: 1,
  },
  reviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    flexWrap: 'wrap',
  },
  reviewName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
    marginRight: 8,
  },
  reviewStars: {
    flexDirection: 'row',
    marginRight: 8,
  },
  reviewTime: {
    fontSize: 12,
    fontFamily: 'Product Sans Medium',
    fontWeight: '500',
    color: '#1F2937',
  },
  reviewText: {
    fontSize: 14,
    fontFamily: 'Product Sans Medium',
    fontWeight: '500',
    color: '#1F2937',
    lineHeight: 20,
  },
  similarProductsContainer: {
    paddingBottom: 16,
  },
  similarProductCard: {
    width: 160,
    marginRight: 16,
  },
  similarProductImage: {
    width: 160,
    height: 200,
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    marginBottom: 12,
  },
  similarProductName: {
    fontSize: 14,
    fontFamily: 'Product Sans Medium',
    fontWeight: '500',
    color: '#000',
    marginBottom: 4,
  },
  similarProductPrice: {
    fontSize: 16,
    fontFamily: 'Product Sans Medium',
    fontWeight: '500',
    color: '#000',
  },
  noSimilarProducts: {
    fontSize: 14,
    fontFamily: 'Product Sans Medium',
    fontWeight: '500',
    color: '#1F2937',
    textAlign: 'center',
    paddingVertical: 20,
    width: width - 40,
  },
  bottomBar: {
    backgroundColor: '#FFF',
    width: '100%',
  },
  addToCartButton: {
    backgroundColor: '#363636',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 23,
    paddingBottom: 18,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    gap: 8,
    width: '100%',
  },
  addToCartText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFF',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  errorText: {
    fontSize: 16,
    color: '#6B7280',
  },
});

