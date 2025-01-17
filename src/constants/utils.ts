export const getFetchUrl = () => {
  if (process.env.NODE_ENV === 'production') {
    return {
      apiUrl: process.env.EXPO_PUBLIC_API_URL,
      episodeApiUrl: process.env.EXPO_PUBLIC_EPISODE_API_URL,
    };
  } else {
    return {
      apiUrl: process.env.EXPO_PUBLIC_API_URL_DEV,
      episodeApiUrl: process.env.EXPO_PUBLIC_EPISODE_API_URL_DEV,
    };
  }
};
