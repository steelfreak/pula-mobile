/**
 * @fileoverview The primary screen component for the application (Home Screen).
 * It determines whether to display the language selection interface (`DefaultHome`)
 * or the main application content (`TranslationHome`) based on user-selected languages.
 */

import React from 'react';
import { Container } from '../components/Container';
import { Header } from '../components/Header';
import { showToast } from '../lib/toast';
import DefaultHome from '../components/DefaultHome';
import TranslationHome from '../components/TranslationHome';
import { SelectLanguages } from 'components/SelectLanguages';
import { useApiWithStore } from 'hooks/useApiWithStore';

/**
 * @function HomeScreen
 * @description The main entry point component for the application's home view.
 * It uses state from the global store (via `useApiWithStore`) to conditionally render
 * the language selection UI or the main translation interface.
 *
 * @returns {JSX.Element} The rendered home screen UI, wrapped in a `Container` and `Header`.
 */
export default function HomeScreen() {
  // Retrieve selected languages from the global store.
  const { selectedSourceLanguage, selectedTargetLanguage1, selectedTargetLanguage2 } =
    useApiWithStore();

  /**
   * @description Handler for the Header's menu icon press. Currently shows an info toast.
   * @returns {void}
   * @sideeffect Displays a transient UI notification (toast).
   */
  const handleMenuPress = () => {
    showToast.info('Menu', 'Hamburger menu pressed');
  };

  /**
   * @description Handler for the Header's user icon press. Currently shows an info toast.
   * @returns {void}
   * @sideeffect Displays a transient UI notification (toast).
   */
  const handleUserPress = () => {
    showToast.info('User', 'User icon pressed');
  };

  return (
    <>
      <Container
        header={
          <Header
            title="African German Phrasebook"
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
