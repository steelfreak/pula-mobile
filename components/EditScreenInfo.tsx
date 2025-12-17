/**
 * @fileoverview A helper component typically used in development environments (like Expo)
 * to display information about the current file path and instructions for rapid development.
 * It's designed to be used within the `ScreenContent` component.
 */

import { Text, View } from 'react-native';

/**
 * @interface EditScreenInfoProps
 * @description Props for the EditScreenInfo component.
 * @property {string} path The file path of the current screen/component.
 */
interface EditScreenInfoProps {
  path: string;
}

/**
 * @function EditScreenInfo
 * @description Displays a title, the component's file path (often styled as code),
 * and a description explaining the hot-reloading development workflow.
 *
 * @param {EditScreenInfoProps} props The props object containing the file path.
 * @returns {JSX.Element} The rendered information block.
 */
export const EditScreenInfo = ({ path }: EditScreenInfoProps) => {
  const title = 'Open up the code for this screen:';
  const description =
    'Change any of the text, save the file, and your app will automatically update.';

  return (
    <View>
      <View className={styles.getStartedContainer}>
        {/* Title/Instruction */}
        <Text className={styles.getStartedText}>{title}</Text>

        {/* File Path Display (Styled as a code block) */}
        <View className={styles.codeHighlightContainer + styles.homeScreenFilename}>
          <Text>{path}</Text>
        </View>

        {/* Description of the development process */}
        <Text className={styles.getStartedText}>{description}</Text>
      </View>
    </View>
  );
};

/**
 * @constant styles
 * @description A JavaScript object defining component styles using Tailwind CSS-like strings.
 */
const styles = {
  codeHighlightContainer: `rounded-md px-1`,
  getStartedContainer: `items-center mx-12`,
  getStartedText: `text-lg leading-6 text-center`,
  helpContainer: `items-center mx-5 mt-4`,
  helpLink: `py-4`,
  helpLinkText: `text-center`,
  homeScreenFilename: `my-2`,
};
