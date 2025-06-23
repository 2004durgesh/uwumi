import EpisodeList from '@/components/EpisodeList';
import { MediaType } from '@/constants/types';
import { useLocalSearchParams } from 'expo-router';
import { IAnimeInfo, IMovieInfo, MediaFormat, TvType } from 'react-native-consumet';
import { View } from 'tamagui';

interface EpisodesProps {
  data: IAnimeInfo | IMovieInfo | undefined;
}

const Episodes: React.FC<EpisodesProps> = ({ data }) => {
  const { mediaType, provider, id, type } = useLocalSearchParams<{
    mediaType: MediaType;
    provider: string;
    type?: MediaFormat | TvType;
    id: string;
  }>();
  return (
    <View height="100%">
      <EpisodeList data={data} mediaType={mediaType} provider={provider} id={id} type={type} swipeable />
    </View>
  );
};

export default Episodes;
