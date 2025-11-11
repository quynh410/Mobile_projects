import React, { createContext, ReactNode, useCallback, useContext, useState } from 'react';

export interface FilterState {
  priceRange: { min: number; max: number };
  selectedColor: number | null;
  selectedCategory: number | null;
  selectedRating: number | null;
  selectedDiscounts: string[];
}

export interface FilterContextType {
  filters: FilterState;
  setFilters: (filters: FilterState) => void;
  resetFilters: () => void;
  hasActiveFilters: () => boolean;
}

const FilterContext = createContext<FilterContextType | undefined>(undefined);

const defaultFilters: FilterState = {
  priceRange: { min: 0, max: 10000000 },
  selectedColor: null,
  selectedCategory: null,
  selectedRating: null,
  selectedDiscounts: [],
};

interface FilterProviderProps {
  children: ReactNode;
}

export const FilterProvider: React.FC<FilterProviderProps> = ({ children }) => {
  const [filters, setFilters] = useState<FilterState>(defaultFilters);

  const resetFilters = useCallback(() => {
    setFilters(defaultFilters);
  }, []);

  const hasActiveFilters = useCallback((): boolean => {
    return (
      filters.priceRange.min !== defaultFilters.priceRange.min ||
      filters.priceRange.max !== defaultFilters.priceRange.max ||
      filters.selectedColor !== null ||
      filters.selectedCategory !== null ||
      filters.selectedRating !== null ||
      filters.selectedDiscounts.length > 0
    );
  }, [filters]);

  const value: FilterContextType = {
    filters,
    setFilters,
    resetFilters,
    hasActiveFilters,
  };

  return <FilterContext.Provider value={value}>{children}</FilterContext.Provider>;
};

export const useFilter = (): FilterContextType => {
  const context = useContext(FilterContext);
  if (context === undefined) {
    throw new Error('useFilter must be used within a FilterProvider');
  }
  return context;
};

