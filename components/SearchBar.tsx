// create a search bar with a text input on 80% left and a button on 20% right

import {
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Text,
  Image,
  ScrollView,
} from 'react-native';
import { colors, fontSizes, fontWeights } from 'lib/theme';
import { useLanguageStore } from 'stores/languageStore';

const options = [
  // {
  //   id: 1,
  //   label: 'Mother',
  //   brief: 'Mother, noun',
  // },
  // {
  //   id: 2,
  //   label: 'Father',
  //   brief: 'Father, noun',
  // },
  // {
  //   id: 3,
  //   label: 'Brother',
  //   brief: 'Brother, noun',
  // },
  // {
  //   id: 4,
  //   label: 'Sister',
  //   brief: 'Sister, noun',
  // },
  // {
  //   id: 5,
  //   label: 'Grandmother',
  //   brief: 'Grandmother, noun',
  // },
  // {
  //   id: 6,
  //   label: 'Grandfather',
  //   brief: 'Grandfather, noun',
  // },
  // {
  //   id: 7,
  //   label: 'Grandmother',
  //   brief: 'Grandmother, noun',
  // },
];

export const SearchBar = () => {
  const { setShowSelectLanguageModal } = useLanguageStore();

  return (
    <View style={styles.container}>
      <View style={styles.searchBarContainer}>
        <View style={styles.inputContainer}>
          <TextInput style={styles.input} placeholder="Search" />
        </View>

        <TouchableOpacity
          style={styles.buttonContainer}
          onPress={() => setShowSelectLanguageModal(true)}>
          <Image
            source={require('assets/control.png')}
            style={styles.buttonImage}
            tintColor={colors.primary}
          />
        </TouchableOpacity>
      </View>

      {/* Results */}
      {options.length > 0 && (
        <ScrollView style={styles.resultsContainer}>
          {options.map((option, index) => (
            <TouchableOpacity key={option.id} style={styles.resultItem} onPress={() => {}}>
              <Text style={styles.resultLabel}>{option.label}</Text>
              <Text style={styles.resultBrief}>{option.brief}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // flex: 1,
  },
  searchBarContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  inputContainer: {
    flex: 5,
    borderWidth: 1,
    borderColor: colors.tertiary,
    borderRadius: 5,
    padding: 9,
  },
  input: {
    fontSize: fontSizes.lg,
    color: colors.dark,
  },
  buttonContainer: {
    // flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.light,
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: 5,
    marginLeft: 10,
    paddingVertical: 12,
    paddingHorizontal: 15,
  },
  buttonText: {
    color: colors.danger,
    fontSize: fontSizes.lg,
  },
  buttonImage: {
    width: 40,
    height: 40,
  },

  resultsContainer: {
    // flex: 1,
    position: 'absolute',
    top: 75,
    left: 0,
    right: 0,
    maxHeight: 400,
    zIndex: 1000,
    backgroundColor: colors.lightGray,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: colors.tertiary,
  },
  resultItem: {
    padding: 10,
    // borderBottomWidth: 1,
    borderBottomColor: colors.tertiary,
  },
  resultLabel: {
    fontSize: fontSizes.lg,
    color: colors.dark,
    fontWeight: fontWeights.medium as any,
  },
  resultBrief: {
    fontSize: fontSizes.sm,
    color: colors.dark,
    fontWeight: fontWeights.normal as any,
  },
});
