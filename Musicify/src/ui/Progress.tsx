import colors from '@utils/colors';
import React from 'react';
import {FC} from 'react';
import {View, StyleSheet, Text} from 'react-native';

interface Props {
  progress: number;
}

const Progress: FC<Props> = props => {
  return (
    <>
      <Text style={styles.title}>{props.progress}%</Text>
      <View style={[styles.progressBar, {width: `${props.progress}%`}]} />
    </>
  );
};

const styles = StyleSheet.create({
  container: {},
  title: {
    color: colors.CONTRAST,
    paddingVertical: 2,
    alignSelf: 'flex-end',
    marginTop: 8,
  },
  progressBar: {
    height: 10,
    backgroundColor: colors.CONTRAST,
    borderRadius: 5,
  },
});

export default Progress;
