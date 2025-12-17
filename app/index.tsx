/**
 * @fileoverview The initial entry point component (`Index`) for the application.
 * Its primary responsibility is to check the user's onboarding status in AsyncStorage
 * and redirect the user to either the onboarding screen or the main home screen.
 */

import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * @function Index
 * @description The root component that determines the user's initial navigation path.
 *
 * @returns {JSX.Element | null} Renders a loading spinner or `null` once navigation is initiated.
 */
export default function Index() {
  /**
   * @property {boolean} isLoading State to track whether the initial check is still running.
   */
  const [isLoading, setIsLoading] = useState(true);

  /**
   * @description Effect hook that runs once on mount to initiate the onboarding status check.
   */
  useEffect(() => {
    checkOnboardingStatus();
  }, []);

  /**
   * @async
   * @description Reads the 'onboardingCompleted' flag from AsyncStorage to decide
   * the appropriate initial screen for the user.
   * @returns {Promise<void>}
   * @sideeffect Reads from AsyncStorage, updates `isLoading` state, and performs navigation via `router.replace`.
   */
  const checkOnboardingStatus = async () => {
    try {
      const onboardingCompleted = await AsyncStorage.getItem('onboardingCompleted');
      
      if (onboardingCompleted === 'true') {
        // User has completed onboarding, go to home
        router.replace('/home');
      } else {
        // First time user, show onboarding
        router.replace('/onboarding');
      }
    } catch (error) {
      console.error('Error checking onboarding status:', error);
      // Default to onboarding on error
      router.replace('/onboarding');
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * @description Conditionally renders a large activity indicator (splash screen equivalent)
   * while the onboarding status check is in progress.
   */
  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' }}>
        <ActivityIndicator size="large" color="#698FB8" />
      </View>
    );
  }

  return null;
}
