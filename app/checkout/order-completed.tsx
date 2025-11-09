import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import {
  Dimensions,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

export default function OrderCompletedScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const handleContinueShopping = () => {
    router.replace('/(tabs)' as any);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: Platform.OS === 'ios' ? 0 : insets.top }]}>
        <TouchableOpacity onPress={() => router.replace('/(tabs)' as any)}>
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
          <View style={styles.progressIconCompleted}>
            <Ionicons name="checkmark" size={16} color="#FFF" />
          </View>
          <Text style={styles.progressText}>Payment</Text>
        </View>
        <View style={styles.progressLineCompleted} />
        <View style={styles.progressStep}>
          <View style={[styles.progressIcon, styles.progressIconActive]}>
            <Ionicons name="checkmark" size={20} color="#FFF" />
          </View>
          <Text style={styles.progressText}>Review</Text>
        </View>
      </View>

      {/* Main Content */}
      <View style={styles.content}>
        <Text style={styles.title}>Order Completed</Text>

        {/* Shopping Bag Icon with Checkmark */}
        <View style={styles.iconContainer}>
          <View style={styles.bagIconWrapper}>
            <Ionicons name="bag-outline" size={100} color="#000" />
            <View style={styles.priceTag}>
              <Ionicons name="pricetag" size={20} color="#9CA3AF" />
            </View>
            <View style={styles.checkmarkOverlay}>
              <View style={styles.checkmarkCircle}>
                <Ionicons name="checkmark" size={24} color="#FFF" />
              </View>
            </View>
          </View>
        </View>

        {/* Message */}
        <View style={styles.messageContainer}>
          <Text style={styles.message}>Thank you for your purchase.</Text>
          <Text style={styles.message}>
            You can view your order in 'My Orders' section.
          </Text>
        </View>
      </View>

      {/* Continue Shopping Button */}
      <View style={[styles.bottomBar, { paddingBottom: Platform.OS === 'ios' ? insets.bottom : 16 }]}>
        <TouchableOpacity
          style={styles.continueButton}
          onPress={handleContinueShopping}
        >
          <Text style={styles.continueButtonText}>Continue shopping</Text>
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
    backgroundColor: '#10B981',
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
  progressLineCompleted: {
    flex: 1,
    height: 2,
    backgroundColor: '#10B981',
    marginHorizontal: 8,
    marginBottom: 20,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  title: {
    fontSize: 28,
    fontFamily: 'Product Sans Medium',
    fontWeight: '600',
    color: '#000',
    marginBottom: 40,
    textAlign: 'center',
  },
  iconContainer: {
    marginBottom: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bagIconWrapper: {
    width: 140,
    height: 140,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  priceTag: {
    position: 'absolute',
    top: 15,
    right: 25,
  },
  checkmarkOverlay: {
    position: 'absolute',
    bottom: 5,
    right: 15,
  },
  checkmarkCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#10B981',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  messageContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  message: {
    fontSize: 16,
    fontFamily: 'Product Sans Medium',
    fontWeight: '400',
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 8,
    lineHeight: 24,
  },
  bottomBar: {
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  continueButton: {
    backgroundColor: '#363636',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  continueButtonText: {
    fontSize: 16,
    fontFamily: 'Product Sans Medium',
    fontWeight: '600',
    color: '#FFFFFF',
  },
});

