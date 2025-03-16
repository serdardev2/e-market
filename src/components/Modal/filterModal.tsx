import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
} from 'react-native';
import Modal from 'react-native-modal';
import { IconSymbol } from '@/src/components/ui/IconSymbol';
import { Colors } from '@/src/constants/Colors';
import { Product } from '@/src/types/product';
import { useTranslation } from 'react-i18next';

interface FilterModalProps {
  visible: boolean;
  onClose: () => void;
  onApplyFilters: (filters: FilterOptions) => void;
  products: Product[];
  activeFilters: FilterOptions | null;
}

export interface FilterOptions {
  brands: string[];
  priceRange: {
    min: number | null;
    max: number | null;
  };
  models: string[];
}

export const FilterModal: React.FC<FilterModalProps> = ({
  visible,
  onClose,
  onApplyFilters,
  products,
  activeFilters,
}) => {
  const { t } = useTranslation();
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedModels, setSelectedModels] = useState<string[]>([]);
  const [minPrice, setMinPrice] = useState<string>('');
  const [maxPrice, setMaxPrice] = useState<string>('');

  const allBrands = [
    ...new Set(products.map((product) => product.brand)),
  ].sort();
  const allModels = [
    ...new Set(products.map((product) => product.model)),
  ].sort();

  useEffect(() => {
    if (visible && activeFilters) {
      setSelectedBrands(activeFilters.brands || []);
      setSelectedModels(activeFilters.models || []);
      setMinPrice(
        activeFilters.priceRange.min !== null
          ? String(activeFilters.priceRange.min)
          : '',
      );
      setMaxPrice(
        activeFilters.priceRange.max !== null
          ? String(activeFilters.priceRange.max)
          : '',
      );
    } else if (visible && !activeFilters) {
      setSelectedBrands([]);
      setSelectedModels([]);
      setMinPrice('');
      setMaxPrice('');
    }
  }, [visible, activeFilters]);

  const toggleBrand = (brand: string) => {
    if (selectedBrands.includes(brand)) {
      setSelectedBrands(selectedBrands.filter((b) => b !== brand));
    } else {
      setSelectedBrands([...selectedBrands, brand]);
    }
  };

  const toggleModel = (model: string) => {
    if (selectedModels.includes(model)) {
      setSelectedModels(selectedModels.filter((m) => m !== model));
    } else {
      setSelectedModels([...selectedModels, model]);
    }
  };

  const handleApplyFilters = () => {
    const filters: FilterOptions = {
      brands: selectedBrands,
      models: selectedModels,
      priceRange: {
        min: minPrice ? parseFloat(minPrice) : null,
        max: maxPrice ? parseFloat(maxPrice) : null,
      },
    };
    onApplyFilters(filters);
    onClose();
  };

  const handleClearFilters = () => {
    setSelectedBrands([]);
    setSelectedModels([]);
    setMinPrice('');
    setMaxPrice('');
  };

  return (
    <Modal
      isVisible={visible}
      onBackdropPress={onClose}
      onBackButtonPress={onClose}
      swipeDirection="down"
      onSwipeComplete={onClose}
      style={styles.modal}
      backdropOpacity={0.5}
      propagateSwipe={true}
      animationIn="slideInUp"
      animationOut="slideOutDown"
      animationInTiming={300}
      animationOutTiming={300}
      backdropTransitionInTiming={300}
      backdropTransitionOutTiming={300}
      useNativeDriver={true}
      hideModalContentWhileAnimating={true}
    >
      <View style={styles.modalView}>
        <View style={styles.modalHeader}>
          <Text style={styles.modalTitle}>{t('filter.title')}</Text>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <IconSymbol name="xmark" size={20} color="#000" />
          </TouchableOpacity>
        </View>

        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.filterSection}>
            <Text style={styles.sectionTitle}>{t('filter.priceRange')}</Text>
            <View style={styles.priceInputContainer}>
              <View style={styles.priceInput}>
                <Text style={styles.priceLabel}>{t('filter.min')}</Text>
                <TextInput
                  style={styles.textInput}
                  value={minPrice}
                  onChangeText={setMinPrice}
                  keyboardType="numeric"
                  placeholder="0"
                />
              </View>
              <View style={styles.priceSeparator} />
              <View style={styles.priceInput}>
                <Text style={styles.priceLabel}>{t('filter.max')}</Text>
                <TextInput
                  style={styles.textInput}
                  value={maxPrice}
                  onChangeText={setMaxPrice}
                  keyboardType="numeric"
                  placeholder="∞"
                />
              </View>
            </View>
          </View>

          <View style={styles.filterSection}>
            <Text style={styles.sectionTitle}>{t('filter.brands')}</Text>
            {allBrands.map((brand) => (
              <TouchableOpacity
                key={brand}
                style={styles.checkboxItem}
                onPress={() => toggleBrand(brand)}
              >
                <View
                  style={[
                    styles.checkbox,
                    selectedBrands.includes(brand) && styles.checkboxSelected,
                  ]}
                >
                  {selectedBrands.includes(brand) && (
                    <IconSymbol name="checkmark" size={16} color="#fff" />
                  )}
                </View>
                <Text style={styles.checkboxLabel}>{brand}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.filterSection}>
            <Text style={styles.sectionTitle}>{t('filter.models')}</Text>
            {allModels.map((model) => (
              <TouchableOpacity
                key={model}
                style={styles.checkboxItem}
                onPress={() => toggleModel(model)}
              >
                <View
                  style={[
                    styles.checkbox,
                    selectedModels.includes(model) && styles.checkboxSelected,
                  ]}
                >
                  {selectedModels.includes(model) && (
                    <IconSymbol name="checkmark" size={16} color="#fff" />
                  )}
                </View>
                <Text style={styles.checkboxLabel}>{model}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.clearButton}
            onPress={handleClearFilters}
          >
            <Text style={styles.clearButtonText}>{t('filter.clear')}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.applyButton}
            onPress={handleApplyFilters}
          >
            <Text style={styles.applyButtonText}>{t('filter.apply')}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modal: {
    margin: 0,
    justifyContent: 'flex-end',
  },
  modalView: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  closeButton: {
    padding: 8,
  },
  scrollView: {
    maxHeight: '70%',
  },
  filterSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  priceInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  priceInput: {
    flex: 1,
  },
  priceLabel: {
    fontSize: 14,
    marginBottom: 4,
    color: '#666',
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 14,
  },
  priceSeparator: {
    width: 20,
  },
  checkboxItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#ddd',
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxSelected: {
    backgroundColor: Colors.common.primary,
    borderColor: Colors.common.primary,
  },
  checkboxLabel: {
    fontSize: 14,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  clearButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.common.primary,
    marginRight: 10,
    alignItems: 'center',
  },
  applyButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    backgroundColor: Colors.common.primary,
    alignItems: 'center',
  },
  clearButtonText: {
    color: Colors.common.primary,
    fontWeight: '600',
  },
  applyButtonText: {
    color: 'white',
    fontWeight: '600',
  },
});
