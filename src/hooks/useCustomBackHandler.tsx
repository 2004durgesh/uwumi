import { useEffect } from 'react';
import { BackHandler } from 'react-native';

/**
 * @param {boolean} enabled - Whether the custom back handler is enabled. When false, the back handler is not registered.
 * @param {() => boolean} onBackPress - A function to handle the back press.
 * Should return `true` to prevent the default back behavior, or `false` to allow it.
 */

export const useCustomBackHandler = (enabled: boolean, onBackPress: () => boolean) => {
  useEffect(() => {
    if (!enabled) return;

    const backAction = () => {
      return onBackPress();
    };

    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);

    return () => backHandler.remove(); // Clean up listener on unmount
  }, [enabled, onBackPress]);
};
