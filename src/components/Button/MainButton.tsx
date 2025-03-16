import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  StyleProp,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { Colors } from '@/src/constants/Colors';
import { IconSymbol, IconSymbolName } from '../ui/IconSymbol';

interface MainButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'success' | 'secondary' | 'danger';
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  fullWidth?: boolean;
  name?: IconSymbolName;
}

export const MainButton: React.FC<MainButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  disabled = false,
  style,
  textStyle,
  fullWidth = true,
  name,
}) => {
  const getButtonStyle = () => {
    switch (variant) {
      case 'success':
        return styles.successButton;
      case 'secondary':
        return styles.secondaryButton;
      case 'danger':
        return styles.dangerButton;
      case 'primary':
      default:
        return styles.primaryButton;
    }
  };

  return (
    <TouchableOpacity
      style={[
        styles.button,
        getButtonStyle(),
        fullWidth && styles.fullWidth,
        disabled && styles.disabledButton,
        style,
      ]}
      onPress={onPress}
      disabled={disabled}
    >
      {name && (
        <IconSymbol style={styles.icon} size={18} name={name} color="white" />
      )}
      <Text style={[styles.buttonText, textStyle]}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 4,
    alignItems: 'center',
    marginTop: 8,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  fullWidth: {
    width: '100%',
  },
  icon: {
    marginRight: 8,
  },
  primaryButton: {
    backgroundColor: Colors.common.primary,
  },
  secondaryButton: {
    backgroundColor: Colors.common.grey,
  },
  successButton: {
    backgroundColor: Colors.common.green,
  },
  dangerButton: {
    backgroundColor: Colors.common.red,
  },
  disabledButton: {
    opacity: 0.7,
  },
  buttonText: {
    color: 'white',
    fontWeight: '600',
  },
});
