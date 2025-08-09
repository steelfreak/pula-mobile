import { StyleSheet, View } from 'react-native';
import { SearchBar } from './SearchBar';
import LexemeDetails from './LexemeDetails';

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
