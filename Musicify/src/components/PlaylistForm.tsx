import BasicModalContainer from '@ui/BasicModalContainer';
import colors from '@utils/colors';
import {FC} from 'react';
import {View, StyleSheet, TextInput, Pressable, Text} from 'react-native';
import MaterialComIcon from 'react-native-vector-icons/MaterialCommunityIcons';

interface Props {
  status: string;
}

const PlaylistForm: FC<Props> = ({status}) => {
  return (
    <BasicModalContainer>
      <View>
        <Text style={styles.title}>Create New Playlist</Text>
        <TextInput placeholder="Title" style={styles.input} />
        <Pressable style={styles.privateSelector}>
          {status === 'private' ? (
            <MaterialComIcon name="radiobox-marked" color={colors.SECONDARY} />
          ) : (
            <MaterialComIcon name="radiobox-blank" color={colors.SECONDARY} />
          )}
          <Text style={styles.privateLabel}>Private</Text>
        </Pressable>
        <Pressable style={styles.submitBtn}>
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
    color: colors.PRIMARY,
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
