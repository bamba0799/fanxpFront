import { View, FlatList, Text, Image } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Video, ResizeMode } from 'expo-av';
import { HomeStackParamList } from '@navigation/app/home/home/types';
import { ScreenContentLayout } from '@layouts/ScreenContentLayout';
import { Header } from '@components/Header';
import { StoryBox } from './components/StoryBox';
import { useStoryStore } from '@store/story';

const highlights = [
  { id: '1', url: require('@assets/videos/vid-1.mov') },
  { id: '2', url: require('@assets/videos/vid-2.mov') },
  { id: '3', url: require('@assets/videos/vid-3.mov') },
];

const previous_winners = [
  {
    id: '1',
    name: 'Sénégal',
    source: require('@assets/images/previous_cans/sen.webp'),
    year: 2021,
  },
  {
    id: '2',
    name: 'Algérie',
    source: require('@assets/images/previous_cans/alg.jpeg'),
    year: 2019,
  },
  {
    id: '3',
    name: 'Cameroun',
    source: require('@assets/images/previous_cans/cmr.webp'),
    year: 2017,
  },
  {
    id: '4',
    name: 'Côte d\'Ivoire',
    source: require('@assets/images/previous_cans/civ.webp'),
    year: 2015,
  },
];

const Main: React.FC<
  NativeStackScreenProps<HomeStackParamList, 'Home/Main'>
> = ({ navigation, route }) => {
  const dummyStoryData = useStoryStore(state => state.stories)

  return (
    <View className="flex-1">
      <Header
        title={() => (
          <View className="ml-4 flex-row">
            <Text className="font-[extraBold] text-lg text-primary">Fan</Text>
            <Text className="font-[extraBold] text-lg">Xp</Text>
          </View>
        )}
        showProfile={false}
      />

      <ScreenContentLayout
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: 32,
          paddingTop: 22,
        }}
      >
        {/* Stories */}
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item.id}
          data={dummyStoryData}
          contentContainerStyle={{
            paddingHorizontal: 16,
            columnGap: 10,
          }}
          renderItem={({ item, index }) => <StoryBox data={item} index={index} />}
        />

        {/* Best goals */}
        <View className="mt-8">
          <View className="px-4">
            <Text className="text-lg font-bold">Temps forts</Text>
          </View>
          <FlatList
            horizontal
            data={highlights}
            keyExtractor={(item) => item.id}
            showsHorizontalScrollIndicator={false}
            snapToAlignment="center"
            className="mt-4"
            contentContainerStyle={{
              columnGap: 12,
              paddingHorizontal: 16,
            }}
            renderItem={({ item }) => (
              <View className="aspect-[9/12] w-[180px] rounded-2xl">
                <View className="absolute z-0 h-full w-full rounded-2xl bg-gray-300" />
                <Video
                  source={item.url}
                  className="absolute z-[98] aspect-[9/12] w-[180px] rounded-2xl"
                  resizeMode={ResizeMode.COVER}
                  useNativeControls
                  isLooping
                  isMuted
                />
              </View>
            )}
          />

          {/* Annoucement */}
          <View className="mt-8 h-20 w-full flex-row gap-x-3 px-4">
            <View className="h-full w-full items-center justify-center overflow-hidden rounded-xl bg-black">
              <Image
                source={require('@assets/images/pubs/otv-banner.png')}
                className="h-full w-full scale-[2]"
                resizeMode="contain"
              />
            </View>
          </View>
        </View>

        {/* Previous winners (picture) */}
        <View className="mt-8">
          <View className="px-4">
            <Text className="text-lg font-bold">Précédents vainqueurs</Text>
          </View>
          <FlatList
            horizontal
            data={previous_winners}
            keyExtractor={(item) => item.id}
            showsHorizontalScrollIndicator={false}
            decelerationRate="fast"
            snapToInterval={342}
            snapToAlignment="center"
            className="mt-4"
            contentContainerStyle={{
              columnGap: 16,
              paddingHorizontal: 16,
            }}
            renderItem={({ item }) => (
              <View className="h-[180] w-[320px] overflow-hidden rounded-2xl">
                <View className="absolute left-0 top-0 h-full w-full bg-gray-300" />
                <Image
                  source={item.source}
                  className="h-full w-full"
                  resizeMode="cover"
                />
                <View className="absolute left-1.5 top-1.5 rounded-full bg-white/60 px-2 py-1">
                  <Text className="font-[bold] text-xs">{item.name}</Text>
                </View>
                <View className="absolute right-1.5 top-1.5 rounded-full bg-white/60 px-2 py-1">
                  <Text className="font-[bold] text-xs">{item.year}</Text>
                </View>
              </View>
            )}
          />
        </View>
      </ScreenContentLayout>
    </View>
  );
};

export { Main };
