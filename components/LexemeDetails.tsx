// show the details of a lexeme

import { View, StyleSheet } from 'react-native';
import { colors } from 'lib/theme';
import { TabButton } from './TabButton';
import { TabContent } from './TabContent';
import { useCallback, useEffect, useState } from 'react';
import { useApiWithStore } from 'hooks/useApiWithStore';
import { showToast } from 'lib/toast';
import { GlossWithSense } from 'types/api';
export default function LexemeDetails() {
  const {
    clickedLexeme,
    selectedSourceLanguage,
    selectedTargetLanguage1,
    selectedTargetLanguage2,
    getLexemeDetails,
    selectedLexeme,
  } = useApiWithStore();
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);
  const [sourceLexemeDetails, setSourceLexemeDetails] = useState<GlossWithSense[]>([]);
  const [target1LexemeDetails, setTarget1LexemeDetails] = useState<GlossWithSense[]>([]);
  const [target2LexemeDetails, setTarget2LexemeDetails] = useState<GlossWithSense[]>([]);
  const [singleLexemeObj, setSingleLexemeObj] = useState<any>(null);

  useEffect(() => {
    if (clickedLexeme && clickedLexeme.id) {
      handleGetLexemeDetails();
    }
  }, [clickedLexeme]);

  useEffect(() => {
    if (!selectedLexeme || !selectedLexeme.lexeme || !selectedLexeme.glosses) {
      return;
    }

    setSingleLexemeObj(selectedLexeme.lexeme);
    setSourceLexemeDetails(
      selectedLexeme.glosses.filter(
        (gloss: GlossWithSense) => gloss.gloss.language === selectedSourceLanguage?.lang_code
      )
    );
    setTarget1LexemeDetails(
      selectedLexeme.glosses.filter(
        (gloss: GlossWithSense) => gloss.gloss.language === selectedTargetLanguage1?.lang_code
      )
    );
    setTarget2LexemeDetails(
      selectedLexeme.glosses.filter(
        (gloss: GlossWithSense) => gloss.gloss.language === selectedTargetLanguage2?.lang_code
      )
    );
  }, [selectedLexeme]);

  const handleGetLexemeDetails = useCallback(async () => {
    if (!selectedSourceLanguage || (!selectedTargetLanguage1 && !selectedTargetLanguage2)) {
      showToast.error(
        'Languages required',
        'Please select source and target languages to get details.'
      );
      return;
    }

    setIsLoadingDetails(true);
    try {
      await getLexemeDetails();
    } catch (error) {
      console.error('Failed to get lexeme details:', error);
    } finally {
      setIsLoadingDetails(false);
    }
  }, [
    selectedSourceLanguage?.lang_code,
    selectedTargetLanguage1?.lang_code,
    selectedTargetLanguage2?.lang_code,
    getLexemeDetails,
  ]);

  return (
    <View style={styles.container}>
      {/* 3 tab headers for source, target 1 and target 2 */}
      <View style={styles.tabButtonContainer}>
        <TabButton
          title={selectedSourceLanguage?.lang_label || 'Source'}
          tabKey="source"
          disabled={isLoadingDetails}
        />
        <TabButton
          title={selectedTargetLanguage1?.lang_label || 'Target 1'}
          tabKey="target1"
          disabled={isLoadingDetails}
        />
        <TabButton
          title={selectedTargetLanguage2?.lang_label || 'Target 2'}
          tabKey="target2"
          disabled={isLoadingDetails}
        />
      </View>

      {/* Tab content for each tab */}
      <TabContent
        tabKey="source"
        title={selectedSourceLanguage?.lang_label || 'Source'}
        glossesWithSense={sourceLexemeDetails}
        lexemeDetail={singleLexemeObj}
      />
      <TabContent
        tabKey="target1"
        title={selectedTargetLanguage1?.lang_label || 'Target 1'}
        glossesWithSense={target1LexemeDetails}
        lexemeDetail={singleLexemeObj}
      />
      <TabContent
        tabKey="target2"
        title={selectedTargetLanguage2?.lang_label || 'Target 2'}
        glossesWithSense={target2LexemeDetails}
        lexemeDetail={singleLexemeObj}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 10,
    backgroundColor: colors.lightGray,
  },
  tabButtonContainer: {
    flexDirection: 'row',
    // justifyContent: 'space-between',
    backgroundColor: colors.transparent,
    borderBottomWidth: 1,
    borderBottomColor: colors.tertiary,
  },
});
