import colors from '@utils/colors';
import {FC} from 'react';
import {View, StyleSheet, FlexStyle} from 'react-native';

interface Props {
  size: number;
  position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
}

const CircleUi: FC<Props> = ({size, position}) => {
  let viewPosition: FlexStyle = {};
  switch (position) {
    case 'top-left':
      viewPosition = {top: -size / 2, left: -size / 2};
      break;
    case 'top-right':
      viewPosition = {top: -size / 2, right: -size / 2};
      break;
    case 'bottom-left':
      viewPosition = {bottom: -size / 2, left: -size / 2};
      break;
    case 'bottom-right':
      viewPosition = {bottom: -size / 2, right: -size / 2};
      break;
    default:
      break;
  }

  return (
    <View
      style={[
        styles.circleContainer,
        {width: size, height: size, ...viewPosition},
      ]}>
      <View
        style={[
          styles.circle,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
          },
        ]}>
        <View
          style={[
            styles.innerCircle,
            {
              width: size / 1.5,
              height: size / 1.5,
              borderRadius: size / 2,
              transform: [{translateX: -size / 3}, {translateY: -size / 3}],
            },
          ]}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  circle: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: colors.SECONDARY,
    opacity: 0.3,
  },
  circleContainer: {
    position: 'absolute',
  },
  innerCircle: {
    backgroundColor: colors.SECONDARY,
    opacity: 0.6,
    position: 'absolute',
    top: '50%',
    left: '50%',
  },
});
export default CircleUi;
