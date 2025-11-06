import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function FilterScreen() {
  const router = useRouter();
  const [priceRange, setPriceRange] = useState({ min: 10, max: 60 });
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedRating, setSelectedRating] = useState<number | null>(5);
  const [selectedCategory, setSelectedCategory] = useState('Crop Tees');
  const [selectedDiscounts, setSelectedDiscounts] = useState<string[]>([]);

  const colors = [
    { name: 'Orange', value: '#FF6B35' },
    { name: 'Red', value: '#EF4444' },
    { name: 'Black', value: '#000000' },
    { name: 'Blue', value: '#3B82F6' },
    { name: 'White', value: '#FFFFFF' },
    { name: 'Brown', value: '#8B4513' },
    { name: 'Pink', value: '#F472B6' },
  ];

  const discounts = ['50% off', '40% off', '30% off', '25% off'];

  const handleToggleDiscount = (discount: string) => {
    if (selectedDiscounts.includes(discount)) {
      setSelectedDiscounts(selectedDiscounts.filter((d) => d !== discount));
    } else {
      setSelectedDiscounts([...selectedDiscounts, discount]);
    }
  };

  const handleReset = () => {
    setPriceRange({ min: 10, max: 60 });
    setSelectedColor(null);
    setSelectedRating(null);
    setSelectedCategory('Crop Tees');
    setSelectedDiscounts([]);
  };

  const handleApply = () => {
    // Apply filters logic here
    router.back();
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Filter</Text>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="options-outline" size={24} color="#000" />
        </TouchableOpacity>
      </View>

        <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollView}>
          {/* Price Range */}
          <View style={styles.filterSection}>
            <Text style={styles.filterTitle}>Price</Text>
            <View style={styles.priceContainer}>
              <View style={styles.priceRangeBar}>
                <View style={styles.priceRangeTrack}>
                  <View
                    style={[
                      styles.priceRangeFill,
                      {
                        left: `${((priceRange.min - 10) / 50) * 100}%`,
                        width: `${((priceRange.max - priceRange.min) / 50) * 100}%`,
                      },
                    ]}
                  />
                  <View
                    style={[
                      styles.priceRangeThumb,
                      { left: `${((priceRange.min - 10) / 50) * 100}%` },
                    ]}
                  />
                  <View
                    style={[
                      styles.priceRangeThumb,
                      { left: `${((priceRange.max - 10) / 50) * 100}%` },
                    ]}
                  />
                </View>
              </View>
              <View style={styles.priceLabels}>
                <Text style={styles.priceLabel}>${priceRange.min}</Text>
                <Text style={styles.priceLabel}>${priceRange.max}</Text>
              </View>
            </View>
          </View>

          {/* Color */}
          <View style={styles.filterSection}>
            <Text style={styles.filterTitle}>Color</Text>
            <View style={styles.colorsContainer}>
              {colors.map((color) => (
                <TouchableOpacity
                  key={color.name}
                  style={[
                    styles.colorSwatch,
                    {
                      backgroundColor: color.value,
                      borderColor: selectedColor === color.name ? '#000' : '#E5E7EB',
                      borderWidth: selectedColor === color.name ? 2 : 1,
                    },
                  ]}
                  onPress={() =>
                    setSelectedColor(selectedColor === color.name ? null : color.name)
                  }
                />
              ))}
            </View>
          </View>

          {/* Star Rating */}
          <View style={styles.filterSection}>
            <Text style={styles.filterTitle}>Star Rating</Text>
            <View style={styles.ratingContainer}>
              {[1, 2, 3, 4, 5].map((rating) => (
                <TouchableOpacity
                  key={rating}
                  style={styles.ratingButton}
                  onPress={() =>
                    setSelectedRating(selectedRating === rating ? null : rating)
                  }
                >
                  <Ionicons
                    name={selectedRating === rating ? 'star' : 'star-outline'}
                    size={24}
                    color={selectedRating === rating ? '#FBBF24' : '#9CA3AF'}
                  />
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Category */}
          <View style={styles.filterSection}>
            <Text style={styles.filterTitle}>Category</Text>
            <TouchableOpacity style={styles.categoryDropdown}>
              <Ionicons name="calendar-outline" size={20} color="#6B7280" />
              <Text style={styles.categoryText}>{selectedCategory}</Text>
              <Ionicons name="chevron-down" size={20} color="#6B7280" />
            </TouchableOpacity>
          </View>

          {/* Discount */}
          <View style={styles.filterSection}>
            <Text style={styles.filterTitle}>Discount</Text>
            <View style={styles.discountContainer}>
              {discounts.map((discount) => (
                <TouchableOpacity
                  key={discount}
                  style={[
                    styles.discountButton,
                    selectedDiscounts.includes(discount) && styles.discountButtonSelected,
                  ]}
                  onPress={() => handleToggleDiscount(discount)}
                >
                  <Text
                    style={[
                      styles.discountText,
                      selectedDiscounts.includes(discount) && styles.discountTextSelected,
                    ]}
                  >
                    {discount}
                  </Text>
                  {selectedDiscounts.includes(discount) && (
                    <Ionicons name="close" size={16} color="#000" style={styles.discountClose} />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </ScrollView>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.resetButton} onPress={handleReset}>
            <Text style={styles.resetText}>Reset</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.applyButton} onPress={handleApply}>
            <Text style={styles.applyText}>Apply</Text>
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
    paddingTop: Platform.OS === 'ios' ? 8 : 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: 'Product Sans Medium',
    fontWeight: '500',
    color: '#000',
  },
  scrollView: {
    flex: 1,
  },
  filterSection: {
    paddingHorizontal: 20,
    paddingVertical: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  filterTitle: {
    fontSize: 16,
    fontFamily: 'Product Sans Medium',
    fontWeight: '500',
    color: '#000',
    marginBottom: 16,
  },
  priceContainer: {
    gap: 12,
  },
  priceRangeBar: {
    height: 40,
    justifyContent: 'center',
  },
  priceRangeTrack: {
    height: 4,
    backgroundColor: '#E5E7EB',
    borderRadius: 2,
    position: 'relative',
  },
  priceRangeFill: {
    position: 'absolute',
    height: 4,
    backgroundColor: '#5D4037',
    borderRadius: 2,
  },
  priceRangeThumb: {
    position: 'absolute',
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#5D4037',
    borderWidth: 2,
    borderColor: '#FFFFFF',
    top: -8,
    marginLeft: -10,
  },
  priceLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  priceLabel: {
    fontSize: 14,
    fontFamily: 'Product Sans Medium',
    fontWeight: '500',
    color: '#1F2937',
  },
  colorsContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  colorSwatch: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
  },
  ratingContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  ratingButton: {
    padding: 4,
  },
  categoryDropdown: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    gap: 12,
  },
  categoryText: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Product Sans Medium',
    fontWeight: '500',
    color: '#000',
  },
  discountContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  discountButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    gap: 8,
  },
  discountButtonSelected: {
    backgroundColor: '#5D4037',
    borderColor: '#5D4037',
  },
  discountText: {
    fontSize: 14,
    fontFamily: 'Product Sans Medium',
    fontWeight: '500',
    color: '#000',
  },
  discountTextSelected: {
    fontFamily: 'Product Sans Medium',
    fontWeight: '500',
    color: '#FFFFFF',
  },
  discountClose: {
    marginLeft: 4,
  },
  actionButtons: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    gap: 12,
  },
  resetButton: {
    flex: 1,
    paddingVertical: 16,
    alignItems: 'center',
  },
  resetText: {
    fontSize: 16,
    fontFamily: 'Product Sans Medium',
    fontWeight: '500',
    color: '#1F2937',
  },
  applyButton: {
    flex: 1,
    backgroundColor: '#5D4037',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  applyText: {
    fontSize: 16,
    fontFamily: 'Product Sans Medium',
    fontWeight: '500',
    color: '#FFFFFF',
  },
});

