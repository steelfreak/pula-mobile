import React from 'react';
import { Container } from '../components/Container';
import { Header } from '../components/Header';
import { showToast } from '../lib/toast';
import DefaultHome from '../components/DefaultHome';
import TranslationHome from '../components/TranslationHome';
import { SelectLanguages } from 'components/SelectLanguages';

export default function HomeScreen() {
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
            title="AGPB"
            showMenu={true}
            showUser={true}
            onMenuPress={handleMenuPress}
            onUserPress={handleUserPress}
          />
        }>
          <DefaultHome />
        {/* <TranslationHome /> */}
        <SelectLanguages />
      </Container>
    </>
  );
}
