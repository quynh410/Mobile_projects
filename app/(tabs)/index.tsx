import { getAllProducts } from '@/apis';
import BannerCarousel from '@/components/BannerCarousel';
import { ProductResponse } from '@/types/product';
import { formatVND } from '@/utils/formatCurrency';
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

export default function HomeScreen() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState('Women');
  const [featureProducts, setFeatureProducts] = useState<ProductResponse[]>([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(false);

  useEffect(() => {
    loadFeatureProducts();
  }, []);

  const loadFeatureProducts = async () => {
    setIsLoadingProducts(true);
    try {
      const result = await getAllProducts(0, 10, 'productId', 'DESC');
      if (result.data?.content) {
        setFeatureProducts(result.data.content.slice(0, 3));
      }
    } catch (error) {
      console.error('Error loading products:', error);
      setFeatureProducts([
        { productId: 1, productName: 'Tur Beresh Sweater', price: 959760, imageUrl: 'https://via.placeholder.com/160x200/5D4037/FFFFFF?text=Sweater', stockQuantity: 10 },
        { productId: 2, productName: 'Lang-Sleeve Dress', price: 1080000, imageUrl: 'https://via.placeholder.com/160x200/D4A574/FFFFFF?text=Dress', stockQuantity: 5 },
        { productId: 3, productName: 'Product Name', price: 1920000, imageUrl: 'https://via.placeholder.com/160x200/E5E7EB/000000?text=Product', stockQuantity: 8 },
      ]);
    } finally {
      setIsLoadingProducts(false);
    }
  };

  const bannerData = [
    {
      id: '1',
      source: require('@/assets/images/15fabd854b7cb3b15474b1d58ae3661dd03a76db.jpg'),
      subtitle: 'Autumn Collection',
      titleLines: ['2021'],
      layout: 'full' as const,
    },
    {
      id: '2',
      source: require('@/assets/images/071373fad51ad0143a98105907f84f8d80c53d58.png'),
      subtitle: 'NEW COLLECTION',
      titleLines: ['HANG OUT', '& PARTY'],
      layout: 'half' as const,
    },
    {
      id: '3',
      source: require('@/assets/images/2059944f83f665e563d29b20be6188383e033306.png'),
      subtitle: 'Summer Collection',
      titleLines: ['2024'],
      layout: 'half' as const,
    },
  ];

  const categories = [
    { id: 'Women', icon: 'female', color: '#5D4037' },
    { id: 'Men', icon: 'male', color: '#E5E7EB' },
    { id: 'Accessories', icon: 'glasses-outline', color: '#E5E7EB' },
    { id: 'Beauty', icon: 'sparkles-outline', color: '#E5E7EB' },
  ];


  const recommendedProducts = [
    { id: 1, name: 'White fashion hoodie', price: 690000, image: 'https://tse4.mm.bing.net/th/id/OIP.5Q08ZfxziDbgx-3EGaBbcgHaJ3?rs=1&pid=ImgDetMain&o=7&rm=3' },
    { id: 2, name: 'Cotton', price: 720000, image: 'https://tse4.mm.bing.net/th/id/OIP.oUVdFFZ5cJ288C3BZdSBMQHaHw?rs=1&pid=ImgDetMain&o=7&rm=3' },
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

        {/* Promotional Banner - Carousel */}
        <BannerCarousel data={bannerData} interval={3000} />

        {/* Feature Products */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Feature Products</Text>
            <TouchableOpacity onPress={() => router.push('/products' as any)}>
              <Text style={styles.showAll}>Show all</Text>
            </TouchableOpacity>
          </View>
          {isLoadingProducts ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#5D4037" />
            </View>
          ) : (
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.productScroll}>
              {featureProducts.map((product) => (
                <TouchableOpacity
                  key={product.productId}
                  style={styles.productCard}
                  onPress={() => router.push(`/product/${product.productId}` as any)}
                >
                  <Image
                    source={
                      product.imageUrl
                        ? { uri: product.imageUrl }
                        : require('@/assets/images/24642656f175b762469766070dae1ee73196af89.png')
                    }
                    style={styles.productImage}
                    resizeMode="cover"
                  />
                  <View style={styles.productInfo}>
                    <Text style={styles.productName} numberOfLines={2}>
                      {product.productName}
                    </Text>
                    <Text style={styles.productPrice}>
                      {formatVND(product.price)}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          )}
        </View>

        {/* Hang Out & Party Banner */}
        <View style={styles.partyBanner}>
          <View style={styles.partyBannerContent}>
            <Text style={styles.partyBannerSubtitle}>NEW COLLECTION</Text>
            <Text style={styles.partyBannerTitle}>HANG OUT & PARTY</Text>
          </View>
          <Image
            source={{ uri: 'https://tse2.mm.bing.net/th/id/OIP.dSrZTjmh56QOZjn3Q7CaEAHaFj?rs=1&pid=ImgDetMain&o=7&rm=3' }}
            style={styles.partyBannerImage}
            resizeMode="cover"
          />
        </View>

        {/* Recommended */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recommended</Text>
            <TouchableOpacity onPress={() => router.push('/products' as any)}>
              <Text style={styles.showAll}>Show all</Text>
            </TouchableOpacity>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.productScroll}>
            {recommendedProducts.map((product) => (
              <TouchableOpacity
                key={product.id}
                style={styles.recommendedCard}
                onPress={() => router.push(`/product/${product.id}` as any)}
              >
                <Image
                  source={{ uri: product.image }}
                  style={styles.recommendedImage}
                  resizeMode="cover"
                />
                <View style={styles.recommendedInfo}>
                  <Text style={styles.recommendedName}>{product.name}</Text>
                  <Text style={styles.recommendedPrice}>{formatVND(product.price)}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Top Collection */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Top Collection</Text>
            <TouchableOpacity onPress={() => router.push('/products' as any)}>
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
                source={{ uri: 'https://mialala.vn/media/product/250_1104_batch_frame_ga____n_ma___bu__a_ye__u_02.jpg' }}
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
                source={require('@//assets/images/071373fad51ad0143a98105907f84f8d80c53d58.png')}
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
              source={require('@/assets/images/24642656f175b762469766070dae1ee73196af89.png')}
              style={[styles.categoryGridImage, { marginRight: 12 }]}
              resizeMode="cover"
            />
            <View style={styles.categoryGridInfo}>
              <Text style={styles.categoryGridLabel}>T-Shirts</Text>
              <Text style={styles.categoryGridTitle}>The Office Life</Text>
            </View>
          </View>
          <View style={[styles.categoryGridCard, styles.categoryGridCardReversed]}>
            <View style={styles.categoryGridInfo}>
              <Text style={styles.categoryGridLabel}>Dresses</Text>
              <Text style={styles.categoryGridTitle}>Elegant Design</Text>
            </View>
            <Image
              source={require('@/assets/images/2059944f83f665e563d29b20be6188383e033306.png')}
              style={[styles.categoryGridImage, { marginLeft: 12 }]}
              resizeMode="cover"
            />
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
    fontFamily: 'Product Sans Medium',
    fontWeight: '500',
    color: '#1F2937',
  },
  categoryTextSelected: {
    color: '#000',
    fontFamily: 'Product Sans Medium',
    fontWeight: '500',
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
    fontFamily: 'Product Sans Medium',
    fontWeight: '500',
    color: '#FFF',
    marginBottom: 8,
  },
  bannerTitle: {
    fontSize: 32,
    fontFamily: 'Product Sans Medium',
    fontWeight: '500',
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
  productScroll: {
    gap: 16,
  },
  loadingContainer: {
    paddingVertical: 40,
    alignItems: 'center',
    justifyContent: 'center',
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
partyBanner: {
  marginHorizontal: 20,
  marginVertical: 20,
  borderRadius: 16,
  height: 180, 
  overflow: 'hidden', 
  position: 'relative',
},
partyBannerImage: {
  position: 'absolute',
  width: '100%',
  height: '100%',
  top: 0,
  left: 0,
},
partyBannerOverlay: {
  position: 'absolute',
  width: '100%',
  height: '100%',
  backgroundColor: 'rgba(0, 0, 0, 0.4)',
  top: 0,
  left: 0,
},
partyBannerContent: {
  flex: 1,
  padding: 20,
  justifyContent: 'center',
  zIndex: 2,
},
partyBannerSubtitle: {
  fontSize: 12,
  fontFamily: 'Product Sans Medium',
  fontWeight: '500',
  color: '#FFFFFF',
  marginBottom: 8,
  letterSpacing: 2,
},
partyBannerTitle: {
  fontSize: 24,
  fontFamily: 'Product Sans Medium',
  fontWeight: '500',
  color: '#FFFFFF',
  textShadowColor: 'rgba(0, 0, 0, 0.75)',
  textShadowOffset: { width: 0, height: 2 },
  textShadowRadius: 8,
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
    fontFamily: 'Product Sans Medium',
    fontWeight: '500',
    color: '#000',
    marginBottom: 4,
  },
  recommendedPrice: {
    fontSize: 16,
    fontFamily: 'Product Sans Medium',
    fontWeight: '500',
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
    fontFamily: 'Product Sans Medium',
    fontWeight: '500',
    color: '#1F2937',
    marginBottom: 8,
  },
  topCollectionTitle: {
    fontSize: 18,
    fontFamily: 'Product Sans Medium',
    fontWeight: '500',
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
    overflow: 'hidden',
  },
  categoryGridCardReversed: {
    flexDirection: 'row-reverse',
  },
  categoryGridImage: {
    width: 80,
    height: 100,
    backgroundColor: '#E5E7EB',
    borderRadius: 8,
  },
  categoryGridInfo: {
    flex: 1,
  },
  categoryGridLabel: {
    marginLeft: 5,
    fontSize: 12,
    fontFamily: 'Product Sans Medium',
    fontWeight: '500',
    color: '#1F2937',
    marginBottom: 4,
  },
  categoryGridTitle: {
    marginLeft: 12,
    fontSize: 16,
    fontFamily: 'Product Sans Medium',
    fontWeight: '500',
    color: '#000',
  },
});
