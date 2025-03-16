/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

const tintColorLight = '#0a7ea4';
const tintColorDark = '#fff';

export const Colors = {
  common: {
    blue: '#0a7ea4',
    green: '#00a74a',
    red: '#d32f2f',
    yellow: '#fbc02d',
    orange: '#f57c00',
    purple: '#7b1fa2',
    pink: '#c2185b',
    teal: '#00796b',
    cyan: '#00acc1',
    grey: '#9e9e9e',
    brown: '#5d4037',
    darkBlue: '#1D56FF',
    priamry: '#1D56FF',
    white: '#fff',
  },
  light: {
    text: '#11181C',
    background: '#fff',
    tint: tintColorLight,
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: '#ECEDEE',
    background: '#151718',
    tint: tintColorDark,
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: tintColorDark,
  },
};
