import colors from '@utils/colors';
import {FC, useEffect} from 'react';
import {StyleSheet, Text} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import {useDispatch, useSelector} from 'react-redux';
import {getNotificationState, updateNotification} from 'src/store/notification';

interface Props {}

const AppNotification: FC<Props> = props => {
  const {message, type} = useSelector(getNotificationState);
  const height = useSharedValue(0);
  const dispatch = useDispatch();

  const heightStyle = useAnimatedStyle(() => {
    return {
      height: height.value,
    };
  });

  let backgroundColor = colors.ERROR,
    textColor = colors.CONTRAST;
  if (type === 'success') {
    backgroundColor = colors.SUCCESS;
    textColor = '#fff';
  }

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>;
    const performAnimation = () => {
      height.value = withTiming(45, {
        duration: 150,
      });
      timeoutId = setTimeout(() => {
        height.value = withTiming(0, {duration: 150});
        dispatch(updateNotification({message: '', type}));
      }, 3000);
    };
    if (message) {
      performAnimation();
    }
    return () => {
      clearTimeout(timeoutId);
    };
  }, [dispatch, height, message, type]);

  return (
    <Animated.View style={[styles.container, {backgroundColor}, heightStyle]}>
      <Text style={[styles.message, {color: textColor}]}>{message}</Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  message: {
    fontSize: 18,
    alignItems: 'center',
  },
});

export default AppNotification;
