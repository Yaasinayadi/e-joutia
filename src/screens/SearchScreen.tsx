import React, { useContext, useCallback, useState, useRef } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  SafeAreaView,
  TextInput,
  Keyboard,
  ScrollView,
  Platform,
  ListRenderItem
} from 'react-native';
import BottomSheet, { BottomSheetView, BottomSheetScrollView, BottomSheetBackdrop } from '@gorhom/bottom-sheet';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SearchContext, FilterState, SortOption } from '../context/SearchContext';
import { Product } from '../data/mockData';

const { width } = Dimensions.get('window');
const CARD_MARGIN = 8;
const PADDING_HORIZONTAL = 16;

const CATEGORIES = ['Électronique', 'Mode', 'Maison', 'Véhicules', 'Autres'];
const CONDITIONS = ['Neuf', 'Comme neuf', 'Bon état', 'Correct'];
const SORT_OPTIONS: { label: string; value: SortOption }[] = [
  { label: 'Le plus proche', value: 'distance' },
  { label: 'Prix croissant', value: 'priceAsc' },
  { label: 'Prix décroissant', value: 'priceDesc' },
];

interface TempFilterState extends Omit<FilterState, 'minPrice' | 'maxPrice'> {
  minPrice: string | null;
  maxPrice: string | null;
}

const buildTempFilters = (f: FilterState): TempFilterState => ({
  ...f,
  minPrice: f.minPrice !== null ? f.minPrice.toString() : null,
  maxPrice: f.maxPrice !== null ? f.maxPrice.toString() : null,
});

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const [imgError, setImgError] = useState(false);
  // Image par défaut élégante si l'URL Unsplash est brisée
  const fallbackImg = "https://images.unsplash.com/photo-1560393464-5c69a73c5770?auto=format&fit=crop&w=500&q=60";

  return (
    <TouchableOpacity style={styles.cardContainer} activeOpacity={0.8}>
      <Image 
        source={{ uri: imgError ? fallbackImg : product.imageUrl }} 
        style={styles.cardImage} 
        resizeMode="cover" 
        onError={() => setImgError(true)}
      />
      <View style={styles.cardContent}>
        <Text style={styles.cardPrice}>{product.price.toLocaleString()} DH</Text>
        <Text style={styles.cardTitle} numberOfLines={1}>{product.title}</Text>
        <Text style={styles.cardDistance}>À {product.distance} km</Text>
      </View>
    </TouchableOpacity>
  );
};

