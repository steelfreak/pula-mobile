// show the details of a lexeme

import { View, StyleSheet } from 'react-native';
import { colors } from 'lib/theme';
import { TabButton } from './TabButton';
import { TabContent } from './TabContent';

export default function LexemeDetails() {
  return (
    <View style={styles.container}>
      
      {/* 3 tab headers for source, target 1 and target 2 */}
      <View style={styles.tabButtonContainer}>
        <TabButton title="Source" tabKey="source" />
        <TabButton title="Target 1" tabKey="target1" />
        <TabButton title="Target 2" tabKey="target2" />
      </View>

      {/* Tab content for each tab */}
      <TabContent tabKey="source" title="Source" />
      <TabContent tabKey="target1" title="Target 1" />
      <TabContent tabKey="target2" title="Target 2" />
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
    backgroundColor: colors.lightGray,
  },
});
