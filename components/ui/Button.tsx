import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
  ActivityIndicator,
} from 'react-native';
import { colors, fontSizes, fontWeights } from '../../lib/theme';

export type ButtonType = 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info';

export interface ButtonProps {
  title: string;
  onPress: () => void;
  type?: ButtonType;
  outline?: boolean;
  disabled?: boolean;
  loading?: boolean;
  size?: 'small' | 'medium' | 'large';
  fullWidth?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  type = 'primary',
  outline = false,
  disabled = false,
  loading = false,
  size = 'medium',
  fullWidth = false,
  style,
  textStyle,
  leftIcon,
  rightIcon,
}) => {
  const buttonStyle = [
    styles.button,
    styles[size],
    outline ? styles[`${type}Outline`] : styles[type],
    disabled && styles.disabled,
    fullWidth && styles.fullWidth,
    style,
  ];

  const textStyleArray = [
    styles.text,
    styles[`${size}Text`],
    outline ? styles[`${type}OutlineText`] : styles[`${type}Text`],
    disabled && styles.disabledText,
    textStyle,
  ];

  return (
    <TouchableOpacity
      style={buttonStyle}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={outline ? getOutlineTextColor(type) : getTextColor(type)}
        />
      ) : (
        <>
          {leftIcon && <>{leftIcon}</>}
          <Text style={textStyleArray}>{title}</Text>
          {rightIcon && <>{rightIcon}</>}
        </>
      )}
    </TouchableOpacity>
  );
};

const getTextColor = (type: ButtonType): string => {
  switch (type) {
    case 'primary':
    case 'secondary':
    case 'success':
    case 'danger':
    case 'warning':
    case 'info':
      return colors.light;
    default:
      return colors.light;
  }
};

const getOutlineTextColor = (type: ButtonType): string => {
  switch (type) {
    case 'primary':
      return colors.primary;
    case 'secondary':
      return colors.secondary;
    case 'success':
      return colors.success;
    case 'danger':
      return colors.danger;
    case 'warning':
      return colors.warning;
    case 'info':
      return colors.info;
    default:
      return colors.primary;
  }
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  // Size variants
  small: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    minHeight: 36,
  },
  medium: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    minHeight: 44,
  },
  large: {
    paddingVertical: 16,
    paddingHorizontal: 32,
    minHeight: 52,
  },
  // Type variants (filled)
  primary: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  secondary: {
    backgroundColor: colors.secondary,
    borderColor: colors.secondary,
  },
  success: {
    backgroundColor: colors.success,
    borderColor: colors.success,
  },
  danger: {
    backgroundColor: colors.danger,
    borderColor: colors.danger,
  },
  warning: {
    backgroundColor: colors.warning,
    borderColor: colors.warning,
  },
  info: {
    backgroundColor: colors.info,
    borderColor: colors.info,
  },
  // Outline variants
  primaryOutline: {
    backgroundColor: 'transparent',
    borderColor: colors.primary,
  },
  secondaryOutline: {
    backgroundColor: 'transparent',
    borderColor: colors.secondary,
  },
  successOutline: {
    backgroundColor: 'transparent',
    borderColor: colors.success,
  },
  dangerOutline: {
    backgroundColor: 'transparent',
    borderColor: colors.danger,
  },
  warningOutline: {
    backgroundColor: 'transparent',
    borderColor: colors.warning,
  },
  infoOutline: {
    backgroundColor: 'transparent',
    borderColor: colors.info,
  },
  // Text styles
  text: {
    fontWeight: fontWeights.bold,
    textAlign: 'center',
  },
  smallText: {
    fontSize: fontSizes.sm,
  },
  mediumText: {
    fontSize: fontSizes.md,
  },
  largeText: {
    fontSize: fontSizes.lg,
  },
  // Text colors for filled buttons
  primaryText: {
    color: colors.light,
  },
  secondaryText: {
    color: colors.light,
  },
  successText: {
    color: colors.light,
  },
  dangerText: {
    color: colors.light,
  },
  warningText: {
    color: colors.light,
  },
  infoText: {
    color: colors.light,
  },
  // Text colors for outline buttons
  primaryOutlineText: {
    color: colors.primary,
  },
  secondaryOutlineText: {
    color: colors.secondary,
  },
  successOutlineText: {
    color: colors.success,
  },
  dangerOutlineText: {
    color: colors.danger,
  },
  warningOutlineText: {
    color: colors.warning,
  },
  infoOutlineText: {
    color: colors.info,
  },
  // States
  disabled: {
    opacity: 0.6,
  },
  disabledText: {
    opacity: 0.8,
  },
  fullWidth: {
    width: '100%',
  },
});
