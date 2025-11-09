import { getOrdersByUser } from '@/apis/orderApi';
import Sidebar from '@/components/Sidebar';
import { OrderResponse, OrderStatus } from '@/types/order';
import { formatVND } from '@/utils/formatCurrency';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
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

type OrderTab = 'PENDING' | 'DELIVERED' | 'CANCELLED';

interface UserData {
  id: string | number;
  name: string;
  email: string;
}

export default function OrdersScreen() {
  const router = useRouter();
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [activeTab, setActiveTab] = useState<OrderTab>('PENDING');
  const [orders, setOrders] = useState<OrderResponse[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [userData, setUserData] = useState<UserData | null>(null);

  useEffect(() => {
    loadUserData();
  }, []);

  useEffect(() => {
    if (userData?.id) {
      loadOrders();
    }
  }, [userData, activeTab]);

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

  const loadOrders = async () => {
    if (!userData?.id) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      const userId = typeof userData.id === 'string' ? parseInt(userData.id, 10) : userData.id;
      if (isNaN(userId)) {
        console.error('Invalid user ID:', userData.id);
        setOrders([]);
        setIsLoading(false);
        return;
      }
      const result = await getOrdersByUser(userId, 0, 100);
      if (result.data?.content) {
        // Filter orders based on active tab
        let filteredOrders = result.data.content;

        if (activeTab === 'PENDING') {
          filteredOrders = result.data.content.filter(
            (order) => order.orderStatus === OrderStatus.PENDING
          );
        } else if (activeTab === 'DELIVERED') {
          filteredOrders = result.data.content.filter(
            (order) => order.orderStatus === OrderStatus.DELIVERED
          );
        } else if (activeTab === 'CANCELLED') {
          filteredOrders = result.data.content.filter(
            (order) => order.orderStatus === OrderStatus.CANCELLED
          );
        }

        // Sort by created date (newest first)
        filteredOrders.sort((a, b) => {
          const dateA = new Date(a.createdAt).getTime();
          const dateB = new Date(b.createdAt).getTime();
          return dateB - dateA;
        });

        setOrders(filteredOrders);
      }
    } catch (error) {
      console.error('Error loading orders:', error);
      setOrders([]);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const generateTrackingNumber = (orderId: number) => {
    // Generate a deterministic tracking number based on orderId
    // Format: IK + orderId padded + hash-like suffix
    const paddedId = String(orderId).padStart(4, '0');
    const hash = ((orderId * 12345) % 1000000).toString().padStart(6, '0');
    return `IK${paddedId}${hash}`;
  };

  const getTotalQuantity = (order: OrderResponse) => {
    return order.orderItems.reduce((total, item) => total + item.quantity, 0);
  };

  const getStatusColor = (status: OrderStatus) => {
    if (status === OrderStatus.PENDING) {
      return '#F97316'; // Orange
    } else if (status === OrderStatus.DELIVERED) {
      return '#10B981'; // Green
    } else if (status === OrderStatus.CANCELLED) {
      return '#EF4444'; // Red
    }
    return '#6B7280'; // Gray
  };

  const getStatusText = (status: OrderStatus) => {
    if (status === OrderStatus.PENDING) {
      return 'PENDING';
    } else if (status === OrderStatus.DELIVERED) {
      return 'DELIVERED';
    } else if (status === OrderStatus.CANCELLED) {
      return 'CANCELLED';
    }
    return status;
  };

  const handleOrderDetails = (orderId: number) => {
    router.push(`/orders/${orderId}` as any);
  };

  return (
    <SafeAreaView style={styles.container} edges={[]}>
      <StatusBar hidden />
      <Sidebar visible={sidebarVisible} onClose={() => setSidebarVisible(false)} />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => setSidebarVisible(true)}>
          <Ionicons name="menu" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Orders</Text>
        <TouchableOpacity style={styles.notificationContainer}>
          <Ionicons name="notifications-outline" size={24} color="#000" />
          <View style={styles.badge}>
            <Text style={styles.badgeText}>1</Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Status Tabs */}
      <View style={styles.tabsContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'PENDING' && styles.tabActive]}
          onPress={() => setActiveTab('PENDING')}
        >
          <Text style={[styles.tabText, activeTab === 'PENDING' && styles.tabTextActive]}>
            Pending
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'DELIVERED' && styles.tabActive]}
          onPress={() => setActiveTab('DELIVERED')}
        >
          <Text style={[styles.tabText, activeTab === 'DELIVERED' && styles.tabTextActive]}>
            Delivered
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'CANCELLED' && styles.tabActive]}
          onPress={() => setActiveTab('CANCELLED')}
        >
          <Text style={[styles.tabText, activeTab === 'CANCELLED' && styles.tabTextActive]}>
            Cancelled
          </Text>
        </TouchableOpacity>
      </View>

      {/* Orders List */}
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#5D4037" />
        </View>
      ) : orders.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="bag-outline" size={64} color="#9CA3AF" />
          <Text style={styles.emptyText}>No orders found</Text>
        </View>
      ) : (
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {orders.map((order) => (
            <View key={order.orderId} style={styles.orderCard}>
              <View style={styles.orderHeader}>
                <Text style={styles.orderNumber}>Order #{order.orderId}</Text>
                <Text style={styles.orderDate}>{formatDate(order.createdAt)}</Text>
              </View>

              <Text style={styles.trackingNumber}>
                Tracking number: {generateTrackingNumber(order.orderId)}
              </Text>

              <View style={styles.orderInfo}>
                <Text style={styles.orderLabel}>Quantity: {getTotalQuantity(order)}</Text>
                <Text style={styles.orderSubtotal}>
                  Subtotal: <Text style={styles.orderPrice}>{formatVND(order.totalPrice)}</Text>
                </Text>
              </View>

              <View style={styles.orderFooter}>
                <Text style={[styles.orderStatus, { color: getStatusColor(order.orderStatus) }]}>
                  {getStatusText(order.orderStatus)}
                </Text>
                <TouchableOpacity
                  style={styles.detailsButton}
                  onPress={() => handleOrderDetails(order.orderId)}
                >
                  <Text style={styles.detailsButtonText}>Details</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
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
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    paddingTop: Platform.OS === 'ios' ? 50 : 20,
    backgroundColor: '#FFFFFF',
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: 'Product Sans Medium',
    fontWeight: '700',
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
    fontWeight: '600',
  },
  tabsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 16,
    gap: 12,
    backgroundColor: '#FFFFFF',
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabActive: {
    backgroundColor: '#4B5563',
  },
  tabText: {
    fontSize: 14,
    fontFamily: 'Product Sans Medium',
    fontWeight: '500',
    color: '#000',
  },
  tabTextActive: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 16,
    fontFamily: 'Product Sans Medium',
    fontWeight: '500',
    color: '#9CA3AF',
    marginTop: 16,
  },
  orderCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  orderNumber: {
    fontSize: 18,
    fontFamily: 'Product Sans Medium',
    fontWeight: '700',
    color: '#000',
    flex: 1,
  },
  orderDate: {
    fontSize: 14,
    fontFamily: 'Product Sans Medium',
    fontWeight: '400',
    color: '#6B7280',
  },
  trackingNumber: {
    fontSize: 14,
    fontFamily: 'Product Sans Medium',
    fontWeight: '400',
    color: '#6B7280',
    marginBottom: 12,
  },
  orderInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  orderLabel: {
    fontSize: 14,
    fontFamily: 'Product Sans Medium',
    fontWeight: '400',
    color: '#6B7280',
  },
  orderSubtotal: {
    fontSize: 14,
    fontFamily: 'Product Sans Medium',
    fontWeight: '400',
    color: '#6B7280',
  },
  orderPrice: {
    fontSize: 14,
    fontFamily: 'Product Sans Medium',
    fontWeight: '700',
    color: '#000',
  },
  orderFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  orderStatus: {
    fontSize: 14,
    fontFamily: 'Product Sans Medium',
    fontWeight: '600',
  },
  detailsButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#000',
    backgroundColor: '#FFFFFF',
  },
  detailsButtonText: {
    fontSize: 14,
    fontFamily: 'Product Sans Medium',
    fontWeight: '500',
    color: '#000',
  },
});

