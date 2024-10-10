import colors from '@utils/colors';
import {FC} from 'react';
import {Pressable, StyleSheet, Text} from 'react-native';
import Loader from './Loader';

interface Props {
  title: string;
  //   onPress?: void;
  busy?: boolean;
  onPress?: (e: React.FormEvent<HTMLFormElement>) => void;
}

const AppButton: FC<Props> = props => {
  return (
    <Pressable onPress={props.onPress} style={styles.container}>
      {!props.busy ? <Text>{props.title}</Text> : <Loader />}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 45,
    backgroundColor: colors.SECONDARY,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 25,
  },
  title: {
    color: colors.CONTRAST,
    fontSize: 18,
  },
});

export default AppButton;
