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

export const formatTime = (seconds: number): string => {
  // Handle invalid inputs
  if (!Number.isFinite(seconds) || seconds < 0) {
    return '0:00';
  }
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);

  // Format with hours if present
  if (h > 0) {
    return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  }
  // Ensure minutes are never negative
  const minutes = Math.max(0, m);
  return `${minutes}:${s.toString().padStart(2, '0')}`;
};
