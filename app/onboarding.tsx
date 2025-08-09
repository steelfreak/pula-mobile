import React from 'react';
import { View, Text } from 'react-native';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Onboarding from 'react-native-onboarding-swiper';

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
          backgroundColor: '#698FB8',
          image: (
            <View style={{ 
              width: 200, 
              height: 200, 
              backgroundColor: 'rgba(255,255,255,0.1)', 
              borderRadius: 100, 
              justifyContent: 'center', 
              alignItems: 'center' 
            }}>
              <Text style={{ fontSize: 80 }}>📱</Text>
            </View>
          ),
          title: 'Welcome to AGPB',
          subtitle: 'Your personal assistant for productivity and organization',
        },
        {
          backgroundColor: '#6CB2B8',
          image: (
            <View style={{ 
              width: 200, 
              height: 200, 
              backgroundColor: 'rgba(255,255,255,0.1)', 
              borderRadius: 100, 
              justifyContent: 'center', 
              alignItems: 'center' 
            }}>
              <Text style={{ fontSize: 80 }}>📋</Text>
            </View>
          ),
          title: 'Stay Organized',
          subtitle: 'Keep track of your tasks, goals, and important information',
        },
        {
          backgroundColor: '#9D8FBF',
          image: (
            <View style={{ 
              width: 200, 
              height: 200, 
              backgroundColor: 'rgba(255,255,255,0.1)', 
              borderRadius: 100, 
              justifyContent: 'center', 
              alignItems: 'center' 
            }}>
              <Text style={{ fontSize: 80 }}>⚡</Text>
            </View>
          ),
          title: 'Boost Productivity',
          subtitle: 'Get more done with smart features and intuitive design',
        },
      ]}
      showSkip={true}
      showNext={true}
      showDone={true}
      skipLabel="Skip"
      nextLabel="Next"
      doneLabel="Get Started"
    />
  );
}
