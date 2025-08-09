declare module 'react-native-onboarding-swiper' {
  import { ComponentType } from 'react';
  import { ViewStyle, TextStyle } from 'react-native';

  interface OnboardingPage {
    backgroundColor: string;
    image: React.ReactNode;
    title: string | React.ReactNode;
    subtitle: string | React.ReactNode;
    titleStyles?: TextStyle;
    subTitleStyles?: TextStyle;
  }

  interface OnboardingProps {
    pages: OnboardingPage[];
    onDone?: () => void;
    onSkip?: () => void;
    showSkip?: boolean;
    showNext?: boolean;
    showDone?: boolean;
    skipLabel?: string | React.ReactNode;
    nextLabel?: string | React.ReactNode;
    doneLabel?: string | React.ReactNode;
    bottomBarHeight?: number;
    bottomBarColor?: string;
    bottomBarHighlight?: boolean;
    controlStatusBar?: boolean;
    showPagination?: boolean;
    transitionAnimationDuration?: number;
    allowFontScalingText?: boolean;
    allowFontScalingButtons?: boolean;
    pageIndexCallback?: (index: number) => void;
    containerStyles?: ViewStyle;
    imageContainerStyles?: ViewStyle;
    titleStyles?: TextStyle;
    subTitleStyles?: TextStyle;
    SkipButtonComponent?: ComponentType<any>;
    NextButtonComponent?: ComponentType<any>;
    DoneButtonComponent?: ComponentType<any>;
    DotComponent?: ComponentType<any>;
  }

  const Onboarding: ComponentType<OnboardingProps>;
  export default Onboarding;
}
