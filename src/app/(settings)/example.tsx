import { ThemedView } from '@/components/ThemedView'; // Assuming this component exists
import { Text } from 'react-native'; // Import Button
import { MOVIES, META } from 'react-native-consumet';
import { Button } from 'tamagui';

const Example = () => {
  const fetchMovies = async () => {
    const movies = new META.TMDB(process.env.EXPO_TMDB_API_KEY, new MOVIES.MultiMovies());
    const search = await movies.search('mercy for none');
    console.log(search);
    const info = await movies.fetchMediaInfo(search.results[0].id, search.results[0].type as string);
    console.log(info);
    const episodes = await movies.fetchEpisodeSources(info.episodes![0].id);
    console.log(episodes);
  };
  return (
    <ThemedView>
      <Text>Slider Example</Text>
      <Button
        onPress={fetchMovies}
        size="$4"
        theme="primary"
        backgroundColor="$background"
        color="$text"
        borderRadius="$2"
        borderWidth={1}
        borderColor="$border"
        padding="$2">
        Fetch Movies
      </Button>
    </ThemedView>
  );
};
export default Example;
