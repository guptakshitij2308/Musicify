import BasicModalContainer from '@ui/BasicModalContainer';
import colors from '@utils/colors';
import {FC, useState} from 'react';
import {View, StyleSheet, TextInput, Pressable, Text} from 'react-native';
import MaterialComIcon from 'react-native-vector-icons/MaterialCommunityIcons';

export interface PlaylistInfo {
  title: string;
  private: boolean;
}

interface Props {
  visible: boolean;
  onRequestClose: () => void;
  onSubmit: (value: PlaylistInfo) => void;
}

const PlaylistForm: FC<Props> = ({visible, onRequestClose, onSubmit}) => {
  const [playlistInfo, setPlaylistInfo] = useState({
    title: '',
    private: false,
  });

  function handleSubmit() {
    onSubmit(playlistInfo);
    handleClose();
  }

  function handleClose() {
    setPlaylistInfo({title: '', private: false});
    onRequestClose();
  }

  return (
    <BasicModalContainer visible={visible} onRequestClose={handleClose}>
      <View>
        <Text style={styles.title}>Create New Playlist</Text>
        <TextInput
          onChangeText={text => setPlaylistInfo({...playlistInfo, title: text})}
          placeholder="Title"
          style={styles.input}
          value={playlistInfo.title}
        />
        <Pressable
          onPress={() =>
            setPlaylistInfo({...playlistInfo, private: !playlistInfo.private})
          }
          style={styles.privateSelector}>
          {playlistInfo.private ? (
            <MaterialComIcon name="radiobox-marked" color={colors.SECONDARY} />
          ) : (
            <MaterialComIcon name="radiobox-blank" color={colors.SECONDARY} />
          )}
          <Text style={styles.privateLabel}>Private</Text>
        </Pressable>
        <Pressable style={styles.submitBtn} onPress={handleSubmit}>
          <Text>Create</Text>
        </Pressable>
      </View>
    </BasicModalContainer>
  );
};

const styles = StyleSheet.create({
  container: {},
  title: {
    fontSize: 18,
    color: colors.CONTRAST,
    fontWeight: '700',
  },
  input: {
    height: 45,
    paddingVertical: 10,
    borderBottomWidth: 2,
    borderBottomColor: colors.CONTRAST,
    color: colors.INACTIVE_CONTRAST,
  },
  privateSelector: {
    height: 45,
    alignItems: 'center',
    flexDirection: 'row',
  },
  privateLabel: {
    color: colors.CONTRAST,
    marginLeft: 5,
  },
  submitBtn: {
    height: 45,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 0.5,
    borderColor: colors.CONTRAST,
    borderRadius: 7,
    marginBottom: 5,
  },
});

export default PlaylistForm;
