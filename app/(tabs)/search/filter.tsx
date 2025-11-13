import { getAllCategoriesNoPaging, getAllColors } from '@/apis';
import { useFilter } from '@/contexts/FilterContext';
import { CategoryResponse } from '@/types/category';
import { ColorResponse } from '@/types/color';
import { formatVND } from '@/utils/formatCurrency';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const PRICE_MIN = 0;
const PRICE_MAX = 10000000; 

export default function FilterScreen() {
  const router = useRouter();
  const { filters, setFilters, resetFilters } = useFilter();
  const [priceRange, setPriceRange] = useState(filters.priceRange);
  const [selectedColor, setSelectedColor] = useState<number | null>(filters.selectedColor);
  const [selectedRating, setSelectedRating] = useState<number | null>(filters.selectedRating);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(filters.selectedCategory);
  const [selectedDiscounts, setSelectedDiscounts] = useState<string[]>(filters.selectedDiscounts);
  
  const [categories, setCategories] = useState<CategoryResponse[]>([]);
  const [colors, setColors] = useState<ColorResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCategoryModal, setShowCategoryModal] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const [categoriesRes, colorsRes] = await Promise.all([
        getAllCategoriesNoPaging(),
        getAllColors(),
      ]);
      
      if (categoriesRes.data) {
        setCategories(categoriesRes.data);
      }
      
      if (colorsRes.data) {
        const uniqueColors = colorsRes.data.reduce((acc: ColorResponse[], color) => {
          if (!acc.find(c => c.colorName.toLowerCase() === color.colorName.toLowerCase())) {
            acc.push(color);
          }
          return acc;
        }, []);
        setColors(uniqueColors);
      }
    } catch (error) {
      console.error('Error loading filter data:', error);
    } finally {
      setIsLoading(false);
    }
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
    };
    return colorMap[colorName] || '#CCCCCC';
  };

  const handlePriceMinChange = (delta: number) => {
    const newMin = Math.max(PRICE_MIN, Math.min(priceRange.max - 100000, priceRange.min + delta));
    setPriceRange({ ...priceRange, min: newMin });
  };

  const handlePriceMaxChange = (delta: number) => {
    const newMax = Math.min(PRICE_MAX, Math.max(priceRange.min + 100000, priceRange.max + delta));
    setPriceRange({ ...priceRange, max: newMax });
  };

  const handleToggleDiscount = (discount: string) => {
    if (selectedDiscounts.includes(discount)) {
      setSelectedDiscounts(selectedDiscounts.filter((d) => d !== discount));
    } else {
      setSelectedDiscounts([...selectedDiscounts, discount]);
    }
  };

  const handleReset = () => {
    setPriceRange({ min: PRICE_MIN, max: PRICE_MAX });
    setSelectedColor(null);
    setSelectedRating(null);
    setSelectedCategory(null);
    setSelectedDiscounts([]);
    resetFilters();
  };

  const handleApply = () => {
    setFilters({
      priceRange,
      selectedColor,
      selectedCategory,
      selectedRating,
      selectedDiscounts,
    });
    router.back();
  };

  const selectedCategoryName = selectedCategory
    ? categories.find(c => c.categoryId === selectedCategory)?.categoryName || 'All Categories'
    : 'All Categories';

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#5D4037" />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Filter</Text>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="close" size={24} color="#000" />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollView}>
        {/* Price Range */}
        <View style={styles.filterSection}>
          <Text style={styles.filterTitle}>Price Range</Text>
          <View style={styles.priceContainer}>
            <View style={styles.priceInputContainer}>
              <View style={styles.priceInput}>
                <Text style={styles.priceInputLabel}>Min</Text>
                <Text style={styles.priceInputValue}>{formatVND(priceRange.min)}</Text>
              </View>
              <View style={styles.priceInput}>
                <Text style={styles.priceInputLabel}>Max</Text>
                <Text style={styles.priceInputValue}>{formatVND(priceRange.max)}</Text>
              </View>
            </View>
            <View style={styles.priceRangeControls}>
              <View style={styles.priceRangeControl}>
                <Text style={styles.priceRangeControlLabel}>Min Price</Text>
                <View style={styles.priceRangeButtons}>
                  <TouchableOpacity
                    style={styles.priceRangeButton}
                    onPress={() => handlePriceMinChange(-100000)}
                  >
                    <Ionicons name="remove" size={20} color="#000" />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.priceRangeButton}
                    onPress={() => handlePriceMinChange(100000)}
                  >
                    <Ionicons name="add" size={20} color="#000" />
                  </TouchableOpacity>
                </View>
              </View>
              <View style={styles.priceRangeControl}>
                <Text style={styles.priceRangeControlLabel}>Max Price</Text>
                <View style={styles.priceRangeButtons}>
                  <TouchableOpacity
                    style={styles.priceRangeButton}
                    onPress={() => handlePriceMaxChange(-100000)}
                  >
                    <Ionicons name="remove" size={20} color="#000" />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.priceRangeButton}
                    onPress={() => handlePriceMaxChange(100000)}
                  >
                    <Ionicons name="add" size={20} color="#000" />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* Color */}
        <View style={styles.filterSection}>
          <Text style={styles.filterTitle}>Color</Text>
          <View style={styles.colorsContainer}>
            {colors.length > 0 ? (
              colors.map((color) => (
                <TouchableOpacity
                  key={color.colorId}
                  style={[
                    styles.colorSwatch,
                    {
                      backgroundColor: getColorHex(color.colorName),
                      borderColor: selectedColor === color.colorId ? '#000' : '#E5E7EB',
                      borderWidth: selectedColor === color.colorId ? 3 : 1,
                    },
                  ]}
                  onPress={() =>
                    setSelectedColor(selectedColor === color.colorId ? null : color.colorId)
                  }
                />
              ))
            ) : (
              <Text style={styles.emptyText}>No colors available</Text>
            )}
          </View>
        </View>

        {/* Category */}
        <View style={styles.filterSection}>
          <Text style={styles.filterTitle}>Category</Text>
          <TouchableOpacity
            style={styles.categoryDropdown}
            onPress={() => setShowCategoryModal(true)}
          >
            <Ionicons name="grid-outline" size={20} color="#6B7280" />
            <Text style={styles.categoryText}>{selectedCategoryName}</Text>
            <Ionicons name="chevron-down" size={20} color="#6B7280" />
          </TouchableOpacity>
        </View>

        {/* Discount*/}
        <View style={styles.filterSection}>
          <Text style={styles.filterTitle}>Discount</Text>
          <View style={styles.discountContainer}>
            {['50% off', '40% off', '30% off', '25% off'].map((discount) => (
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
                  <Ionicons name="close" size={16} color="#FFF" style={styles.discountClose} />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Category Modal */}
      <Modal
        visible={showCategoryModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowCategoryModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Category</Text>
              <TouchableOpacity onPress={() => setShowCategoryModal(false)}>
                <Ionicons name="close" size={24} color="#000" />
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.modalScrollView}>
              <TouchableOpacity
                style={[
                  styles.modalItem,
                  selectedCategory === null && styles.modalItemSelected,
                ]}
                onPress={() => {
                  setSelectedCategory(null);
                  setShowCategoryModal(false);
                }}
              >
                <Text
                  style={[
                    styles.modalItemText,
                    selectedCategory === null && styles.modalItemTextSelected,
                  ]}
                >
                  All Categories
                </Text>
                {selectedCategory === null && (
                  <Ionicons name="checkmark" size={20} color="#5D4037" />
                )}
              </TouchableOpacity>
              {categories.map((category) => (
                <TouchableOpacity
                  key={category.categoryId}
                  style={[
                    styles.modalItem,
                    selectedCategory === category.categoryId && styles.modalItemSelected,
                  ]}
                  onPress={() => {
                    setSelectedCategory(category.categoryId);
                    setShowCategoryModal(false);
                  }}
                >
                  <Text
                    style={[
                      styles.modalItemText,
                      selectedCategory === category.categoryId && styles.modalItemTextSelected,
                    ]}
                  >
                    {category.categoryName}
                  </Text>
                  {selectedCategory === category.categoryId && (
                    <Ionicons name="checkmark" size={20} color="#5D4037" />
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>

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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
    gap: 16,
  },
  priceInputContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  priceInput: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  priceInputLabel: {
    fontSize: 12,
    fontFamily: 'Product Sans Medium',
    fontWeight: '500',
    color: '#6B7280',
    marginBottom: 4,
  },
  priceInputValue: {
    fontSize: 16,
    fontFamily: 'Product Sans Medium',
    fontWeight: '500',
    color: '#000',
  },
  priceRangeControls: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  priceRangeControl: {
    flex: 1,
    gap: 8,
  },
  priceRangeControlLabel: {
    fontSize: 12,
    fontFamily: 'Product Sans Medium',
    fontWeight: '500',
    color: '#6B7280',
  },
  priceRangeButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  priceRangeButton: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    padding: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  colorsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  colorSwatch: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
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
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  modalTitle: {
    fontSize: 18,
    fontFamily: 'Product Sans Medium',
    fontWeight: '500',
    color: '#000',
  },
  modalScrollView: {
    maxHeight: 400,
  },
  modalItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  modalItemSelected: {
    backgroundColor: '#F9FAFB',
  },
  modalItemText: {
    fontSize: 16,
    fontFamily: 'Product Sans Medium',
    fontWeight: '500',
    color: '#000',
  },
  modalItemTextSelected: {
    color: '#5D4037',
  },
  emptyText: {
    fontSize: 14,
    fontFamily: 'Product Sans Medium',
    fontWeight: '500',
    color: '#6B7280',
  },
});
