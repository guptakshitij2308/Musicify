import colors from '@utils/colors';
import {FC} from 'react';
import {Pressable, StyleSheet, Text} from 'react-native';
import Loader from './Loader';

interface Props {
  title: string;
  //   onPress?: void;
  busy?: boolean;
  onPress?: (e: React.FormEvent<HTMLFormElement>) => void;
  borderRadius?: number;
}

const AppButton: FC<Props> = props => {
  return (
    <Pressable
      onPress={props.onPress}
      style={[
        styles.container,
        {
          borderRadius: props.borderRadius || 25,
        },
      ]}>
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
  },
  title: {
    color: colors.CONTRAST,
    fontSize: 18,
  },
});

export default AppButton;
