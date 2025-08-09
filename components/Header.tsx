import { colors } from 'lib/theme';
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';

interface HeaderProps {
  title: string;
  onMenuPress?: () => void;
  onUserPress?: () => void;
  showMenu?: boolean;
  showUser?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  title,
  onMenuPress,
  onUserPress,
  showMenu = true,
  showUser = true,
}) => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        {/* Left - Hamburger Menu */}
        <View style={styles.leftSection}>
          {showMenu && (
            <TouchableOpacity style={styles.menuButton} onPress={onMenuPress} activeOpacity={0.7}>
              <View style={styles.hamburgerIcon}>
                <View style={styles.hamburgerLine} />
                <View style={styles.hamburgerLine} />
                <View style={styles.hamburgerLine} />
              </View>
            </TouchableOpacity>
          )}
        </View>

        {/* Middle - Title */}
        <View style={styles.centerSection}>
          <Text style={styles.title}>{title}</Text>
        </View>

        {/* Right - User Icon */}
        <View style={styles.rightSection}>
          {showUser && (
            <TouchableOpacity style={styles.userButton} onPress={onUserPress} activeOpacity={0.7}>
              <View style={styles.userIcon}>
                <Text style={styles.userIconText}>👤</Text>
              </View>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: colors.darkGray,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: colors.darkGray,
    // borderBottomWidth: 1,
    // borderBottomColor: colors.tertiary,
    // minHeight: 60,
  },
  leftSection: {
    flex: 1,
    alignItems: 'flex-start',
  },
  centerSection: {
    flex: 2,
    alignItems: 'center',
  },
  rightSection: {
    flex: 1,
    alignItems: 'flex-end',
  },
  menuButton: {
    padding: 8,
  },
  hamburgerIcon: {
    width: 24,
    height: 18,
    justifyContent: 'space-between',
  },
  hamburgerLine: {
    width: '100%',
    height: 2,
    backgroundColor: colors.dark,
    borderRadius: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.dark,
    textAlign: 'center',
  },
  userButton: {
    padding: 8,
  },
  userIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.light,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.light,
  },
  userIconText: {
    fontSize: 16,
  },
});
