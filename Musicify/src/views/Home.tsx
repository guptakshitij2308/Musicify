import LatestUploads from '@components/LatestUploads';
import OptionsModal from '@components/OptionsModal';
import PlaylistForm, {PlaylistInfo} from '@components/PlaylistForm';
import PlaylistModal from '@components/PlaylistModal';
import RecommendedAudios from '@components/RecommendedAudios';
import colors from '@utils/colors';
import {FC, useState} from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import MaterialComIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useDispatch} from 'react-redux';
import {AudioData, Playlist} from 'src/@types/audio';
import catchAsyncError from 'src/api/catchError';
import {getClient} from 'src/api/client';
import {useFetchPlaylists} from 'src/hooks/query';
import {updateNotification} from 'src/store/notification';

interface Props {}

const Home: FC<Props> = props => {
  const [showOptions, setShowOptions] = useState(false);
  const [selectedAudio, setSelectedAudio] = useState<AudioData>();
  const dispatch = useDispatch();
  const [showPlaylistsModal, setShowPlaylistsModal] = useState(false);
  const [showPlaylistsForm, setShowPlaylistsForm] = useState(false);
  const {data} = useFetchPlaylists();
  // console.log(data);

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
      const client = await getClient();
      const {data} = await client.post(
        '/favourite?audioId=' + selectedAudio.id,
        null,
      );
      console.log(data);
    } catch (e) {
      // console.error(e);
      const err = catchAsyncError(e);
      dispatch(updateNotification({message: err, type: 'error'}));
    }
    setSelectedAudio(undefined);
    setShowOptions(false);
  }

  const handleAddToPlaylist = () => {
    setShowOptions(false);
    setShowPlaylistsModal(true);
  };

  const handleSubmitPlaylistForm = async (value: PlaylistInfo) => {
    if (!value.title.trim()) {
      return;
    }
    try {
      const client = await getClient();
      const {data} = await client.post('/playlist/create', {
        resID: selectedAudio?.id,
        title: value.title,
        visibility: value.private ? 'private' : 'public',
      });
      // console.log(data);
    } catch (e) {
      const err = catchAsyncError(e);
      dispatch(updateNotification({message: err, type: 'error'}));
    }
  };

  const updatePlaylist = async (item: Playlist) => {
    try {
      const client = await getClient();
      const {data} = await client.patch('/playlist', {
        id: item.id,
        item: selectedAudio?.id,
        title: item.title,
        visibility: item.visibility,
      });
      setSelectedAudio(undefined);
      setShowPlaylistsModal(false);
      dispatch(
        updateNotification({
          message: 'New audio added to playlist',
          type: 'success',
        }),
      );
      console.log(data);
    } catch (e) {
      const err = catchAsyncError(e);
      dispatch(updateNotification({message: err, type: 'error'}));
    }
  };

  return (
    <View style={styles.container}>
      <LatestUploads
        onAudioPress={item => {
          setSelectedAudio(item);
          console.log(item);
        }}
        onAudioLongPress={handleOnLongPress}
      />
      <RecommendedAudios
        onAudioPress={item => {
          console.log(item);
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
            onPress: handleAddToPlaylist,
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
      <PlaylistModal
        visible={showPlaylistsModal}
        onRequestClose={() => setShowPlaylistsModal(false)}
        list={data || []}
        onCreateNewPress={() => {
          setShowPlaylistsForm(true);
          setShowPlaylistsModal(false);
        }}
        onPlaylistPress={updatePlaylist}
      />
      {showPlaylistsForm ? (
        <PlaylistForm
          visible={showPlaylistsForm}
          onRequestClose={() => setShowPlaylistsForm(false)}
          onSubmit={handleSubmitPlaylistForm}
        />
      ) : null}
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
