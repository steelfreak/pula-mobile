// show the details of a lexeme

import { View, Text, StyleSheet, Image } from 'react-native';
import { colors, fontSizes, fontWeights } from 'lib/theme';
import { GlossWithSense, LexemeDetail } from 'types/api';
import { useAppStore } from 'stores/appStore';

interface LexemeDetailResultProps {
  title?: string;
  tabKey: 'source' | 'target1' | 'target2';
  //   glossesWithSense?: GlossWithSense[];
  //   lexemeDetail?: LexemeDetail;
  //   onContribute?: (type: 'label' | 'audio') => void;
}

export const TabContent = ({
  title,
  tabKey,
  //   glossesWithSense,
  //   lexemeDetail,
  //   onContribute,
}: LexemeDetailResultProps) => {
  const { activeTab } = useAppStore();
  if (activeTab !== tabKey) return null;

  return (
    <View style={styles.tabContent}>
      {/* Main Image */}
      <View style={styles.imageContainer}>
        <Image
          source={{
            uri: 'https://upload.wikimedia.org/wikipedia/commons/2/2c/Adolphe_Jourdan_A_Mother%27s_Embrace.jpg',
          }}
          style={styles.mainImage}
          resizeMode="cover"
        />
      </View>

      {/* Lexeme Details */}
      <View style={styles.lexemeDetails}>
        {/* Top Row: ID and Category */}
        <View style={styles.topRow}>
          <Text style={styles.lexemeId}>L29233</Text>
          <View style={styles.categoryContainer}>
            <Text style={styles.categoryLabel}>Category:</Text>
            <Text style={styles.categoryValue}>noun</Text>
          </View>
        </View>

        <View style={styles.bottomSection}>
          {/* Middle Section: Links */}
          <View style={styles.linksSection}>
            <Text style={styles.linkText}>L29233 →</Text>
            <Text style={styles.subLinks}>(L29233-F1)</Text>
            <Text style={styles.subLinks}>(L29233-S1)</Text>
          </View>

          {/* Bottom Section: Word and Language */}
          <View style={styles.wordSection}>
            <Text style={styles.wordText}>Mother</Text>
            <Text style={styles.languageCode}>en</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  tabContent: {
    backgroundColor: colors.white,
    padding: 5,
    marginTop: 10,
    borderWidth: 1,
    borderColor: colors.tertiary,
    borderRadius: 8,
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
  languageCode: {
    fontSize: fontSizes.sm,
    color: colors.dark,
  },
  bottomSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 16,
  },
});
