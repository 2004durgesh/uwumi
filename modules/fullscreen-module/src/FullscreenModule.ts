import { requireNativeModule } from 'expo-modules-core';

const FullscreenModule = requireNativeModule('FullscreenModule');

export default {
  enterFullscreen: async () => {
    try {
      const result = await FullscreenModule.enterFullscreen();
      return result;
    } catch (error) {
      console.error('Failed to enter fullscreen:', error);
      return false;
    }
  },

  exitFullscreen: async () => {
    try {
      const result = await FullscreenModule.exitFullscreen();
      return result;
    } catch (error) {
      console.error('Failed to exit fullscreen:', error);
      return false;
    }
  },

  toggleFullscreen: async (isFullscreen: boolean) => {
    try {
      if (isFullscreen) {
        return await FullscreenModule.exitFullscreen();
      } else {
        return await FullscreenModule.enterFullscreen();
      }
    } catch (error) {
      console.error('Failed to toggle fullscreen:', error);
      return false;
    }
  },
};