const SearchScreen = () => {
  const {
    getFilteredProducts,
    resetFilters,
    searchPhrase,
    setSearchPhrase,
    searchHistory,
    addToHistory,
    clearHistory,
    activeFilters,
    setFilters,
  } = useContext(SearchContext);

  const [isSearchFocused, setIsSearchFocused] = useState<boolean>(false);
  const [tempFilters, setTempFilters] = useState<TempFilterState>(buildTempFilters(activeFilters));

  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = ['75%'];

  const products = getFilteredProducts();

  const openSheet = () => {
    setTempFilters(buildTempFilters(activeFilters));
    bottomSheetRef.current?.expand();
  };

  const closeSheet = () => bottomSheetRef.current?.close();

  const hasActiveFilters = Boolean(
    activeFilters.category ||
    activeFilters.condition ||
    activeFilters.minPrice !== null ||
    activeFilters.maxPrice !== null ||
    activeFilters.sortBy,
  );

  const renderItem: ListRenderItem<Product> = useCallback(
    ({ item }: { item: Product }) => <ProductCard product={item} />,
    [],
  );

  const keyExtractor = useCallback((item: Product) => item.id.toString(), []);

  const renderEmptyComponent = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyTitle}>Aucun résultat</Text>
      <Text style={styles.emptySubtitle}>
        Nous n'avons trouvé aucun produit correspondant à vos critères.
      </Text>
      <TouchableOpacity style={styles.resetButton} onPress={resetFilters}>
        <Text style={styles.resetButtonText}>Réinitialiser les filtres</Text>
      </TouchableOpacity>
    </View>
  );

  const handleSearchSubmit = () => {
    if (searchPhrase.trim()) addToHistory(searchPhrase);
    setIsSearchFocused(false);
    Keyboard.dismiss();
  };

  const handleHistoryItemPress = (item: string) => {
    setSearchPhrase(item);
    addToHistory(item);
    setIsSearchFocused(false);
    Keyboard.dismiss();
  };

  const applyFilters = () => {
    const finalFilters: Partial<FilterState> = {
      ...tempFilters,
      minPrice:
        tempFilters.minPrice !== '' && tempFilters.minPrice !== null
          ? parseFloat(tempFilters.minPrice)
          : null,
      maxPrice:
        tempFilters.maxPrice !== '' && tempFilters.maxPrice !== null
          ? parseFloat(tempFilters.maxPrice)
          : null,
    };
    setFilters(finalFilters);
    closeSheet();
  };

  const handleResetFilters = () => {
    resetFilters();
    closeSheet();
  };

  const toggleTempFilter = <K extends keyof TempFilterState>(key: K, value: TempFilterState[K]) => {
    setTempFilters((prev: TempFilterState) => ({
      ...prev,
      [key]: prev[key] === value ? null : value,
    }));
  };

  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        opacity={0.5}
      />
    ),
    [],
  );

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView style={styles.container}>
        <View style={styles.searchHeaderContainer}>
          <View style={styles.searchBarWrapper}>
            <Text style={styles.searchIcon}>🔍</Text>
            <TextInput
              style={styles.searchInput}
              placeholder="Que recherchez-vous ?"
              placeholderTextColor="#9CA3AF"
              value={searchPhrase}
              onChangeText={setSearchPhrase}
              onFocus={() => setIsSearchFocused(true)}
              onSubmitEditing={handleSearchSubmit}
              returnKeyType="search"
            />
            {searchPhrase.length > 0 && (
              <TouchableOpacity onPress={() => setSearchPhrase('')} style={styles.clearIconContainer}>
                <Text style={styles.clearIcon}>✕</Text>
              </TouchableOpacity>
            )}
          </View>

          {isSearchFocused ? (
            <TouchableOpacity
              onPress={() => { setIsSearchFocused(false); Keyboard.dismiss(); }}
              style={styles.cancelButton}
            >
              <Text style={styles.cancelButtonText}>Annuler</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={styles.filterButton} onPress={openSheet}>
              <Text style={styles.filterIcon}>⚙️</Text>
              {hasActiveFilters && <View style={styles.activeFilterDot} />}
            </TouchableOpacity>
          )}
        </View>

        {isSearchFocused ? (
          <View style={styles.historyContainer}>
            {searchHistory.length > 0 ? (
              <>
                <View style={styles.historyHeader}>
                  <Text style={styles.historyTitle}>Recherches récentes</Text>
                  <TouchableOpacity onPress={clearHistory}>
                    <Text style={styles.clearHistoryText}>Effacer</Text>
                  </TouchableOpacity>
                </View>
                {searchHistory.map((item: string, index: number) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.historyItem}
                    onPress={() => handleHistoryItemPress(item)}
                  >
                    <Text style={styles.historyItemIcon}>🕒</Text>
                    <Text style={styles.historyItemText}>{item}</Text>
                    <Text style={styles.historyItemArrow}>↖</Text>
                  </TouchableOpacity>
                ))}
              </>
            ) : (
              <Text style={styles.emptyHistoryText}>Aucune recherche récente.</Text>
            )}
          </View>
        ) : (
          <>
            <View style={styles.header}>
              <Text style={styles.headerTitle}>
                {searchPhrase ? `Résultats pour "${searchPhrase}"` : 'Toutes les annonces'}
              </Text>
              <Text style={styles.resultsCount}>
                {products.length} résultat{products.length !== 1 && 's'}
              </Text>
            </View>

            <FlatList
              data={products}
              renderItem={renderItem}
              keyExtractor={keyExtractor}
              numColumns={2}
              contentContainerStyle={products.length === 0 ? styles.listContentEmpty : styles.listContent}
              columnWrapperStyle={products.length > 0 ? styles.columnWrapper : undefined}
              showsVerticalScrollIndicator={false}
              ListEmptyComponent={renderEmptyComponent}
              initialNumToRender={6}
              maxToRenderPerBatch={6}
              windowSize={5}
              removeClippedSubviews={true}
              keyboardShouldPersistTaps="handled"
            />
          </>
        )}

        <BottomSheet
          ref={bottomSheetRef}
          index={-1}
          snapPoints={snapPoints}
          enablePanDownToClose={true}
          backdropComponent={renderBackdrop}
          handleIndicatorStyle={styles.sheetIndicator}
          backgroundStyle={styles.sheetBackground}
          style={styles.sheetContainer}
        >
          <BottomSheetView style={{ flex: 1 }}>
            <View style={styles.sheetHeader}>
              <Text style={styles.sheetTitle}>Filtres & Tri</Text>
              <TouchableOpacity onPress={closeSheet} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                <Text style={styles.closeSheetIcon}>✕</Text>
              </TouchableOpacity>
            </View>

          <BottomSheetScrollView
            style={styles.sheetContent}
            contentContainerStyle={styles.sheetContentInner}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            <Text style={styles.sectionTitle}>Trier par</Text>
            <View style={styles.pillContainer}>
              {SORT_OPTIONS.map(option => {
                const isActive = tempFilters.sortBy === option.value;
                return (
                  <TouchableOpacity
                    key={option.value ?? 'none'}
                    style={[styles.pill, isActive && styles.pillActive]}
                    onPress={() => toggleTempFilter('sortBy', option.value)}
                  >
                    <Text style={[styles.pillText, isActive && styles.pillTextActive]}>
                      {option.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            <Text style={styles.sectionTitle}>Catégorie</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
              <View style={styles.horizontalPillContainer}>
                {CATEGORIES.map(cat => {
                  const isActive = tempFilters.category === cat;
                  return (
                    <TouchableOpacity
                      key={cat}
                      style={[styles.pill, isActive && styles.pillActive]}
                      onPress={() => toggleTempFilter('category', cat)}
                    >
                      <Text style={[styles.pillText, isActive && styles.pillTextActive]}>{cat}</Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </ScrollView>

            <Text style={styles.sectionTitle}>État du produit</Text>
            <View style={styles.pillContainer}>
              {CONDITIONS.map(cond => {
                const isActive = tempFilters.condition === cond;
                return (
                  <TouchableOpacity
                    key={cond}
                    style={[styles.pill, isActive && styles.pillActive]}
                    onPress={() => toggleTempFilter('condition', cond)}
                  >
                    <Text style={[styles.pillText, isActive && styles.pillTextActive]}>{cond}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            <Text style={styles.sectionTitle}>Prix (DH)</Text>
            <View style={styles.priceContainer}>
              <TextInput
                style={styles.priceInput}
                placeholder="Min"
                placeholderTextColor="#9CA3AF"
                keyboardType="numeric"
                value={tempFilters.minPrice ?? ''}
                onChangeText={(text: string) =>
                  setTempFilters((prev: TempFilterState) => ({ ...prev, minPrice: text }))
                }
              />
              <Text style={styles.priceSeparator}>-</Text>
              <TextInput
                style={styles.priceInput}
                placeholder="Max"
                placeholderTextColor="#9CA3AF"
                keyboardType="numeric"
                value={tempFilters.maxPrice ?? ''}
                onChangeText={(text: string) =>
                  setTempFilters((prev: TempFilterState) => ({ ...prev, maxPrice: text }))
                }
              />
            </View>
            <View style={{ height: 40 }} />
          </BottomSheetScrollView>

          <View style={styles.sheetFooter}>
            <TouchableOpacity style={styles.resetSheetButton} onPress={handleResetFilters}>
              <Text style={styles.resetSheetText}>Réinitialiser</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.applySheetButton} onPress={applyFilters}>
              <Text style={styles.applySheetText}>Appliquer</Text>
            </TouchableOpacity>
          </View>
          </BottomSheetView>
        </BottomSheet>

      </SafeAreaView>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F7F9FC' },
  searchHeaderContainer: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: PADDING_HORIZONTAL, paddingTop: 12, paddingBottom: 12,
    backgroundColor: '#FFFFFF', borderBottomWidth: 1, borderBottomColor: '#F3F4F6',
  },
  searchBarWrapper: {
    flex: 1, flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#F3F4F6', borderRadius: 12, paddingHorizontal: 12, height: 44,
  },
  searchIcon: { fontSize: 16, color: '#6B7280', marginRight: 8 },
  searchInput: { flex: 1, fontSize: 15, color: '#111827', height: '100%' },
  clearIconContainer: { padding: 4 },
  clearIcon: { fontSize: 14, color: '#9CA3AF', fontWeight: 'bold' },
  filterButton: {
    width: 44, height: 44, backgroundColor: '#F3F4F6', borderRadius: 12, marginLeft: 10,
    justifyContent: 'center', alignItems: 'center', position: 'relative',
  },
  filterIcon: { fontSize: 18 },
  activeFilterDot: {
    position: 'absolute', top: 10, right: 10, width: 8, height: 8,
    borderRadius: 4, backgroundColor: '#EF4444', borderWidth: 1, borderColor: '#F3F4F6',
  },
  cancelButton: { marginLeft: 12, justifyContent: 'center' },
  cancelButtonText: { color: '#2563EB', fontSize: 15, fontWeight: '500' },
  historyContainer: { flex: 1, backgroundColor: '#FFFFFF', paddingTop: 16 },
  historyHeader: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: PADDING_HORIZONTAL, marginBottom: 12,
  },
  historyTitle: { fontSize: 16, fontWeight: '700', color: '#111827' },
  clearHistoryText: { fontSize: 14, color: '#EF4444', fontWeight: '500' },
  historyItem: {
    flexDirection: 'row', alignItems: 'center',
    paddingVertical: 14, paddingHorizontal: PADDING_HORIZONTAL,
    borderBottomWidth: 1, borderBottomColor: '#F3F4F6',
  },
  historyItemIcon: { fontSize: 16, color: '#9CA3AF', marginRight: 12 },
  historyItemText: { flex: 1, fontSize: 15, color: '#374151' },
  historyItemArrow: { fontSize: 16, color: '#D1D5DB' },
  emptyHistoryText: { fontSize: 15, color: '#9CA3AF', textAlign: 'center', marginTop: 40 },
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: PADDING_HORIZONTAL, paddingTop: 16, paddingBottom: 12,
  },
  headerTitle: { fontSize: 20, fontWeight: '700', color: '#111827', flex: 1 },
  resultsCount: { fontSize: 13, color: '#6B7280', fontWeight: '500', marginLeft: 10 },
  listContent: { paddingHorizontal: PADDING_HORIZONTAL, paddingBottom: 24, alignSelf: 'center', width: '100%', maxWidth: 1200 },
  listContentEmpty: { flexGrow: 1, alignSelf: 'center', width: '100%', maxWidth: 1200 },
  columnWrapper: { justifyContent: 'space-between', marginBottom: CARD_MARGIN * 2 },
  cardContainer: {
    width: '48%', backgroundColor: '#FFFFFF', borderRadius: 14,
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06, shadowRadius: 10, elevation: 3, overflow: 'hidden',
  },
  cardImage: { width: '100%', height: 150, backgroundColor: '#E5E7EB' },
  cardContent: { padding: 12 },
  cardPrice: { fontSize: 16, fontWeight: '800', color: '#2563EB', marginBottom: 6 },
  cardTitle: { fontSize: 14, fontWeight: '600', color: '#374151', marginBottom: 8 },
  cardDistance: { fontSize: 12, color: '#9CA3AF', fontWeight: '500' },
  emptyContainer: {
    flex: 1, justifyContent: 'center', alignItems: 'center',
    paddingHorizontal: 32, paddingTop: 80,
  },
  emptyTitle: { fontSize: 22, fontWeight: '700', color: '#111827', marginBottom: 12 },
  emptySubtitle: {
    fontSize: 15, color: '#6B7280', textAlign: 'center', lineHeight: 22, marginBottom: 32,
  },
  resetButton: {
    backgroundColor: '#2563EB', paddingVertical: 14, paddingHorizontal: 28, borderRadius: 10,
    shadowColor: '#2563EB', shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25, shadowRadius: 10, elevation: 5,
  },
  resetButtonText: { color: '#FFFFFF', fontSize: 16, fontWeight: '600' },
  sheetContainer: { maxWidth: 550, alignSelf: 'center', width: '100%' },
  sheetBackground: { backgroundColor: '#FFFFFF', borderRadius: 24 },
  sheetIndicator: { backgroundColor: '#D1D5DB', width: 40 },
  sheetHeader: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 20, paddingTop: 16, paddingBottom: 16,
    borderBottomWidth: 1, borderBottomColor: '#F3F4F6',
  },
  sheetTitle: { fontSize: 18, fontWeight: '700', color: '#111827' },
  closeSheetIcon: { fontSize: 20, color: '#6B7280', fontWeight: '600', padding: 4 },
  sheetContent: { flex: 1 },
  sheetContentInner: { paddingHorizontal: 20, paddingTop: 8 },
  sectionTitle: { fontSize: 16, fontWeight: '600', color: '#374151', marginBottom: 12, marginTop: 16 },
  pillContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  horizontalScroll: { marginHorizontal: -20, paddingHorizontal: 20 },
  horizontalPillContainer: { flexDirection: 'row', gap: 10, paddingRight: 40 },
  pill: {
    backgroundColor: '#F3F4F6', paddingVertical: 10, paddingHorizontal: 16,
    borderRadius: 20, borderWidth: 1, borderColor: '#F3F4F6', marginBottom: 10,
  },
  pillActive: { backgroundColor: '#EFF6FF', borderColor: '#2563EB' },
  pillText: { color: '#4B5563', fontSize: 14, fontWeight: '500' },
  pillTextActive: { color: '#2563EB', fontWeight: '600' },
  priceContainer: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 20 },
  priceInput: {
    flex: 1, backgroundColor: '#F3F4F6', borderRadius: 12,
    paddingHorizontal: 16, height: 48, fontSize: 15, color: '#111827',
  },
  priceSeparator: { fontSize: 18, color: '#9CA3AF', fontWeight: '600' },
  sheetFooter: {
    flexDirection: 'row', justifyContent: 'space-between', gap: 12,
    paddingHorizontal: 20, paddingTop: 16, paddingBottom: Platform.OS === 'ios' ? 28 : 20,
    borderTopWidth: 1, borderTopColor: '#F3F4F6', backgroundColor: '#FFFFFF',
  },
  resetSheetButton: {
    flex: 1, backgroundColor: '#F3F4F6', paddingVertical: 14, borderRadius: 12,
    alignItems: 'center', justifyContent: 'center',
  },
  resetSheetText: { color: '#374151', fontSize: 16, fontWeight: '600' },
  applySheetButton: {
    flex: 1, backgroundColor: '#2563EB', paddingVertical: 14, borderRadius: 12,
    alignItems: 'center', justifyContent: 'center',
    shadowColor: '#2563EB', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2, shadowRadius: 8, elevation: 4,
  },
  applySheetText: { color: '#FFFFFF', fontSize: 16, fontWeight: '600' },
});

export default SearchScreen;
