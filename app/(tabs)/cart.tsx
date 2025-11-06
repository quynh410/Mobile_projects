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
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

const cartItems = [
  {
    id: 1,
    name: 'Sportwear Set',
    price: 80.00,
    size: 'L',
    color: 'Cream',
    quantity: 1,
    image: 'https://tse2.mm.bing.net/th/id/OIP.xmHZTMQbaWSCl1Ind2ZB7QHaHa?rs=1&pid=ImgDetMain&o=7&rm=3',
    selected: true,
  },
  {
    id: 2,
    name: 'Turtleneck Sweater',
    price: 39.99,
    size: 'M',
    color: 'White',
    quantity: 1,
    image: 'https://tse1.mm.bing.net/th/id/OIP.EAoBsN9jV-ZXLVP2uswxfgHaLG?rs=1&pid=ImgDetMain&o=7&rm=3',
    selected: false,
  },
  {
    id: 3,
    name: 'Cotton T-shirt',
    price: 30.00,
    size: 'L',
    color: 'Black',
    quantity: 1,
    image: 'https://handcmediastorage.blob.core.windows.net/productimages/TH/THPZA001-N01-169571-1400px-1820px.jpg',
    selected: true,
  },
];

export default function CartScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [items, setItems] = useState(cartItems);

  const productPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = 0;
  const subtotal = productPrice + shipping;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: Platform.OS === 'ios' ? 0 : insets.top }]}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Your Cart</Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Cart Items */}
        {items.map((item) => (
          <View key={item.id} style={styles.cartItem}>
            {/* Checkbox */}
            <TouchableOpacity 
              style={styles.checkboxContainer}
              onPress={() => {
                setItems(items.map(i => 
                  i.id === item.id ? { ...i, selected: !i.selected } : i
                ));
              }}
            >
              <View style={[
                styles.checkbox,
                item.selected && styles.checkboxSelected
              ]}>
                {item.selected && (
                  <Ionicons name="checkmark" size={16} color="#FFF" />
                )}
              </View>
            </TouchableOpacity>

            {/* Product Image */}
            <Image
              source={{ uri: item.image }}
              style={styles.productImage}
              resizeMode="cover"
            />

            {/* Product Info */}
            <View style={styles.productInfo}>
              <Text style={styles.productName}>{item.name}</Text>
              <Text style={styles.productPrice}>$ {item.price.toFixed(2)}</Text>
              <Text style={styles.productDetails}>
                Size: {item.size} | Color: {item.color}
              </Text>

              {/* Quantity Selector */}
              <View style={styles.quantityContainer}>
                <TouchableOpacity style={styles.quantityButton}>
                  <Ionicons name="remove" size={18} color="#000" />
                </TouchableOpacity>
                <Text style={styles.quantityText}>{item.quantity}</Text>
                <TouchableOpacity style={styles.quantityButton}>
                  <Ionicons name="add" size={18} color="#000" />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ))}

        {/* Price Summary */}
        <View style={styles.priceSummary}>
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>Product price</Text>
            <Text style={styles.priceValue}>${productPrice.toFixed(0)}</Text>
          </View>
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>Shipping</Text>
            <Text style={styles.priceValue}>Freeship</Text>
          </View>
          <View style={[styles.priceRow, styles.priceRowLast]}>
            <Text style={styles.priceLabel}>Subtotal</Text>
            <Text style={styles.subtotalValue}>${subtotal.toFixed(0)}</Text>
          </View>
        </View>
      </ScrollView>

      {/* Checkout Button */}
      <View style={[styles.bottomBar, { paddingBottom: Platform.OS === 'ios' ? insets.bottom : 16 }]}>
        <TouchableOpacity style={styles.checkoutButton}>
          <Text style={styles.checkoutButtonText}>Proceed to checkout</Text>
        </TouchableOpacity>
      </View>
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 100,
  },
  cartItem: {
    backgroundColor: '#FAFAFA',
    borderRadius: 12,
    padding: 0,
    marginBottom: 16,
    flexDirection: 'row',
    position: 'relative',
    overflow: 'hidden',
  },
  checkboxContainer: {
    position: 'absolute',
    top: 16,
    right: 16,
    zIndex: 10,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#9CA3AF',
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxSelected: {
    backgroundColor: '#20B2AA',
    borderColor: '#20B2AA',
  },
  productImage: {
    width: 120,
    height: 150,
    borderTopLeftRadius: 12,
    borderBottomLeftRadius: 12,
    backgroundColor: '#E5E7EB',
  },
  productInfo: {
    flex: 1,
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  productName: {
    fontSize: 18,
    fontFamily: 'Product Sans Medium',
    fontWeight: '500',
    color: '#000',
    marginBottom: 8,
  },
  productPrice: {
    fontSize: 20,
    fontFamily: 'Product Sans Medium',
    fontWeight: '500',
    color: '#000',
    marginBottom: 8,
  },
  productDetails: {
    fontSize: 14,
    fontFamily: 'Product Sans Medium',
    fontWeight: '500',
    color: '#1F2937',
    marginBottom: 'auto',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    alignSelf: 'flex-start',
    paddingHorizontal: 4,
    paddingVertical: 4,
  },
  quantityButton: {
    padding: 6,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 32,
  },
  quantityText: {
    fontSize: 16,
    fontFamily: 'Product Sans Medium',
    fontWeight: '500',
    color: '#000',
    paddingHorizontal: 12,
    minWidth: 30,
    textAlign: 'center',
  },
  priceSummary: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    marginTop: 8,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  priceRowLast: {
    borderBottomWidth: 0,
    marginBottom: 0,
    paddingBottom: 0,
  },
  priceLabel: {
    fontSize: 14,
    fontFamily: 'Product Sans Medium',
    fontWeight: '500',
    color: '#1F2937',
  },
  priceValue: {
    fontSize: 14,
    fontFamily: 'Product Sans Medium',
    fontWeight: '500',
    color: '#000',
  },
  subtotalValue: {
    fontSize: 16,
    fontFamily: 'Product Sans Medium',
    fontWeight: '500',
    color: '#000',
  },
  bottomBar: {
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  checkoutButton: {
    backgroundColor: '#374151',
    borderRadius: 12,
    paddingVertical: 23,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkoutButtonText: {
    fontSize: 16,
    fontFamily: 'Product Sans Medium',
    fontWeight: '500',
    color: '#FFFFFF',
  },
});
