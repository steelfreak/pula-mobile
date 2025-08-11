import React, { useEffect } from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { Select } from './ui/Select';
import { Button } from './ui/Button';
import { useLanguageStore } from 'stores/languageStore';
import { colors } from 'lib/theme';
import { useApiWithStore } from "hooks/useApiWithStore";

interface SelectLanguagesProps {
  onClose?: () => void;
  onConfirm?: () => void;
}

const { width, height } = Dimensions.get('window');

export const SelectLanguages: React.FC<SelectLanguagesProps> = ({ onClose, onConfirm }) => {
  const { showSelectLanguageModal, setShowSelectLanguageModal } = useLanguageStore();
  const { getLanguages } = useApiWithStore();
  const handleClose = () => {
    setShowSelectLanguageModal(false);
    onClose?.();
  };

  const handleConfirm = () => {
    setShowSelectLanguageModal(false);
    onConfirm?.();
  };

  useEffect(() => {
    getLanguages();
  }, []);

  return (
    <Modal
      visible={showSelectLanguageModal}
      transparent={true}
      animationType="slide"
      onRequestClose={handleClose}>
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <View style={styles.header}>
            <Text style={styles.title}>Select Languages</Text>
            <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.content}>
            <Select
              label="Source Language"
              placeholder="Select a language"
              data={[
                {
                  label: 'English',
                  value: 'en',
                },
                {
                  label: 'Spanish',
                  value: 'es',
                },
              ]}
              onSelect={() => {}}
            />

            <Select
              label="Target Language 1"
              placeholder="Select a language"
              data={[
                {
                  label: 'Spanish',
                  value: 'es',
                },
                {
                  label: 'French',
                  value: 'fr',
                },
              ]}
              onSelect={() => {}}
            />

            <Select
              label="Target Language 2"
              placeholder="Select a language"
              data={[
                {
                  label: 'French',
                  value: 'fr',
                },
              ]}
              onSelect={() => {}}
            />
          </View>

          <View style={styles.footer}>
            {/* <Button title="Cancel" onPress={onClose} type="secondary" /> */}
            <Button
              title="Save and continue"
              onPress={handleConfirm}
              type="primary"
              outline
              fullWidth
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: width * 0.9,
    maxHeight: height * 0.8,
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 0,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.lightGray,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  closeButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#f3f4f6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 16,
    color: '#6b7280',
    fontWeight: 'bold',
  },
  content: {
    padding: 20,
  },
  description: {
    fontSize: 16,
    color: '#374151',
    marginBottom: 20,
    lineHeight: 24,
  },
  languageSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 10,
  },
  languageText: {
    fontSize: 16,
    color: '#6b7280',
    marginBottom: 8,
    paddingLeft: 10,
  },
  note: {
    fontSize: 14,
    color: '#9ca3af',
    fontStyle: 'italic',
    marginTop: 20,
    lineHeight: 20,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    backgroundColor: '#f3f4f6',
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6b7280',
  },
  confirmButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    backgroundColor: '#3b82f6',
    alignItems: 'center',
  },
  confirmButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
});
