import EpisodeList from '@/components/EpisodeList';
import { useLocalSearchParams } from 'expo-router';
import { View } from 'tamagui';

const Episodes = () => {
  const { mediaType, provider, id } = useLocalSearchParams<{
    mediaType: string;
    provider: string;
    id: string;
  }>();
  return (
    <View height="100%">
      <EpisodeList mediaType={mediaType} provider={provider} id={id} swipeable />
    </View>
  );
};

export default Episodes;
