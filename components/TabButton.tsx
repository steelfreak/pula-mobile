// show the details of a lexeme

import { Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors, fontSizes } from 'lib/theme';
import { useAppStore } from 'stores/appStore';

export const TabButton = ({
  title,
  tabKey,
}: {
  title: string;
  tabKey: 'source' | 'target1' | 'target2';
}) => {
  const { activeTab, setActiveTab } = useAppStore();

  const onHandlePress = () => {
    setActiveTab(tabKey);
  };

  return (
    <TouchableOpacity
      style={[styles.tabButton, activeTab === tabKey && styles.activeTabButton]}
      onPress={onHandlePress}>
      <Text style={[styles.tabButtonText, activeTab === tabKey && styles.activeTabButtonText]}>
        {title}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  tabButtonContainer: {
    flexDirection: 'row',
    // justifyContent: 'space-between',
    backgroundColor: colors.lightGray,
  },
  tabButton: {
    borderRadius: 5,
    padding: 15,
    paddingHorizontal: 20,
    backgroundColor: colors.lightGray,
  },
  activeTabButton: {
    backgroundColor: colors.primary,
    color: colors.light,
  },
  tabButtonText: {
    fontSize: fontSizes.lg,
    fontWeight: 'bold',
    
  },
  activeTabButtonText: {
    color: colors.light,
  },
});
