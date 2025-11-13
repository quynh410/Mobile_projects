import { getCurrentProfile, updateProfile } from '@/apis/usersApi';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface UserData {
  id: number | string;
  name?: string;
  firstName?: string;
  lastName?: string;
  email: string;
  phoneNumber?: string;
  gender?: 'MALE' | 'FEMALE';
  avatarUrl?: string;
  address?: string;
}

interface SelectedImage {
  uri: string;
  type: string;
  fileName?: string;
}

export default function ProfileSettingScreen() {
  const router = useRouter();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [gender, setGender] = useState<'MALE' | 'FEMALE'>('FEMALE');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [address, setAddress] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const [selectedImage, setSelectedImage] = useState<SelectedImage | null>(null);

  useEffect(() => {
    loadUserProfile();
  }, []);

  const loadUserProfile = async () => {
    setIsLoadingProfile(true);
    try {
        try {
          const profile = await getCurrentProfile();          
          setUserData({
            id: profile.id,
            name: profile.name,
            email: profile.email,
            phoneNumber: profile.phoneNumber,
            gender: profile.gender,
            avatarUrl: profile.avatarUrl,
            address: profile.address,
          });

          if (profile.name) {
            const nameParts = profile.name.trim().split(' ').filter(part => part.length > 0);
            if (nameParts.length > 1) {
              setFirstName(nameParts[nameParts.length - 1] || '');
              setLastName(nameParts.slice(0, nameParts.length - 1).join(' ') || '');
            } else if (nameParts.length === 1) {
              setFirstName(nameParts[0] || '');
              setLastName('');
            } else {
              setFirstName('');
              setLastName('');
            }
          }

        setEmail(profile.email || '');
        setGender(profile.gender || 'FEMALE');
        setPhoneNumber(profile.phoneNumber || '');
        setAddress(''); 
        await AsyncStorage.setItem('userData', JSON.stringify({
          id: profile.id.toString(),
          name: profile.name,
          email: profile.email,
          phoneNumber: profile.phoneNumber,
          gender: profile.gender,
          avatarUrl: profile.avatarUrl,
        }));
      } catch (apiError) {
        console.error('Error loading from API, trying AsyncStorage:', apiError);
        const userDataString = await AsyncStorage.getItem('userData');
        if (userDataString) {
          const user = JSON.parse(userDataString);
          setUserData(user);

          if (user.name && !user.firstName && !user.lastName) {
            const nameParts = user.name.trim().split(' ').filter((part: string) => part.length > 0);
            if (nameParts.length > 1) {
              setFirstName(nameParts[nameParts.length - 1] || '');
              setLastName(nameParts.slice(0, nameParts.length - 1).join(' ') || '');
            } else if (nameParts.length === 1) {
              setFirstName(nameParts[0] || '');
              setLastName('');
            } else {
              setFirstName('');
              setLastName('');
            }
          } else {
            setFirstName(user.firstName || '');
            setLastName(user.lastName || '');
          }

          setEmail(user.email || '');
          setGender(user.gender || 'FEMALE');
          setPhoneNumber(user.phoneNumber || '');
          setAddress(user.address || '');
        }
      }
    } catch (error) {
      console.error('Error loading user data:', error);
      Alert.alert('Lỗi', 'Không thể tải thông tin profile');
    } finally {
      setIsLoadingProfile(false);
    }
  };

  const handleSaveChanges = async () => {
    if (!firstName.trim() || !lastName.trim()) {
      Alert.alert('Lỗi', 'Vui lòng điền đầy đủ họ và tên');
      return;
    }

    if (!userData?.id) {
      Alert.alert('Lỗi', 'Không tìm thấy thông tin người dùng');
      return;
    }

    setIsLoading(true);
    try {
      const fullName = `${lastName.trim()} ${firstName.trim()}`.trim();
      
      const updateData: any = {
        fullName,
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        gender,
      };

      if (phoneNumber.trim()) {
        updateData.phoneNumber = phoneNumber.trim();
      }

      if (address.trim()) {
        updateData.address = address.trim();
      }

      if (selectedImage) {
        updateData.avatar = selectedImage;
      }

      const updatedProfile = await updateProfile(Number(userData.id), updateData);

      const updatedUserData: UserData = {
        id: updatedProfile.id,
        name: updatedProfile.name,
        email: updatedProfile.email,
        phoneNumber: updatedProfile.phoneNumber,
        gender: updatedProfile.gender,
        avatarUrl: updatedProfile.avatarUrl,
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        address: address.trim(),
      };

      setUserData(updatedUserData);
      setSelectedImage(null); 

      await AsyncStorage.setItem('userData', JSON.stringify({
        id: updatedProfile.id.toString(),
        name: updatedProfile.name,
        email: updatedProfile.email,
        phoneNumber: updatedProfile.phoneNumber,
        gender: updatedProfile.gender,
        avatarUrl: updatedProfile.avatarUrl,
        address: updatedProfile.address,
      }));

      Alert.alert('Thành công', 'Đã cập nhật thông tin thành công', [
        {
          text: 'OK',
          onPress: () => router.back(),
        },
      ]);
    } catch (error: any) {
      console.error('Error updating profile:', error);
      Alert.alert('Lỗi', error.message || 'Không thể cập nhật thông tin');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditProfilePicture = async () => {
    // Yêu cầu quyền truy cập thư viện ảnh
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Cần quyền truy cập', 'Ứng dụng cần quyền truy cập thư viện ảnh để chọn avatar');
      return;
    }

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
        allowsMultipleSelection: false,
      });

      if (!result.canceled && result.assets && result.assets[0]) {
        const asset = result.assets[0];
        let fileName = 'avatar.jpg';
        if (asset.uri) {
          const uriParts = asset.uri.split('/');
          const lastPart = uriParts[uriParts.length - 1];
          if (lastPart && lastPart.includes('.')) {
            fileName = lastPart;
          } else {
            const extension = asset.mimeType?.split('/')[1] || 'jpg';
            fileName = `avatar.${extension}`;
          }
        }

        setSelectedImage({
          uri: asset.uri,
          type: asset.mimeType || 'image/jpeg',
          fileName: fileName,
        });
      }
    } catch (error: any) {
      console.error('Error picking image:', error);
      Alert.alert('Lỗi', error.message || 'Không thể chọn ảnh');
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={[]}>
      <StatusBar hidden />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        {isLoadingProfile ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#4B5563" />
            <Text style={styles.loadingText}>Đang tải thông tin...</Text>
          </View>
        ) : (
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
            <Text style={styles.headerTitle}>Profile Setting</Text>
            <View style={styles.headerSpacer} />
          </View>

          {/* Profile Picture */}
          <View style={styles.profilePictureSection}>
            <View style={styles.profilePictureContainer}>
              <View style={styles.profilePicture}>
                {selectedImage ? (
                  <Image source={{ uri: selectedImage.uri }} style={styles.profileImage} />
                ) : userData?.avatarUrl ? (
                  <Image source={{ uri: userData.avatarUrl }} style={styles.profileImage} />
                ) : (
                  <View style={styles.profilePlaceholder}>
                    <Ionicons name="person" size={60} color="#9CA3AF" />
                  </View>
                )}
              </View>
              <TouchableOpacity
                style={styles.editPictureButton}
                onPress={handleEditProfilePicture}
              >
                <Ionicons name="camera" size={16} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Form Fields */}
          <View style={styles.formSection}>
            <View style={styles.formRow}>
              <View style={styles.formField}>
                <Text style={styles.label}>First Name</Text>
                <TextInput
                  style={styles.input}
                  value={firstName}
                  onChangeText={setFirstName}
                  placeholder="First Name"
                  placeholderTextColor="#9CA3AF"
                />
              </View>
              <View style={[styles.formField, styles.formFieldRight]}>
                <Text style={styles.label}>Last Name</Text>
                <TextInput
                  style={styles.input}
                  value={lastName}
                  onChangeText={setLastName}
                  placeholder="Last Name"
                  placeholderTextColor="#9CA3AF"
                />
              </View>
            </View>

            <View style={styles.formField}>
              <Text style={styles.label}>Email</Text>
              <TextInput
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                placeholder="Email"
                placeholderTextColor="#9CA3AF"
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <View style={styles.formRow}>
              <View style={styles.formField}>
                <Text style={styles.label}>Gender</Text>
                <TouchableOpacity
                  style={styles.input}
                  onPress={() => {
                    // Toggle gender
                    setGender(gender === 'FEMALE' ? 'MALE' : 'FEMALE');
                  }}
                >
                  <Text style={styles.inputText}>
                    {gender === 'FEMALE' ? 'Female' : 'Male'}
                  </Text>
                </TouchableOpacity>
              </View>
              <View style={[styles.formField, styles.formFieldRight]}>
                <Text style={styles.label}>Phone</Text>
                <TextInput
                  style={styles.input}
                  value={phoneNumber}
                  onChangeText={setPhoneNumber}
                  placeholder="Phone"
                  placeholderTextColor="#9CA3AF"
                  keyboardType="phone-pad"
                />
              </View>
            </View>

            <View style={styles.formField}>
              <Text style={styles.label}>Address</Text>
              <TextInput
                style={styles.input}
                value={address}
                onChangeText={setAddress}
                placeholder="Address"
                placeholderTextColor="#9CA3AF"
                multiline
                numberOfLines={2}
              />
            </View>
          </View>
        </ScrollView>
        )}

        {/* Save Button */}
        <View style={styles.footer}>
          <TouchableOpacity
            style={[styles.saveButton, (isLoading || isLoadingProfile) && styles.saveButtonDisabled]}
            onPress={handleSaveChanges}
            disabled={isLoading || isLoadingProfile}
          >
            {isLoading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.saveButtonText}>Save change</Text>
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
    backgroundColor: '#F5F5F5',
  },
  keyboardView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
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
    color: '#000',
    flex: 1,
    textAlign: 'center',
  },
  headerSpacer: {
    width: 32,
  },
  profilePictureSection: {
    alignItems: 'center',
    paddingVertical: 40,
    backgroundColor: '#FFFFFF',
    marginBottom: 1,
  },
  profilePictureContainer: {
    position: 'relative',
  },
  profilePicture: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#FCE4EC',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    borderWidth: 4,
    borderColor: '#FFFFFF',
  },
  profileImage: {
    width: '100%',
    height: '100%',
  },
  profilePlaceholder: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  editPictureButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#4B5563',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  formSection: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingTop: 32,
    paddingBottom: 32,
  },
  formRow: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  formField: {
    flex: 1,
    marginBottom: 20,
  },
  formFieldRight: {
    marginLeft: 12,
  },
  label: {
    fontSize: 14,
    fontFamily: 'Product Sans Medium',
    fontWeight: '400',
    color: '#9CA3AF',
    marginBottom: 8,
  },
  input: {
    fontSize: 16,
    fontFamily: 'Product Sans Medium',
    fontWeight: '400',
    color: '#111827',
    paddingVertical: 8,
    paddingHorizontal: 0,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    minHeight: 40,
    justifyContent: 'center',
  },
  inputText: {
    fontSize: 16,
    fontFamily: 'Product Sans Medium',
    fontWeight: '400',
    color: '#111827',
  },
  footer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    paddingBottom: Platform.OS === 'ios' ? 34 : 16,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  saveButton: {
    backgroundColor: '#4B5563',
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveButtonText: {
    fontSize: 16,
    fontFamily: 'Product Sans Medium',
    fontWeight: '600',
    color: '#FFFFFF',
  },
  saveButtonDisabled: {
    opacity: 0.6,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 14,
    fontFamily: 'Product Sans Medium',
    fontWeight: '500',
    color: '#6B7280',
  },
});

