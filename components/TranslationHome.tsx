/**
 * @fileoverview The main content component displayed on the home screen after a user
 * has successfully selected all required source and target languages.
 * It combines the search interface with the display of lexeme details.
 */

import { StyleSheet, View } from 'react-native';
import { SearchBar } from './SearchBar';
import LexemeDetails from './LexemeDetails';

/**
 * @function TranslationHome
 * @description Renders the core functionality UI of the application, consisting of
 * a search bar for input and a details view for displaying results.
 *
 * @returns {JSX.Element} The rendered search and details interface.
 */
export default function TranslationHome() {
  return (
    <View style={styles.container}>
      <SearchBar />
      <LexemeDetails />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});