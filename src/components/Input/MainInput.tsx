import React from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { IconSymbol } from '@/src/components/ui/IconSymbol';
import { Colors } from '@/src/constants/Colors';

interface MainInputProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  onClear?: () => void;
  onSubmit?: () => void;
}

export const MainInput: React.FC<MainInputProps> = ({
  value,
  onChangeText,
  placeholder = '',
  onClear,
  onSubmit,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.searchIcon}>
        <IconSymbol
          name="magnifyingglass"
          size={20}
          color={Colors.common.grey}
        />
      </View>
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={Colors.common.grey}
        returnKeyType="search"
        onSubmitEditing={onSubmit}
      />
      {value.length > 0 && (
        <TouchableOpacity style={styles.clearButton} onPress={onClear}>
          <IconSymbol
            name="xmark.circle.fill"
            size={20}
            color={Colors.common.grey}
          />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 40,
  },
  searchIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    height: '100%',
  },
  clearButton: {
    padding: 4,
  },
});
