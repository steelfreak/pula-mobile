import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SelectLanguages } from '../components/SelectLanguages';
import { colors, fontSizes } from '../lib/theme';
import { Button } from '../components/ui/Button';
import { useLanguageStore } from '../stores/languageStore';

export default function DefaultHome() {
  const { showSelectLanguageModal, setShowSelectLanguageModal } = useLanguageStore();
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Welcome to PULA</Text>
        <Text style={styles.subtitle}>
          The easiest way to translate from one language to another
        </Text>
        <View style={styles.separator} />
        <Text style={styles.description}>Select your languages and search for a word!</Text>

        <View style={styles.buttonContainer}>
          <Button
            title="Select and set languages"
            onPress={() => setShowSelectLanguageModal(true)}
            type="primary"
          />
        </View>
      </View>

      <SelectLanguages
        visible={showSelectLanguageModal}
        onClose={() => setShowSelectLanguageModal(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: fontSizes.xxl,
    fontWeight: 'bold' as const,
    color: colors.dark,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: fontSizes.lg,
    color: colors.secondary,
    marginBottom: 30,
    textAlign: 'center',
  },
  separator: {
    height: 1,
    width: '80%',
    backgroundColor: colors.tertiary,
    marginVertical: 20,
  },
  description: {
    fontSize: fontSizes.md,
    color: colors.secondary,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 40,
  },
  buttonContainer: {
    width: '100%',
    gap: 12,
  },
});
