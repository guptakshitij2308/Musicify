import PulseAnimationContainer from '@ui/PulseAnimationContainer';
import colors from '@utils/colors';
import {FC} from 'react';
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {useFetchLatestAudios} from 'src/hooks/query';

interface Props {}

const Home: FC<Props> = props => {
  const {data, isFetching: isLoading} = useFetchLatestAudios();

  // console.log(data);
  // console.log(isLoading);

  if (isLoading) {
    return (
      <PulseAnimationContainer style={styles.container}>
        <Text style={styles.loading}>Loading...</Text>
      </PulseAnimationContainer>
    );
  }

  return (
    <View style={styles.container}>
      <Text
        style={{
          color: colors.CONTRAST,
          fontSize: 20,
          fontWeight: 'bold',
          marginBottom: 15,
        }}>
        Latest Uploads
      </Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {data?.map(audio => {
          return (
            <Pressable
              onPress={() => console.log(audio)}
              onLongPress={() => console.log('Long pressed bro')}
              style={{width: 100, marginRight: 15}}
              key={audio.id}>
              <Image
                source={{uri: audio.poster}}
                style={{width: 100, aspectRatio: 1, borderRadius: 7}}
              />
              <Text
                numberOfLines={2}
                ellipsizeMode="tail"
                key={audio.id}
                style={{
                  color: colors.CONTRAST,
                  // paddingVertical: 10,
                  fontWeight: '500',
                  fontSize: 16,
                  marginTop: 5,
                }}>
                {audio.title}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 15,
  },
  loading: {
    color: colors.INACTIVE_CONTRAST,
    fontSize: 25,
  },
});

export default Home;
