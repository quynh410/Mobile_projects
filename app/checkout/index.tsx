import { useCart } from '@/contexts/CartContext';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

interface UserData {
  id: string;
  name: string;
  email: string;
}

interface FormErrors {
  firstName?: string;
  lastName?: string;
  country?: string;
  streetName?: string;
  city?: string;
  zipCode?: string;
  phoneNumber?: string;
}

export default function CheckoutScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { items } = useCart();
  const [userData, setUserData] = useState<UserData | null>(null);

  // Form fields
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [country, setCountry] = useState('');
  const [streetName, setStreetName] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');

  const [errors, setErrors] = useState<FormErrors>({});

  useEffect(() => {
    loadUserData();
    // Auto-fill first name if available
    if (userData?.name) {
      const nameParts = userData.name.split(' ');
      if (nameParts.length > 0) {
        setFirstName(nameParts[0]);
      }
    }
  }, [userData?.name]);

  const loadUserData = async () => {
    try {
      const userDataString = await AsyncStorage.getItem('userData');
      if (userDataString) {
        const user = JSON.parse(userDataString);
        setUserData(user);
        // Auto-fill first name
        const nameParts = user.name?.split(' ') || [];
        if (nameParts.length > 0) {
          setFirstName(nameParts[0]);
        }
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!firstName.trim()) {
      newErrors.firstName = 'Field is required';
    }
    if (!lastName.trim()) {
      newErrors.lastName = 'Field is required';
    }
    if (!country.trim()) {
      newErrors.country = 'Field is required';
    }
    if (!streetName.trim()) {
      newErrors.streetName = 'Field is required';
    }
    if (!city.trim()) {
      newErrors.city = 'Field is required';
    }
    if (!zipCode.trim()) {
      newErrors.zipCode = 'Field is required';
    }
    if (!phoneNumber.trim()) {
      newErrors.phoneNumber = 'Field is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleContinueToPayment = () => {
    if (!validateForm()) {
      return;
    }

    if (!userData) {
      Alert.alert('Lỗi', 'Vui lòng đăng nhập để tiếp tục');
      return;
    }

    if (items.length === 0) {
      Alert.alert('Lỗi', 'Giỏ hàng của bạn đang trống');
      router.back();
      return;
    }

    // Prepare shipping data to pass to payment screen
    const shippingData = {
      firstName,
      lastName,
      country,
      streetName,
      city,
      state,
      zipCode,
      phoneNumber,
    };

    // Navigate to payment screen with shipping data
    router.push({
      pathname: '/checkout/payment',
      params: {
        shippingData: JSON.stringify(shippingData),
      },
    } as any);
  };

  const renderInputField = (
    label: string,
    value: string,
    onChangeText: (text: string) => void,
    error?: string,
    placeholder?: string,
    required: boolean = true
  ) => {
    return (
      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>
          {label} {required && '*'}
        </Text>
        <TextInput
          style={[styles.input, error && styles.inputError]}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="#9CA3AF"
        />
        {error && <Text style={styles.errorText}>{error}</Text>}
      </View>
    );
  };

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
            <View style={[styles.progressIcon, styles.progressIconActive]}>
              <Ionicons name="location" size={20} color="#FFF" />
            </View>
            <Text style={styles.progressText}>Shipping</Text>
          </View>
          <View style={styles.progressLine} />
          <View style={styles.progressStep}>
            <View style={styles.progressIcon}>
              <Ionicons name="remove" size={20} color="#9CA3AF" />
            </View>
            <Text style={[styles.progressText, styles.progressTextInactive]}>Payment</Text>
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
          keyboardShouldPersistTaps="handled"
        >
          {/* STEP 1 Shipping */}
          <Text style={styles.sectionTitle}>STEP 1 Shipping</Text>

          {/* Shipping Information */}
          <View style={styles.formSection}>
            {renderInputField('First name', firstName, setFirstName, errors.firstName, 'First name', true)}
            {renderInputField('Last name', lastName, setLastName, errors.lastName, 'Last name', true)}
            {renderInputField('Country', country, setCountry, errors.country, 'Country', true)}
            {renderInputField('Street name', streetName, setStreetName, errors.streetName, 'Street name', true)}
            {renderInputField('City', city, setCity, errors.city, 'City', true)}
            {renderInputField('State / Province', state, setState, undefined, 'State / Province', false)}
            {renderInputField('Zip-code', zipCode, setZipCode, errors.zipCode, 'Zip-code', true)}
            {renderInputField('Phone number', phoneNumber, setPhoneNumber, errors.phoneNumber, 'Phone number', true)}
          </View>

          {/* Shipping Method */}
          <View style={styles.shippingMethodSection}>
            <Text style={styles.sectionSubtitle}>Shipping method</Text>
            <View style={styles.shippingOption}>
              <View style={styles.radioButton}>
                <View style={styles.radioButtonInner} />
              </View>
              <View style={styles.shippingOptionContent}>
                <Text style={styles.shippingOptionTitle}>Free Delivery to home</Text>
                <Text style={styles.shippingOptionDescription}>
                  Delivery from 3 to 7 business days
                </Text>
              </View>
            </View>
          </View>
        </ScrollView>

        {/* Continue to Payment Button */}
        <View style={[styles.bottomBar, { paddingBottom: Platform.OS === 'ios' ? insets.bottom : 16 }]}>
          <TouchableOpacity
            style={styles.continueButton}
            onPress={handleContinueToPayment}
          >
            <Text style={styles.continueButtonText}>Continue to payment</Text>
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
  formSection: {
    marginBottom: 24,
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontFamily: 'Product Sans Medium',
    fontWeight: '500',
    color: '#000',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    fontFamily: 'Product Sans Medium',
    color: '#000',
    backgroundColor: '#FFFFFF',
  },
  inputError: {
    borderColor: '#EF4444',
  },
  errorText: {
    fontSize: 12,
    fontFamily: 'Product Sans Medium',
    fontWeight: '500',
    color: '#EF4444',
    marginTop: 4,
  },
  shippingMethodSection: {
    marginTop: 8,
  },
  sectionSubtitle: {
    fontSize: 16,
    fontFamily: 'Product Sans Medium',
    fontWeight: '600',
    color: '#000',
    marginBottom: 16,
  },
  shippingOption: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 16,
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#10B981',
  },
  radioButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#10B981',
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    marginTop: 2,
  },
  radioButtonInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#10B981',
  },
  shippingOptionContent: {
    flex: 1,
  },
  shippingOptionTitle: {
    fontSize: 16,
    fontFamily: 'Product Sans Medium',
    fontWeight: '500',
    color: '#000',
    marginBottom: 4,
  },
  shippingOptionDescription: {
    fontSize: 14,
    fontFamily: 'Product Sans Medium',
    fontWeight: '400',
    color: '#6B7280',
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

