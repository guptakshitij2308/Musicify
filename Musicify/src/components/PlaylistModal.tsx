import BasicModalContainer from '@ui/BasicModalContainer';
import colors from '@utils/colors';
import {FC} from 'react';
import {Pressable, ScrollView, StyleSheet, Text} from 'react-native';

import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import AntDesignIcon from 'react-native-vector-icons/AntDesign';
import {Playlist} from 'src/@types/audio';

interface Props {
  visible: boolean;
  onRequestClose: () => void;
  list: Playlist[];
  onCreateNewPress?: () => void;
  onPlaylistPress: (value: Playlist) => void;
}

interface ListItemProps {
  title: string;
  icon: React.ReactNode;
  onPress?: () => void;
}

const ListItem: FC<ListItemProps> = ({title, icon, onPress}) => {
  return (
    <Pressable style={styles.listItemContainer} onPress={onPress}>
      {icon}
      <Text style={styles.listItemTitle}>{title}</Text>
    </Pressable>
  );
};

const PlaylistModal: FC<Props> = ({
  visible,
  onRequestClose,
  list,
  onCreateNewPress,
  onPlaylistPress,
}) => {
  return (
    <BasicModalContainer visible={visible} onRequestClose={onRequestClose}>
      {/* we want to render new playlists */}
      <ScrollView>
        {list.map((item, index) => {
          return (
            <ListItem
              onPress={() => onPlaylistPress(item)}
              key={index}
              title={item.title}
              icon={
                <FontAwesomeIcon
                  size={20}
                  name={item.visibility === 'public' ? 'globe' : 'lock'}
                  color={colors.SECONDARY}
                />
              }
            />
          );
        })}
      </ScrollView>
      {/* create playlist (new) btn */}
      <ListItem
        title={'Create new'}
        icon={<AntDesignIcon size={20} name="plus" color={colors.SECONDARY} />}
        onPress={onCreateNewPress}
      />
    </BasicModalContainer>
  );
};

const styles = StyleSheet.create({
  container: {},
  listItemContainer: {flexDirection: 'row', alignItems: 'center', height: 45},
  listItemTitle: {fontSize: 16, color: colors.SECONDARY, marginLeft: 5},
});

export default PlaylistModal;
