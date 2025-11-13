import { getOrderById } from '@/apis/orderApi';
import { OrderResponse, OrderStatus } from '@/types/order';
import { formatVND } from '@/utils/formatCurrency';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function OrderDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [order, setOrder] = useState<OrderResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (id) {
      loadOrderDetails();
    }
  }, [id]);

  const loadOrderDetails = async () => {
    if (!id) return;

    setIsLoading(true);
    try {
      const orderId = typeof id === 'string' ? parseInt(id, 10) : Number(id);
      if (isNaN(orderId)) {
        console.error('Invalid order ID:', id);
        setIsLoading(false);
        return;
      }

      const result = await getOrderById(orderId);
      if (result.data) {
        setOrder(result.data);
      }
    } catch (error) {
      console.error('Error loading order details:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const generateTrackingNumber = (orderId: number) => {
    const paddedId = String(orderId).padStart(4, '0');
    const hash = ((orderId * 12345) % 1000000).toString().padStart(6, '0');
    return `IK${paddedId}${hash}`;
  };

  const getStatusMessage = (status: OrderStatus) => {
    if (status === OrderStatus.DELIVERED) {
      return {
        title: 'Your order is delivered',
        subtitle: 'Rate product to get 5 points for collect.',
      };
    } else if (status === OrderStatus.PENDING) {
      return {
        title: 'Your order is pending',
        subtitle: 'We are processing your order.',
      };
    } else if (status === OrderStatus.CANCELLED) {
      return {
        title: 'Your order is cancelled',
        subtitle: 'This order has been cancelled.',
      };
    }
    return null;
  };

  const handleReturnHome = () => {
    router.push('/(tabs)' as any);
  };

  const handleRate = () => {
    console.log('Rate order:', order?.orderId);
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container} edges={[]}>
        <StatusBar hidden />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#5D4037" />
        </View>
      </SafeAreaView>
    );
  }

  if (!order) {
    return (
      <SafeAreaView style={styles.container} edges={[]}>
        <StatusBar hidden />
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Order not found</Text>
          <TouchableOpacity style={styles.errorBackButton} onPress={() => router.back()}>
            <Text style={styles.backButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const statusMessage = getStatusMessage(order.orderStatus);
  const shippingCost = 0;

  return (
    <SafeAreaView style={styles.container} edges={[]}>
      <StatusBar hidden />
      <View style={styles.contentWrapper}>
        <ScrollView 
          style={styles.scrollView} 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backButtonCircle}>
              <Ionicons name="arrow-back" size={20} color="#000" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Order #{order.orderId}</Text>
            <View style={styles.headerSpacer} />
          </View>
        {order.orderStatus === OrderStatus.DELIVERED && statusMessage && (
          <View style={styles.statusBanner}>
            <View style={styles.statusBannerContent}>
              <Text style={styles.statusBannerTitle}>{statusMessage.title}</Text>
              <Text style={styles.statusBannerSubtitle}>{statusMessage.subtitle}</Text>
            </View>
            <View style={styles.statusBannerIcon}>
              <Ionicons name="gift-outline" size={32} color="#FFFFFF" />
            </View>
          </View>
        )}

        {/* Order Information */}
        <View style={styles.card}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Order number</Text>
            <Text style={styles.infoValue}>#{order.orderId}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Tracking Number</Text>
            <Text style={styles.infoValue}>{generateTrackingNumber(order.orderId)}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Delivery address</Text>
            <Text style={[styles.infoValue, styles.addressValue]}>
              {order.shippingAddress || 'No address provided'}
            </Text>
          </View>
        </View>

        {/* Order Items */}
        <View style={styles.card}>
          {order.orderItems.map((item, index) => (
            <View key={item.orderItemId || index} style={styles.orderItem}>
              <Text style={styles.itemName}>{item.productName}</Text>
              <Text style={styles.itemQuantity}>x{item.quantity}</Text>
              <Text style={styles.itemPrice}>{formatVND(item.price * item.quantity)}</Text>
            </View>
          ))}

          {/* Price Summary */}
          <View style={styles.divider} />
          {(() => {
            const subtotal = order.orderItems.reduce(
              (sum, item) => sum + item.price * item.quantity,
              0
            );
            return (
              <>
                <View style={styles.priceRow}>
                  <Text style={styles.priceLabel}>Sub Total</Text>
                  <Text style={styles.priceValue}>{formatVND(subtotal)}</Text>
                </View>
                <View style={styles.priceRow}>
                  <Text style={styles.priceLabel}>Shipping</Text>
                  <Text style={styles.priceValue}>{formatVND(shippingCost)}</Text>
                </View>
                <View style={styles.priceRow}>
                  <Text style={[styles.priceLabel, styles.totalLabel]}>Total</Text>
                  <Text style={[styles.priceValue, styles.totalValue]}>
                    {formatVND(order.totalPrice)}
                  </Text>
                </View>
              </>
            );
          })()}
        </View>
        </ScrollView>

        {/* Footer Buttons */}
        <View style={styles.footer}>
          <TouchableOpacity style={styles.returnButton} onPress={handleReturnHome}>
            <Text style={styles.returnButtonText}>Return home</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={order.orderStatus === OrderStatus.DELIVERED ? styles.rateButton : styles.rateButtonDisabled}
            onPress={order.orderStatus === OrderStatus.DELIVERED ? handleRate : undefined}
            disabled={order.orderStatus !== OrderStatus.DELIVERED}
          >
            <Text style={order.orderStatus === OrderStatus.DELIVERED ? styles.rateButtonText : styles.rateButtonTextDisabled}>
              Rate
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  contentWrapper: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    fontFamily: 'Product Sans Medium',
    fontWeight: '500',
    color: '#6B7280',
    marginBottom: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    paddingTop: Platform.OS === 'ios' ? 50 : 20,
    backgroundColor: '#FFFFFF',
  },
  backButtonCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: 'Product Sans Medium',
    fontWeight: '700',
    color: '#111827',
    flex: 1,
    textAlign: 'center',
  },
  headerSpacer: {
    width: 32,
  },
  statusBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#4B5563',
    borderRadius: 8,
    marginHorizontal: 20,
    marginTop: 16,
    marginBottom: 16,
    padding: 16,
  },
  statusBannerContent: {
    flex: 1,
  },
  statusBannerTitle: {
    fontSize: 16,
    fontFamily: 'Product Sans Medium',
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 6,
  },
  statusBannerSubtitle: {
    fontSize: 13,
    fontFamily: 'Product Sans Medium',
    fontWeight: '400',
    color: '#D1D5DB',
    lineHeight: 18,
  },
  statusBannerIcon: {
    marginLeft: 12,
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    marginHorizontal: 20,
    marginBottom: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 14,
  },
  infoLabel: {
    fontSize: 14,
    fontFamily: 'Product Sans Medium',
    fontWeight: '400',
    color: '#9CA3AF',
    flex: 1,
  },
  infoValue: {
    fontSize: 14,
    fontFamily: 'Product Sans Medium',
    fontWeight: '500',
    color: '#374151',
    flex: 1,
    textAlign: 'right',
  },
  addressValue: {
    textAlign: 'right',
  },
  orderItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  itemName: {
    fontSize: 14,
    fontFamily: 'Product Sans Medium',
    fontWeight: '500',
    color: '#111827',
    flex: 1,
  },
  itemQuantity: {
    fontSize: 14,
    fontFamily: 'Product Sans Medium',
    fontWeight: '400',
    color: '#6B7280',
    marginHorizontal: 12,
    minWidth: 30,
  },
  itemPrice: {
    fontSize: 14,
    fontFamily: 'Product Sans Medium',
    fontWeight: '600',
    color: '#111827',
    minWidth: 80,
    textAlign: 'right',
  },
  divider: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginTop: 8,
    marginBottom: 16,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  priceLabel: {
    fontSize: 14,
    fontFamily: 'Product Sans Medium',
    fontWeight: '400',
    color: '#6B7280',
  },
  priceValue: {
    fontSize: 14,
    fontFamily: 'Product Sans Medium',
    fontWeight: '500',
    color: '#111827',
  },
  totalLabel: {
    fontWeight: '700',
    color: '#111827',
    fontSize: 15,
  },
  totalValue: {
    fontWeight: '700',
    color: '#111827',
    fontSize: 15,
  },
  footer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 16,
    paddingBottom: Platform.OS === 'ios' ? 34 : 16,
    backgroundColor: '#FFFFFF',
    gap: 12,
  },
  returnButton: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  returnButtonText: {
    fontSize: 14,
    fontFamily: 'Product Sans Medium',
    fontWeight: '500',
    color: '#374151',
  },
  rateButton: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 8,
    backgroundColor: '#4B5563',
    alignItems: 'center',
    justifyContent: 'center',
  },
  rateButtonText: {
    fontSize: 14,
    fontFamily: 'Product Sans Medium',
    fontWeight: '600',
    color: '#FFFFFF',
  },
  rateButtonDisabled: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 8,
    backgroundColor: '#E5E7EB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  rateButtonTextDisabled: {
    fontSize: 14,
    fontFamily: 'Product Sans Medium',
    fontWeight: '600',
    color: '#9CA3AF',
  },
  errorBackButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
  },
  backButtonText: {
    fontSize: 16,
    fontFamily: 'Product Sans Medium',
    fontWeight: '500',
    color: '#5D4037',
  },
});

