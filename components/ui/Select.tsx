import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  FlatList,
  StyleSheet,
  ViewStyle,
  TextStyle,
} from 'react-native';

export interface SelectOption {
  label: string;
  value: string | number;
  disabled?: boolean;
}

export interface SelectProps {
  label?: string;
  placeholder?: string;
  value?: string | number;
  data: SelectOption[];
  error?: string;
  disabled?: boolean;
  required?: boolean;
  searchable?: boolean;
  multiple?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  containerStyle?: ViewStyle;
  selectStyle?: ViewStyle;
  labelStyle?: TextStyle;
  errorStyle?: TextStyle;
  onSelect?: (value: string | number, option: SelectOption) => void;
  onOpen?: () => void;
  onClose?: () => void;
}

export const Select: React.FC<SelectProps> = ({
  label,
  placeholder = 'Select an option',
  value,
  data,
  error,
  disabled = false,
  required = false,
  searchable = false,
  multiple = false,
  leftIcon,
  rightIcon,
  containerStyle,
  selectStyle,
  labelStyle,
  errorStyle,
  onSelect,
  onOpen,
  onClose,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchText, setSearchText] = useState('');

  const selectedOption = data.find(option => option.value === value);

  const filteredData = searchable
    ? data.filter(option =>
        option.label.toLowerCase().includes(searchText.toLowerCase())
      )
    : data;

  const handleOpen = () => {
    if (!disabled) {
      setIsOpen(true);
      onOpen?.();
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    setSearchText('');
    onClose?.();
  };

  const handleSelect = (option: SelectOption) => {
    if (!option.disabled) {
      onSelect?.(option.value, option);
      if (!multiple) {
        handleClose();
      }
    }
  };

  const getDisplayText = () => {
    if (selectedOption) {
      return selectedOption.label;
    }
    return placeholder;
  };

  const getDisplayColor = () => {
    if (selectedOption) {
      return '#1F2937';
    }
    return '#9CA3AF';
  };

  return (
    <View style={[styles.container, containerStyle]}>
      {label && (
        <Text style={[styles.label, labelStyle]}>
          {label}
          {required && <Text style={styles.required}> *</Text>}
        </Text>
      )}
      
      <TouchableOpacity
        style={[
          styles.selectContainer,
          error && styles.selectContainerError,
          disabled && styles.selectContainerDisabled,
          selectStyle,
        ]}
        onPress={handleOpen}
        disabled={disabled}
        activeOpacity={0.8}
      >
        {leftIcon && <View style={styles.leftIcon}>{leftIcon}</View>}
        
        <Text
          style={[
            styles.selectText,
            { color: getDisplayColor() },
            leftIcon && styles.selectTextWithLeftIcon,
            rightIcon && styles.selectTextWithRightIcon,
          ]}
        >
          {getDisplayText()}
        </Text>
        
        {rightIcon ? (
          <View style={styles.rightIcon}>{rightIcon}</View>
        ) : (
          <Text style={styles.arrowIcon}>▼</Text>
        )}
      </TouchableOpacity>
      
      {error && (
        <Text style={[styles.errorText, errorStyle]}>{error}</Text>
      )}
      
      <Modal
        visible={isOpen}
        transparent={true}
        animationType="slide"
        onRequestClose={handleClose}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {label || 'Select Option'}
              </Text>
              <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
                <Text style={styles.closeButtonText}>✕</Text>
              </TouchableOpacity>
            </View>
            
            <FlatList
              data={filteredData}
              keyExtractor={(item) => item.value.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.optionItem,
                    item.value === value && styles.optionItemSelected,
                    item.disabled && styles.optionItemDisabled,
                  ]}
                  onPress={() => handleSelect(item)}
                  disabled={item.disabled}
                >
                  <Text
                    style={[
                      styles.optionText,
                      item.value === value && styles.optionTextSelected,
                      item.disabled && styles.optionTextDisabled,
                    ]}
                  >
                    {item.label}
                  </Text>
                  {item.value === value && (
                    <Text style={styles.checkmark}>✓</Text>
                  )}
                </TouchableOpacity>
              )}
              style={styles.optionsList}
              showsVerticalScrollIndicator={false}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 8,
  },
  required: {
    color: '#EF4444',
  },
  selectContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    minHeight: 48,
    paddingHorizontal: 16,
  },
  selectContainerError: {
    borderColor: '#EF4444',
    borderWidth: 2,
  },
  selectContainerDisabled: {
    backgroundColor: '#F9FAFB',
    borderColor: '#E5E7EB',
  },
  leftIcon: {
    marginRight: 8,
  },
  rightIcon: {
    marginLeft: 8,
  },
  selectText: {
    flex: 1,
    fontSize: 16,
  },
  selectTextWithLeftIcon: {
    marginLeft: 0,
  },
  selectTextWithRightIcon: {
    marginRight: 0,
  },
  arrowIcon: {
    fontSize: 12,
    color: '#6B7280',
    marginLeft: 8,
  },
  errorText: {
    fontSize: 14,
    color: '#EF4444',
    marginTop: 4,
    marginLeft: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '90%',
    maxHeight: '80%',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    overflow: 'hidden',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
  },
  closeButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 16,
    color: '#6B7280',
    fontWeight: 'bold',
  },
  optionsList: {
    maxHeight: 400,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  optionItemSelected: {
    backgroundColor: '#EFF6FF',
  },
  optionItemDisabled: {
    opacity: 0.5,
  },
  optionText: {
    fontSize: 16,
    color: '#1F2937',
    flex: 1,
  },
  optionTextSelected: {
    color: '#3B82F6',
    fontWeight: '500',
  },
  optionTextDisabled: {
    color: '#9CA3AF',
  },
  checkmark: {
    fontSize: 16,
    color: '#3B82F6',
    fontWeight: 'bold',
  },
});
