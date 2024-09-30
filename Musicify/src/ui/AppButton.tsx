import colors from '@utils/colors';
import {FC} from 'react';
import {Pressable, StyleSheet, Text} from 'react-native';

interface Props {
  title: string;
  //   onPress?: void;
  onPress?: (e: React.FormEvent<HTMLFormElement>) => void;
}

const AppButton: FC<Props> = props => {
  return (
    <Pressable onPress={props.onPress} style={styles.container}>
      <Text>{props.title}</Text>
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
