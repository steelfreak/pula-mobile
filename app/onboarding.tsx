import React from 'react';
import { View, Text } from 'react-native';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Onboarding from 'react-native-onboarding-swiper';
import { colors, fontSizes, fontWeights } from '../lib/theme';

export default function OnboardingScreen() {
  const handleDone = async () => {
    try {
      await AsyncStorage.setItem('onboardingCompleted', 'true');
      router.replace('/home');
    } catch (error) {
      console.error('Error saving onboarding status:', error);
      router.replace('/home');
    }
  };

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
          title: 'Welcome to PULA',
          subtitle: 'A tool for learning and enriching lexicographical data in multiple languages on Wikidata',
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
