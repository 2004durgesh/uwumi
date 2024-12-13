import React from 'react';
import { StyleSheet } from 'react-native';
import { useEvent } from 'expo';
import { useVideoPlayer, VideoView } from 'expo-video';
import { 
  YStack, 
  XStack, 
  Button, 
  Spinner,
  Text,
  View 
} from 'tamagui';
import { Play, Pause, Volume2, VolumeX } from '@tamagui/lucide-icons';
import { ThemedView } from '@/components/ThemedView';
import { useLocalSearchParams } from 'expo-router';

interface VideoPlayerProps {
  source: string;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ source }) => {
  const player = useVideoPlayer(source, player => {
    player.loop = true;
  });

  const { isPlaying } = useEvent(player, 'playingChange', { 
    isPlaying: player.playing 
  });

  return (
    <YStack flex={1}>
      <View backgroundColor="$background" flex={1}>
        <VideoView
          player={player} allowsFullscreen allowsPictureInPicture 
          style={styles.video}
        />
        
        <XStack 
          paddingVertical="$4"
          paddingHorizontal="$4"
          justifyContent="space-between"
          alignItems="center"
          backgroundColor="$background"
        >
          <Button
            icon={isPlaying ? Pause : Play}
            size="$4"
            circular
            onPress={() => {
              if (isPlaying) {
                player.pause();
              } else {
                player.play();
              }
            }}
          />
          
          <Button
            icon={player.muted ? VolumeX : Volume2}
            size="$4"
            circular
            onPress={() => {
              player.muted = !player.muted;
            }}
          />
        </XStack>
      </View>
    </YStack>
  );
};

const styles = StyleSheet.create({
  video: {
    width: '100%',
    aspectRatio: 16 / 9,
  },
});


const Watch = () => {
  const { mediaType, provider, id, poster, title } = useLocalSearchParams<{
    mediaType: string;
    provider: string;
    id: string;
    poster: string;
    title: string;
  }>();

  return (
    <ThemedView>
      <YStack flex={1}>
        <VideoPlayer 
          source="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4" 
        />
      </YStack>
    </ThemedView>
  );
};

export default Watch;
