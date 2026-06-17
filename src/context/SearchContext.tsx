import React, { createContext, useState, useEffect, useCallback, useMemo } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Product, mockData } from '../data/mockData';

export type SortOption = 'distance' | 'priceAsc' | 'priceDesc' | null;

export interface FilterState {
  category: string | null;
  condition: string | null;
  minPrice: number | null;
  maxPrice: number | null;
  sortBy: SortOption;
}

export interface SearchContextProps {
  searchPhrase: string;
  setSearchPhrase: (phrase: string) => void;
  searchHistory: string[];
  addToHistory: (phrase: string) => void;
  clearHistory: () => void;
  activeFilters: FilterState;
  setFilters: (filters: Partial<FilterState>) => void;
  resetFilters: () => void;
  getFilteredProducts: () => Product[];
}

const DEFAULT_FILTERS: FilterState = {
  category: null,
  condition: null,
  minPrice: null,
  maxPrice: null,
  sortBy: null,
};

export const SearchContext = createContext<SearchContextProps>({
  searchPhrase: '',
  setSearchPhrase: () => {},
  searchHistory: [],
  addToHistory: () => {},
  clearHistory: () => {},
  activeFilters: DEFAULT_FILTERS,
  setFilters: () => {},
  resetFilters: () => {},
  getFilteredProducts: () => [],
});

const HISTORY_STORAGE_KEY = '@search_history';

export const SearchProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [searchPhrase, setSearchPhrase] = useState<string>('');
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [activeFilters, setActiveFilters] = useState<FilterState>(DEFAULT_FILTERS);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      const storedHistory = await AsyncStorage.getItem(HISTORY_STORAGE_KEY);
      if (storedHistory) {
        setSearchHistory(JSON.parse(storedHistory));
      }
    } catch (e) {
      console.error('Error loading search history', e);
    }
  };

  const saveHistory = async (history: string[]) => {
    try {
      await AsyncStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(history));
    } catch (e) {
      console.error('Error saving search history', e);
    }
  };

  const addToHistory = useCallback((phrase: string) => {
    const trimmedPhrase = phrase.trim();
    if (!trimmedPhrase) return;

    setSearchHistory((prevHistory) => {
      const newHistory = prevHistory.filter(item => item !== trimmedPhrase);
      newHistory.unshift(trimmedPhrase);
      if (newHistory.length > 3) {
        newHistory.pop();
      }
      saveHistory(newHistory);
      return newHistory;
    });
  }, []);

  const clearHistory = useCallback(async () => {
    try {
      await AsyncStorage.removeItem(HISTORY_STORAGE_KEY);
      setSearchHistory([]);
    } catch (e) {
      console.error('Error clearing search history', e);
    }
  }, []);

  const setFilters = useCallback((newFilters: Partial<FilterState>) => {
    setActiveFilters((prev) => ({ ...prev, ...newFilters }));
  }, []);

  const resetFilters = useCallback(() => {
    setActiveFilters(DEFAULT_FILTERS);
  }, []);

  const getFilteredProducts = useCallback(() => {
    let filtered = [...mockData];

    if (searchPhrase.trim() !== '') {
      const lowerCasePhrase = searchPhrase.toLowerCase();
      filtered = filtered.filter(
        (product) =>
          product.title.toLowerCase().includes(lowerCasePhrase) ||
          product.description.toLowerCase().includes(lowerCasePhrase)
      );
    }

    if (activeFilters.category) {
      filtered = filtered.filter(p => p.category === activeFilters.category);
    }
    
    if (activeFilters.condition) {
      filtered = filtered.filter(p => p.condition === activeFilters.condition);
    }
    
    if (activeFilters.minPrice !== null) {
      filtered = filtered.filter(p => p.price >= activeFilters.minPrice!);
    }
    
    if (activeFilters.maxPrice !== null) {
      filtered = filtered.filter(p => p.price <= activeFilters.maxPrice!);
    }

    if (activeFilters.sortBy === 'distance') {
      filtered.sort((a, b) => a.distance - b.distance);
    } else if (activeFilters.sortBy === 'priceAsc') {
      filtered.sort((a, b) => a.price - b.price);
    } else if (activeFilters.sortBy === 'priceDesc') {
      filtered.sort((a, b) => b.price - a.price);
    }

    return filtered;
  }, [searchPhrase, activeFilters]);

  const value = useMemo(() => ({
    searchPhrase,
    setSearchPhrase,
    searchHistory,
    addToHistory,
    clearHistory,
    activeFilters,
    setFilters,
    resetFilters,
    getFilteredProducts,
  }), [
    searchPhrase,
    searchHistory,
    activeFilters,
    addToHistory,
    clearHistory,
    setFilters,
    resetFilters,
    getFilteredProducts
  ]);

  return (
    <SearchContext.Provider value={value}>
      {children}
    </SearchContext.Provider>
  );
};
