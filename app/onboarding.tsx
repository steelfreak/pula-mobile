/**
 * @fileoverview Screen component that displays the application's onboarding flow
 * using the `react-native-onboarding-swiper` library.
 * It guides new users through key features and marks the process as complete upon finishing or skipping.
 */

import React from 'react';
import { View, Text } from 'react-native';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Onboarding from 'react-native-onboarding-swiper';
import { colors, fontSizes, fontWeights } from '../lib/theme';

/**
 * @function OnboardingScreen
 * @description Renders the multi-page onboarding swiper. On completion or skip,
 * it sets a flag in AsyncStorage and navigates the user to the home screen.
 *
 * @returns {JSX.Element} The rendered `Onboarding` component.
 */
export default function OnboardingScreen() {
  /**
   * @description Handles the action when the user presses the 'Done' button on the last slide.
   * Marks onboarding as complete and redirects to the home screen.
   * @returns {Promise<void>}
   * @sideeffect Writes 'onboardingCompleted' flag to AsyncStorage and performs navigation using `router.replace`.
   */
  const handleDone = async () => {
    try {
      await AsyncStorage.setItem('onboardingCompleted', 'true');
      router.replace('/home');
    } catch (error) {
      console.error('Error saving onboarding status:', error);
      router.replace('/home');
    }
  };

  /**
   * @description Handles the action when the user presses the 'Skip' button.
   * Marks onboarding as complete and redirects to the home screen.
   * @returns {Promise<void>}
   * @sideeffect Writes 'onboardingCompleted' flag to AsyncStorage and performs navigation using `router.replace`.
   */
  const handleSkip = async () => {
    try {
      await AsyncStorage.setItem('onboardingCompleted', 'true');
      router.replace('/home');
    } catch (error) {
      console.error('Error saving onboarding status:', error);
      router.replace('/home');
    }
  };

  return (
    <Onboarding
      onDone={handleDone}
      onSkip={handleSkip}
      /**
       * @description Array defining the content, styling, and behavior for each page of the onboarding swiper.
       */
      pages={[
        {
          backgroundColor: colors.white,
          image: (
            <View style={{ 
              width: 200, 
              height: 200, 
              backgroundColor: colors.primary, 
              borderRadius: 100, 
              justifyContent: 'center', 
              alignItems: 'center' 
            }}>
              <Text style={{ fontSize: 80, color: colors.white }}>📱</Text>
            </View>
          ),
          title: 'Welcome to AGPB',
          subtitle: 'Easiest way to translate from one language to another',
          titleStyles: {
            color: colors.dark,
            fontSize: fontSizes.xxl * 1.3,
            fontWeight: fontWeights.bold as any,
          },
          subTitleStyles: {
            color: colors.primary,
            fontSize: fontSizes.lg * 1.5,
            fontWeight: fontWeights.normal as any,
          },
        },
        {
          backgroundColor: colors.light,
          image: (
            <View style={{ 
              width: 200, 
              height: 200, 
              backgroundColor: colors.primary, 
              borderRadius: 100, 
              justifyContent: 'center', 
              alignItems: 'center' 
            }}>
              <Text style={{ fontSize: 80, color: colors.white }}>📋</Text>
            </View>
          ),
          title: 'Multiple Languages',
          subtitle: 'Select your languages and search for a word!',
          titleStyles: {
            color: colors.dark,
            fontSize: fontSizes.xxl * 1.3,
            fontWeight: fontWeights.bold as any,
          },
          subTitleStyles: {
            color: colors.primary,
            fontSize: fontSizes.lg * 1.5,
            fontWeight: fontWeights.normal as any,
          },
        },
        {
          backgroundColor: colors.lightGray,
          image: (
            <View style={{ 
              width: 200, 
              height: 200, 
              backgroundColor: colors.primary, 
              borderRadius: 100, 
              justifyContent: 'center', 
              alignItems: 'center' 
            }}>
              <Text style={{ fontSize: 80, color: colors.white }}>⚡</Text>
            </View>
          ),
          title: 'Wikidata powered',
          subtitle: 'Uses Wikidata lexemes to provide the most accurate translations',
          titleStyles: {
            color: colors.dark,
            fontSize: fontSizes.xxl * 1.3,
            fontWeight: fontWeights.bold as any,
          },
          subTitleStyles: {
            color: colors.primary,
            fontSize: fontSizes.lg * 1.5,
            fontWeight: fontWeights.normal as any,
          },
        },
      ]}
      showSkip={true}
      showNext={true}
      showDone={true}
      skipLabel="Skip"
      nextLabel="Next"
      doneLabel="Get Started"
      bottomBarColor={colors.darkGray}
    />
  );
}
