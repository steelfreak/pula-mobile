/**
 * @fileoverview A reusable component for rendering a clickable tab button within a tab navigation structure.
 * It integrates with the global application store (`useAppStore`) to manage the currently active tab.
 */

import { Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors, fontSizes } from 'lib/theme';
import { useAppStore } from 'stores/appStore';

interface TabButtonProps {
  title: string;
  tabKey: 'source' | 'target1' | 'target2';
  disabled: boolean;
}

/**
 * @function TabButton
 * @description A button component for navigating between different language tabs in the LexemeDetails view.
 * It updates the global `activeTab` state when pressed.
 *
 * @param {TabButtonProps} props The props object containing title, key, and disabled status.
 * @returns {JSX.Element} The rendered tab button.
 */
export const TabButton = ({ title, tabKey, disabled }: TabButtonProps) => {
  // Retrieve current active tab and the setter function from the global store
  const { activeTab, setActiveTab } = useAppStore();

  /**
   * @description Handles the press event, setting the current tab as active in the global store.
   * @returns {void}
   * @sideeffect Updates the `activeTab` state in `useAppStore`.
   */
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
