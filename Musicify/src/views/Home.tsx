import LatestUploads from '@components/LatestUploads';
import OptionsModal from '@components/OptionsModal';
import PlaylistForm from '@components/PlaylistForm';
import PlaylistModal from '@components/PlaylistModal';
import RecommendedAudios from '@components/RecommendedAudios';
import {getFromAsyncStorage, Keys} from '@utils/asyncStorage';
import colors from '@utils/colors';
import {FC, useState} from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import MaterialComIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useDispatch} from 'react-redux';
import {AudioData} from 'src/@types/audio';
import catchAsyncError from 'src/api/catchError';
import client from 'src/api/client';
import {updateNotification} from 'src/store/notification';

interface Props {}

const Home: FC<Props> = props => {
  const [showOptions, setShowOptions] = useState(false);
  const [selectedAudio, setSelectedAudio] = useState<AudioData>();
  const dispatch = useDispatch();

  function handleOnLongPress(audio: AudioData) {
    setSelectedAudio(audio);
    setShowOptions(true);
  }

  async function handleOnFavPress() {
    if (!selectedAudio) {
      return;
    }

    // console.log('Here');
    try {
      const token = await getFromAsyncStorage(Keys.AUTH_TOKEN);
      const {data} = await client.post(
        '/favourite?audioId=' + selectedAudio.id,
        null,
        {headers: {Authorization: `Bearer ${token}`}},
      );
      // console.log(data);
    } catch (e) {
      // console.error(e);
      const err = catchAsyncError(e);
      dispatch(updateNotification({message: err, type: 'error'}));
    }
    setSelectedAudio(undefined);
    setShowOptions(false);
  }

  return (
    <View style={styles.container}>
      <LatestUploads
        onAudioPress={item => {
          setSelectedAudio(item);
        }}
        onAudioLongPress={handleOnLongPress}
      />
      <RecommendedAudios
        onAudioPress={() => {
          console.log('item');
        }}
        onAudioLongPress={handleOnLongPress}
      />
      <OptionsModal
        visible={showOptions}
        onRequestClose={() => setShowOptions(false)}
        options={[
          {
            title: 'Add to playlist',
            icon: 'playlist-music',
            // onPress: handleOnFavPress,
          },
          {
            title: 'Add to faviourites',
            icon: 'cards-heart',
            onPress: handleOnFavPress,
          },
        ]}
        renderItem={item => (
          <Pressable onPress={item.onPress} style={styles.optionContainer}>
            <MaterialComIcon
              size={25}
              name={item.icon}
              color={colors.CONTRAST}
            />
            <Text style={styles.optionTitle}>{item.title}</Text>
          </Pressable>
        )}
      />
      {/* <PlaylistModal
        visible
        list={[
          {title: 'My Playlists', visibility: 'public'},
          {title: 'My ', visibility: 'private'},
        ]}
      /> */}
      <PlaylistForm status="private" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 15,
  },
  loading: {
    color: colors.CONTRAST,
    fontSize: 25,
  },
  optionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  optionTitle: {color: colors.CONTRAST, fontSize: 16, marginLeft: 5},
});

export default Home;
