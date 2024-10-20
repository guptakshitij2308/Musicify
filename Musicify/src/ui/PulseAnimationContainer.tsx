import {FC, useEffect} from 'react';
import {StyleSheet} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

interface Props {
  children: React.ReactNode;
}

const PulseAnimationContainer: FC<Props> = props => {
  const opacitySharedValue = useSharedValue(0);
  const opacity = useAnimatedStyle(() => {
    return {
      opacity: opacitySharedValue.value,
    };
  });

  useEffect(() => {
    opacitySharedValue.value = withRepeat(
      withTiming(0.3, {duration: 1000}),
      -1,
      true,
    );
  }, [opacitySharedValue]);

  return (
    <Animated.View style={styles.container}>{props.children}</Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {},
});

export default PulseAnimationContainer;
