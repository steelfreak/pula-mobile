import React from 'react';
import { Container } from '../components/Container';
import { Header } from '../components/Header';
import { showToast } from '../lib/toast';
import DefaultHome from '../components/DefaultHome';
import TranslationHome from '../components/TranslationHome';
import { SelectLanguages } from 'components/SelectLanguages';
import { useApiWithStore } from 'hooks/useApiWithStore';

export default function HomeScreen() {
  const { selectedSourceLanguage, selectedTargetLanguage1, selectedTargetLanguage2 } =
    useApiWithStore();
  const handleMenuPress = () => {
    showToast.info('Menu', 'Hamburger menu pressed');
  };

  const handleUserPress = () => {
    showToast.info('User', 'User icon pressed');
  };

  return (
    <>
      <Container
        header={
          <Header
            title="PULA | (People's Universal Lexical Access)"
            showMenu={false}
            showUser={false}
            onMenuPress={handleMenuPress}
            onUserPress={handleUserPress}
          />
        }>
        {selectedSourceLanguage && selectedTargetLanguage1 && selectedTargetLanguage2 ? (
          <TranslationHome />
        ) : (
          <DefaultHome />
        )}
        <SelectLanguages />
      </Container>
    </>
  );
}
