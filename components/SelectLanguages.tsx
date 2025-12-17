/**
 * @fileoverview A modal component that allows the user to select the source and two target languages
 * for translation. It fetches the list of available languages on mount and updates the global
 * language store upon selection.
 */

import React, { useEffect } from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { Select } from './ui/Select';
import { Button } from './ui/Button';
import { useLanguageStore } from 'stores/languageStore';
import { colors } from 'lib/theme';
import { useApiWithStore } from 'hooks/useApiWithStore';

/**
 * @interface SelectLanguagesProps
 * @description Props for the SelectLanguages component.
 * @property {function} [onClose] Optional callback function executed when the modal is closed without confirmation.
 * @property {function} [onConfirm] Optional callback function executed when the 'Save and continue' button is pressed.
 */
interface SelectLanguagesProps {
  onClose?: () => void;
  onConfirm?: () => void;
}

const { width, height } = Dimensions.get('window');

/**
 * @function SelectLanguages
 * @description Renders a full-screen modal allowing the user to set the primary source and two
 * secondary target languages for the application's translation context.
 *
 * @param {SelectLanguagesProps} props The props object containing optional close and confirm handlers.
 * @returns {React.FC<SelectLanguagesProps>} The rendered language selection modal component.
 */
export const SelectLanguages: React.FC<SelectLanguagesProps> = ({ onClose, onConfirm }) => {
  // Global state and actions for modal visibility from LanguageStore
  const { showSelectLanguageModal, setShowSelectLanguageModal } = useLanguageStore();

  // API calls, selected languages, and setters from the combined API/Store hook
  const {
    getLanguages,
    languages,
    setSelectedSourceLanguage,
    setSelectedTargetLanguage1,
    setSelectedTargetLanguage2,
    selectedSourceLanguage,
    selectedTargetLanguage1,
    selectedTargetLanguage2,
  } = useApiWithStore();

  /**
   * @description Closes the modal and executes the optional `onClose` callback.
   * @returns {void}
   * @sideeffect Updates `showSelectLanguageModal` to false.
   */
  const handleClose = () => {
    setShowSelectLanguageModal(false);
    onClose?.();
  };

  /**
   * @description Closes the modal and executes the optional `onConfirm` callback.
   * Note: Language selections are saved immediately upon change, so this primarily closes the modal.
   * @returns {void}
   * @sideeffect Updates `showSelectLanguageModal` to false.
   */
  const handleConfirm = () => {
    setShowSelectLanguageModal(false);
    onConfirm?.();
  };

  /**
   * @description Effect to fetch the list of languages from the API when the component mounts.
   * @returns {void}
   * @sideeffect Calls `getLanguages` to populate the `languages` array in the store.
   */
  useEffect(() => {
    getLanguages();
  }, []);

  /**
   * Language looks like
   * {
   *   lang_code: "aa",
   *   lang_label: "Afar",
   *   lang_wd_id: "Q36279"
   * }
   */

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
              value={selectedSourceLanguage?.lang_code}
              placeholder="Select a language"
              data={languages.map((language) => ({
                label: language.lang_label,
                value: language.lang_code,
              }))}
              onSelect={(value, option) => {
                const lang = languages.find((language) => language.lang_code === value);
                if (lang) {
                  setSelectedSourceLanguage(lang);
                }
              }}
            />

            <Select
              label="Target Language 1"
              value={selectedTargetLanguage1?.lang_code}
              placeholder="Select a language"
              data={languages.map((language) => ({
                label: language.lang_label,
                value: language.lang_code,
              }))}
              onSelect={(value, option) => {
                const lang = languages.find((language) => language.lang_code === value);
                if (lang) {
                  setSelectedTargetLanguage1(lang);
                }
              }}
            />

            <Select
              label="Target Language 2"
              value={selectedTargetLanguage2?.lang_code}
              placeholder="Select a language"
              data={languages.map((language) => ({
                label: language.lang_label,
                value: language.lang_code,
              }))}
              onSelect={(value, option) => {
                const lang = languages.find((language) => language.lang_code === value);
                if (lang) {
                  setSelectedTargetLanguage2(lang);
                }
              }}
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
