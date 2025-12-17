/**
 * @fileoverview Component used within LexemeDetails to render the content for a single language tab
 * (Source, Target 1, or Target 2). It displays detailed information about a lexeme, including
 * its ID, category, image, translations/glosses, linking information to Wikidata, and an audio player.
 */

import React from 'react';
import { View, Text, StyleSheet, Image, Linking } from 'react-native';
import { colors, fontSizes, fontWeights } from 'lib/theme';
import { GlossWithSense, LexemeDetail } from 'types/api';
import { useAppStore } from 'stores/appStore';
import { AudioPlayer } from './AudioPlayer';

interface LexemeDetailResultProps {
  title?: string;
  tabKey: 'source' | 'target1' | 'target2';
  glossesWithSense?: GlossWithSense[];
  lexemeDetail?: LexemeDetail;
  //   onContribute?: (type: 'label' | 'audio') => void;
}

/**
 * @function TabContent
 * @description Displays the details of a lexeme or its translation/gloss in a single tab view.
 * Visibility is controlled by matching `tabKey` with the global `activeTab` state.
 *
 * @param {LexemeDetailResultProps} props The props object containing data and tab key.
 * @returns {JSX.Element | null} The styled tab content or null if the tab is not active.
 */
export const TabContent = ({
  title,
  tabKey,
  glossesWithSense,
  lexemeDetail,
  //   onContribute,
}: LexemeDetailResultProps) => {
  const { activeTab } = useAppStore();
  if (activeTab !== tabKey) return null;

  return (
    <View style={styles.tabContent}>
      {/* Main Image */}
      {lexemeDetail && lexemeDetail.id && (
        <View style={styles.imageContainer}>
          <Image
            source={{
              uri: lexemeDetail.image || 'https://agpb.toolforge.org/no-image.png',
            }}
            style={styles.mainImage}
            resizeMode="cover"
          />
        </View>
      )}

      {/* Lexeme Details */}
      <View style={styles.lexemeDetails}>
        {/* Top Row: ID and Category */}
        {lexemeDetail && lexemeDetail.id && (
          <View style={styles.topRow}>
            <Text style={styles.lexemeId}>{lexemeDetail.id}</Text>
            <View style={styles.categoryContainer}>
              <Text style={styles.categoryLabel}>Category:</Text>
              <Text
                style={styles.categoryValue}
                onPress={() =>
                  Linking.openURL(`https://www.wikidata.org/wiki/${lexemeDetail.lexicalCategoryId}`)
                }>
                {lexemeDetail.lexicalCategoryLabel}
              </Text>
            </View>
          </View>
        )}

        {glossesWithSense &&
          glossesWithSense.map((glossWithSense) => (
            <View key={glossWithSense.senseId}>
              <View style={styles.bottomSection}>
                {/* Middle Section: Links */}
                <View style={styles.linksSection}>
                  <Text
                    style={styles.linkText}
                    onPress={() =>
                      Linking.openURL(`https://www.wikidata.org/wiki/Lexeme:${lexemeDetail?.id}`)
                    }>
                    {lexemeDetail?.id} →
                  </Text>
                  <Text style={styles.subLinks}>({glossWithSense.gloss.formId})</Text>
                  <Text style={styles.subLinks}>{glossWithSense.senseId}</Text>
                </View>

                {/* Bottom Section: Word and Language */}
                <View style={styles.wordSection}>
                  <Text style={styles.wordText}>{glossWithSense.gloss.value ?? 'Label not available'}</Text>
                  <Text style={styles.languageCode}>{glossWithSense.gloss.language}</Text>
                </View>
              </View>

              {glossWithSense.gloss.audio ? (
                <View style={styles.audioContainer}>
                  <AudioPlayer audioUrl={glossWithSense.gloss.audio} />
                </View>
              ) : (
                <View>
                  <Text>No audio</Text>
                </View>
              )}
            </View>
          ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  tabContent: {
    backgroundColor: colors.white,
    paddingVertical: 10,
    paddingHorizontal: 10,
    // marginTop: 10,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderColor: colors.tertiary,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  mainImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
  },
  lexemeDetails: {
    backgroundColor: colors.light,
    borderRadius: 8,
    padding: 16,
    // borderWidth: 1,
    borderColor: colors.tertiary,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  lexemeId: {
    fontSize: fontSizes.xl,
    fontWeight: fontWeights.bold as any,
    color: colors.dark,
  },
  categoryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryLabel: {
    fontSize: fontSizes.md,
    color: colors.dark,
    marginRight: 4,
  },
  categoryValue: {
    fontSize: fontSizes.md,
    color: colors.primary,
    fontWeight: fontWeights.medium as any,
  },
  linksSection: {
    flex: 1,
    marginBottom: 12,
    borderRightWidth: 3,
    borderColor: colors.tertiary,
  },
  linkText: {
    fontSize: fontSizes.md,
    color: colors.primary,
    marginBottom: 4,
  },
  subLinks: {
    fontSize: fontSizes.sm,
    color: colors.dark,
    marginBottom: 2,
  },
  wordSection: {
    flex: 2,
    paddingLeft: 16,
    justifyContent: 'flex-end',
  },

  wordText: {
    fontSize: fontSizes.lg,
    fontWeight: fontWeights.bold as any,
    color: colors.dark,
    marginBottom: 4,
  },
  /**
   * @property languageCode
   * @description Style for the language code display.
   */
  languageCode: {
    fontSize: fontSizes.sm,
    color: colors.dark,
  },
  /**
   * @property bottomSection
   * @description Layout for the section containing links and the word/gloss.
   */
  bottomSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 16,
  },
  /**
   * @property audioContainer
   * @description Container for the AudioPlayer component.
   */
  audioContainer: {
    marginTop: 12,
    paddingHorizontal: 8,
  },
});
