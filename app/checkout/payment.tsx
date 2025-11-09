import { createOrder } from '@/apis/orderApi';
import { useCart } from '@/contexts/CartContext';
import { OrderRequest } from '@/types/order';
import { formatVND } from '@/utils/formatCurrency';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

interface UserData {
  id: string;
  name: string;
  email: string;
}

interface ShippingData {
  firstName: string;
  lastName: string;
  country: string;
  streetName: string;
  city: string;
  state: string;
  zipCode: string;
  phoneNumber: string;
}

type PaymentMethod = 'cash' | 'credit' | 'other';

export default function PaymentScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams();
  const { items, clearCart, getTotalPrice } = useCart();
  
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethod>('credit');
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [shippingData, setShippingData] = useState<ShippingData | null>(null);

  useEffect(() => {
    loadUserData();
    // Load shipping data from params
    if (params.shippingData) {
      try {
        setShippingData(JSON.parse(params.shippingData as string));
      } catch (error) {
        console.error('Error parsing shipping data:', error);
        Alert.alert('Lỗi', 'Thông tin shipping không hợp lệ', [
          {
            text: 'OK',
            onPress: () => router.back(),
          },
        ]);
      }
    }
  }, [params]);

  const loadUserData = async () => {
    try {
      const userDataString = await AsyncStorage.getItem('userData');
      if (userDataString) {
        const user = JSON.parse(userDataString);
        setUserData(user);
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  const handlePlaceOrder = async () => {
    if (!agreeToTerms) {
      Alert.alert('Lỗi', 'Vui lòng đồng ý với Terms and conditions');
      return;
    }

    if (!userData || !shippingData) {
      Alert.alert('Lỗi', 'Thông tin không hợp lệ');
      return;
    }

    if (items.length === 0) {
      Alert.alert('Lỗi', 'Giỏ hàng của bạn đang trống');
      router.back();
      return;
    }

    setIsLoading(true);
    try {
      // Build shipping address
      const addressParts = [
        shippingData.streetName,
        shippingData.city,
        shippingData.state && `State: ${shippingData.state}`,
        `Zip: ${shippingData.zipCode}`,
        shippingData.country,
      ].filter(Boolean);
      const shippingAddress = `${shippingData.firstName} ${shippingData.lastName}, ${addressParts.join(', ')}, Phone: ${shippingData.phoneNumber}`;

      // Build order items
      const orderItems = items.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
      }));

      // Create order request
      const orderRequest: OrderRequest = {
        userId: parseInt(userData.id, 10),
        shippingAddress,
        orderItems,
      };

      // Call API to create order
      const response = await createOrder(orderRequest);

      if (response.data) {
        // Clear cart after successful order
        clearCart();

        // Navigate to order completed screen
        router.replace('/checkout/order-completed' as any);
      } else {
        Alert.alert('Lỗi', response.message || 'Không thể tạo đơn hàng');
      }
    } catch (error: any) {
      console.error('Error creating order:', error);
      Alert.alert(
        'Lỗi',
        error.message || 'Đã xảy ra lỗi khi tạo đơn hàng. Vui lòng thử lại.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const totalPrice = getTotalPrice();
  const shipping = 0;
  const subtotal = totalPrice + shipping;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        {/* Header */}
        <View style={[styles.header, { paddingTop: Platform.OS === 'ios' ? 0 : insets.top }]}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="#000" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Check out</Text>
          <View style={styles.headerRight} />
        </View>

        {/* Progress Indicator */}
        <View style={styles.progressContainer}>
          <View style={styles.progressStep}>
            <View style={styles.progressIconCompleted}>
              <Ionicons name="checkmark" size={16} color="#FFF" />
            </View>
            <Text style={styles.progressText}>Shipping</Text>
          </View>
          <View style={styles.progressLineCompleted} />
          <View style={styles.progressStep}>
            <View style={[styles.progressIcon, styles.progressIconActive]}>
              <Ionicons name="card" size={20} color="#FFF" />
            </View>
            <Text style={styles.progressText}>Payment</Text>
          </View>
          <View style={styles.progressLine} />
          <View style={styles.progressStep}>
            <View style={styles.progressIcon}>
              <Ionicons name="checkmark" size={20} color="#9CA3AF" />
            </View>
            <Text style={[styles.progressText, styles.progressTextInactive]}>Review</Text>
          </View>
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* STEP 2 Payment */}
          <Text style={styles.sectionTitle}>STEP 2 Payment</Text>

          {/* Payment Method Selection */}
          <View style={styles.paymentMethodContainer}>
            <TouchableOpacity
              style={[
                styles.paymentMethodButton,
                selectedPaymentMethod === 'cash' && styles.paymentMethodButtonSelected,
              ]}
              onPress={() => setSelectedPaymentMethod('cash')}
            >
              <Ionicons
                name="cash"
                size={24}
                color={selectedPaymentMethod === 'cash' ? '#FFF' : '#000'}
              />
              <Text
                style={[
                  styles.paymentMethodText,
                  selectedPaymentMethod === 'cash' && styles.paymentMethodTextSelected,
                ]}
              >
                Cash
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.paymentMethodButton,
                selectedPaymentMethod === 'credit' && styles.paymentMethodButtonSelected,
              ]}
              onPress={() => setSelectedPaymentMethod('credit')}
            >
              <Ionicons
                name="card"
                size={24}
                color={selectedPaymentMethod === 'credit' ? '#FFF' : '#000'}
              />
              <Text
                style={[
                  styles.paymentMethodText,
                  selectedPaymentMethod === 'credit' && styles.paymentMethodTextSelected,
                ]}
              >
                Credit Card
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.paymentMethodButton,
                selectedPaymentMethod === 'other' && styles.paymentMethodButtonSelected,
              ]}
              onPress={() => setSelectedPaymentMethod('other')}
            >
              <Ionicons
                name="ellipsis-horizontal"
                size={24}
                color={selectedPaymentMethod === 'other' ? '#FFF' : '#000'}
              />
            </TouchableOpacity>
          </View>

          {/* Choose your card (only visible when credit card is selected) */}
          {selectedPaymentMethod === 'credit' && (
            <View style={styles.chooseCardSection}>
              <View style={styles.chooseCardHeader}>
                <Text style={styles.chooseCardTitle}>Choose your card</Text>
                <TouchableOpacity>
                  <Text style={styles.addNewText}>Add new+</Text>
                </TouchableOpacity>
              </View>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.cardScrollContent}
              >
                <View style={styles.creditCard}>
                  <View style={styles.cardHeader}>
                    <Text style={styles.cardLogo}>VISA</Text>
                  </View>
                  <View style={styles.cardBody}>
                    <Text style={styles.cardNumber}>4364 1345 8932 8378</Text>
                    <View style={styles.cardFooter}>
                      <View>
                        <Text style={styles.cardLabel}>Cardholder Name</Text>
                        <Text style={styles.cardValue}>
                          {userData?.name || 'Sunie Phom'}
                        </Text>
                      </View>
                      <View>
                        <Text style={styles.cardLabel}>Valid Thru</Text>
                        <Text style={styles.cardValue}>05/24</Text>
                      </View>
                    </View>
                  </View>
                </View>
              </ScrollView>
            </View>
          )}

          {/* Or check out with */}
          <View style={styles.checkoutWithSection}>
            <Text style={styles.checkoutWithTitle}>or check out with</Text>
            <View style={styles.paymentLogosContainer}>
              <View style={styles.paymentLogo}>
                <Text style={styles.paymentLogoText}>PayPal</Text>
              </View>
              <View style={styles.paymentLogo}>
                <Text style={styles.paymentLogoText}>VISA</Text>
              </View>
              <View style={styles.paymentLogo}>
                <Text style={styles.paymentLogoText}>MC</Text>
              </View>
              <View style={styles.paymentLogo}>
                <Text style={styles.paymentLogoText}>Alipay</Text>
              </View>
              <View style={styles.paymentLogo}>
                <Text style={styles.paymentLogoText}>AMEX</Text>
              </View>
            </View>
          </View>

          {/* Order Summary */}
          <View style={styles.orderSummary}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Product price</Text>
              <Text style={styles.summaryValue}>{formatVND(totalPrice)}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Shipping</Text>
              <Text style={styles.summaryValue}>Freeship</Text>
            </View>
            <View style={[styles.summaryRow, styles.summaryRowLast]}>
              <Text style={styles.summaryLabel}>Subtotal</Text>
              <Text style={styles.subtotalValue}>{formatVND(subtotal)}</Text>
            </View>
          </View>

          {/* Terms and Conditions */}
          <View style={styles.termsSection}>
            <TouchableOpacity
              style={styles.checkboxContainer}
              onPress={() => setAgreeToTerms(!agreeToTerms)}
            >
              <View style={[styles.checkbox, agreeToTerms && styles.checkboxChecked]}>
                {agreeToTerms && (
                  <Ionicons name="checkmark" size={16} color="#10B981" />
                )}
              </View>
              <Text style={styles.termsText}>
                I agree to{' '}
                <Text style={styles.termsLink}>Terms and conditions</Text>
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>

        {/* Place my order Button */}
        <View style={[styles.bottomBar, { paddingBottom: Platform.OS === 'ios' ? insets.bottom : 16 }]}>
          <TouchableOpacity
            style={[styles.placeOrderButton, isLoading && styles.placeOrderButtonDisabled]}
            onPress={handlePlaceOrder}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.placeOrderButtonText}>Place my order</Text>
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  keyboardView: {
    flex: 1,
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
    fontWeight: '600',
    color: '#000',
  },
  headerRight: {
    width: 24,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  progressStep: {
    alignItems: 'center',
  },
  progressIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#E5E7EB',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  progressIconActive: {
    backgroundColor: '#5D4037',
  },
  progressIconCompleted: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#10B981',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  progressText: {
    fontSize: 12,
    fontFamily: 'Product Sans Medium',
    fontWeight: '500',
    color: '#000',
  },
  progressTextInactive: {
    color: '#9CA3AF',
  },
  progressLine: {
    flex: 1,
    height: 2,
    backgroundColor: '#E5E7EB',
    marginHorizontal: 8,
    marginBottom: 20,
    borderStyle: 'dashed',
    borderWidth: 1,
    borderColor: '#D1D5DB',
  },
  progressLineCompleted: {
    flex: 1,
    height: 2,
    backgroundColor: '#10B981',
    marginHorizontal: 8,
    marginBottom: 20,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 100,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'Product Sans Medium',
    fontWeight: '600',
    color: '#000',
    marginBottom: 20,
  },
  paymentMethodContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  paymentMethodButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    gap: 8,
  },
  paymentMethodButtonSelected: {
    backgroundColor: '#363636',
    borderColor: '#363636',
  },
  paymentMethodText: {
    fontSize: 16,
    fontFamily: 'Product Sans Medium',
    fontWeight: '500',
    color: '#000',
  },
  paymentMethodTextSelected: {
    color: '#FFFFFF',
  },
  chooseCardSection: {
    marginBottom: 24,
  },
  chooseCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  chooseCardTitle: {
    fontSize: 16,
    fontFamily: 'Product Sans Medium',
    fontWeight: '600',
    color: '#000',
  },
  addNewText: {
    fontSize: 14,
    fontFamily: 'Product Sans Medium',
    fontWeight: '500',
    color: '#EF4444',
  },
  cardScrollContent: {
    paddingRight: 20,
  },
  creditCard: {
    width: width - 80,
    height: 200,
    backgroundColor: '#60A5FA',
    borderRadius: 16,
    padding: 20,
    marginRight: 16,
    justifyContent: 'space-between',
  },
  cardHeader: {
    alignItems: 'flex-end',
  },
  cardLogo: {
    fontSize: 18,
    fontFamily: 'Product Sans Medium',
    fontWeight: '600',
    color: '#FFFFFF',
    letterSpacing: 2,
  },
  cardBody: {
    flex: 1,
    justifyContent: 'space-between',
  },
  cardNumber: {
    fontSize: 20,
    fontFamily: 'Product Sans Medium',
    fontWeight: '500',
    color: '#FFFFFF',
    letterSpacing: 2,
    marginBottom: 20,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cardLabel: {
    fontSize: 10,
    fontFamily: 'Product Sans Medium',
    fontWeight: '400',
    color: 'rgba(255, 255, 255, 0.7)',
    marginBottom: 4,
  },
  cardValue: {
    fontSize: 14,
    fontFamily: 'Product Sans Medium',
    fontWeight: '500',
    color: '#FFFFFF',
  },
  checkoutWithSection: {
    marginBottom: 24,
  },
  checkoutWithTitle: {
    fontSize: 16,
    fontFamily: 'Product Sans Medium',
    fontWeight: '600',
    color: '#000',
    marginBottom: 16,
  },
  paymentLogosContainer: {
    flexDirection: 'row',
    gap: 12,
    flexWrap: 'wrap',
  },
  paymentLogo: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  paymentLogoText: {
    fontSize: 12,
    fontFamily: 'Product Sans Medium',
    fontWeight: '500',
    color: '#000',
  },
  orderSummary: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  summaryRowLast: {
    borderBottomWidth: 0,
    marginBottom: 0,
    paddingBottom: 0,
  },
  summaryLabel: {
    fontSize: 14,
    fontFamily: 'Product Sans Medium',
    fontWeight: '500',
    color: '#1F2937',
  },
  summaryValue: {
    fontSize: 14,
    fontFamily: 'Product Sans Medium',
    fontWeight: '500',
    color: '#000',
  },
  subtotalValue: {
    fontSize: 18,
    fontFamily: 'Product Sans Medium',
    fontWeight: '600',
    color: '#000',
  },
  termsSection: {
    marginBottom: 24,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  checkboxChecked: {
    backgroundColor: '#FFFFFF',
    borderColor: '#10B981',
  },
  termsText: {
    fontSize: 14,
    fontFamily: 'Product Sans Medium',
    fontWeight: '400',
    color: '#1F2937',
    flex: 1,
  },
  termsLink: {
    textDecorationLine: 'underline',
    color: '#1F2937',
  },
  bottomBar: {
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  placeOrderButton: {
    backgroundColor: '#363636',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeOrderButtonDisabled: {
    opacity: 0.6,
  },
  placeOrderButtonText: {
    fontSize: 16,
    fontFamily: 'Product Sans Medium',
    fontWeight: '600',
    color: '#FFFFFF',
  },
});

