// show the details of a lexeme

import { Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors, fontSizes } from 'lib/theme';
import { useAppStore } from 'stores/appStore';

export const TabButton = ({
  title,
  tabKey,
  disabled,
}: {
  title: string;
  tabKey: 'source' | 'target1' | 'target2';
  disabled: boolean;
}) => {
  const { activeTab, setActiveTab } = useAppStore();

  const onHandlePress = () => {
    setActiveTab(tabKey);
  };

  return (
    <TouchableOpacity
      style={[styles.tabButton, activeTab === tabKey && styles.activeTabButton]}
      onPress={onHandlePress}
      disabled={disabled}>
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
    borderTopWidth: 1,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: 'transparent',
    // borderRadius: 5,
    padding: 15,
    paddingHorizontal: 20,
    backgroundColor: colors.white,
  },
  activeTabButton: {
    // backgroundColor: colors.primary,
    color: colors.light,
    borderTopWidth: 1,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderTopRightRadius: 5,
    borderTopLeftRadius: 5,
    borderColor: colors.tertiary,
  },
  tabButtonText: {
    fontSize: fontSizes.lg,
    // fontWeight: 'bold',
    
  },
  activeTabButtonText: {
    // color: colors.light,
    // fontWeight: 'bold',
    color: colors.primary,
  },
});
