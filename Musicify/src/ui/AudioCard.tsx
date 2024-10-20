import colors from '@utils/colors';
import {FC} from 'react';
import {Image, Pressable, StyleSheet} from 'react-native';
import {Text} from 'react-native-paper';

interface Props {
  title: string;
  poster?: string;
}

const AudioCard: FC<Props> = ({title, poster}) => {
  const source = poster ? {uri: poster} : require('../assets/music.png');
  return (
    <Pressable
      onPress={() => console.log('Pressed bro')}
      onLongPress={() => console.log('Long pressed bro')}
      style={styles.container}>
      <Image source={source} style={styles.poster} />
      <Text numberOfLines={2} ellipsizeMode="tail" style={styles.title}>
        {title}
      </Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {width: 100, marginRight: 15},
  poster: {width: 100, height: 100, borderRadius: 7},
  title: {
    color: colors.CONTRAST,
    fontWeight: '500',
    fontSize: 16,
    marginTop: 5,
  },
});

export default AudioCard;
