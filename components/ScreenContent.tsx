/**
 * @fileoverview A reusable component for standardizing the content structure of
 * application screens, typically used for development or information pages in Expo/React Native projects.
 * It includes a title, a separator, and information about the current file path.
 */

import { Text, View } from 'react-native';

import { EditScreenInfo } from './EditScreenInfo';

/**
 * @interface ScreenContentProps
 * @description Props for the ScreenContent component.
 * @property {string} title The title to display at the top of the screen content.
 * @property {string} path The file path of the current screen/component, typically for debugging/quick access.
 * @property {React.ReactNode} [children] Optional child elements to render below the standard content.
 */
type ScreenContentProps = {
  title: string;
  path: string;
  children?: React.ReactNode;
};

/**
 * @function ScreenContent
 * @description Renders a standardized screen layout with a title, a horizontal separator,
 * an `EditScreenInfo` component, and optional children.
 *
 * @param {ScreenContentProps} props The props object containing the title, path, and children.
 * @returns {JSX.Element} The rendered screen content view.
 */
export const ScreenContent = ({ title, path, children }: ScreenContentProps) => {
  return (
    <View className={styles.container}>
      <Text className={styles.title}>{title}</Text>
      <View className={styles.separator} />
      <EditScreenInfo path={path} />
      {children}
    </View>
  );
};
const styles = {
  container: `items-center flex-1 justify-center`,
  separator: `h-[1px] my-7 w-4/5 bg-gray-200`,
  title: `text-xl font-bold`,
};
