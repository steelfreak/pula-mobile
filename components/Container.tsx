/**
 * @fileoverview A structural component that acts as the main container for most screens
 * in the application. It ensures content is rendered safely within device boundaries
 * (`SafeAreaView`), sets the status bar appearance, and organizes the header separate
 * from the main content area.
 */

import { SafeAreaView, StatusBar, View } from 'react-native';
import { colors } from 'lib/theme';
import React from 'react'; // Explicit import of React is good practice

/**
 * @interface ContainerProps
 * @description Props for the Container component.
 * @property {React.ReactNode} children The main content to be displayed below the header.
 * @property {React.ReactNode} header The header component to be displayed at the top.
 */
interface ContainerProps {
  children: React.ReactNode;
  header: React.ReactNode;
}

/**
 * @function Container
 * @description Renders a full-screen wrapper with integrated safe area handling,
 * status bar configuration, and dedicated slots for a header and main content.
 *
 * @param {ContainerProps} props The props object containing children and header elements.
 * @returns {JSX.Element} The rendered screen container.
 */
export const Container = ({ children, header }: ContainerProps) => {
  return (
    <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor={colors.darkGray} />
      <View style={styles.statusBar}>
      </View>
      {header}
      <View style={styles.content}>
        {children}
      </View>
    </SafeAreaView>
  );
};

/**
 * @constant styles
 * @description A JavaScript object defining component styles.
 * Note: These styles use a simplified, non-StyleSheet.create syntax common in some RN setups,
 * but are primarily standard RN style objects.
 */
const styles = {
  container: {
    // marginTop: 45,
    flex: 1,
    backgroundColor: colors.lightGray,
  },
  content: {
    margin: 16,
    flex: 1,
  },
  statusBar: {
    height: 45,
    backgroundColor: colors.darkGray,
  },
};
