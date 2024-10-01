import AppInput from '@ui/AppInput';
import colors from '@utils/colors';
import {useFormikContext} from 'formik';
import {FC, ReactNode, useEffect} from 'react';
import {
  View,
  StyleSheet,
  Text,
  TextInputProps,
  ViewStyle,
  StyleProp,
  Pressable,
} from 'react-native';

import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

interface Props extends TextInputProps {
  name: string;
  placeholder?: string;
  label?: string;
  value?: string;
  errorMessage?: string;
  keyboardType?: TextInputProps['keyboardType'];
  autoCaptitalize?: TextInputProps['autoCapitalize'];
  secureTextEntry?: boolean;
  containerStyle?: StyleProp<ViewStyle>;
  rightIcon?: ReactNode;
  onRightIconPress?: () => void;
}

const AuthInputField: FC<Props> = props => {
  const inputTransformValue = useSharedValue(0);
  const {handleChange, values, errors, handleBlur, touched} = useFormikContext<{
    [key: string]: string;
  }>();
  const errorMsg =
    touched[props.name] && errors[props.name] ? errors[props.name] : '';

  const inputStyle = useAnimatedStyle(() => {
    return {transform: [{translateX: inputTransformValue.value}]};
  });

  useEffect(() => {
    const shakeUI = () => {
      inputTransformValue.value = withSequence(
        withTiming(-10, {duration: 100}),
        withSpring(0, {
          damping: 8,
          mass: 0.5,
          stiffness: 1000,
          restDisplacementThreshold: 0.1,
        }),
      );
    };
    if (errorMsg) {
      shakeUI();
    }
  }, [errorMsg, inputTransformValue]);

  return (
    <Animated.View style={[props.containerStyle, styles.container, inputStyle]}>
      {/* <View> */}
      <View style={styles.labelContainer}>
        <Text style={styles.label}>{props.label}</Text>
        <Text style={styles.errorMsg}>{errorMsg}</Text>
      </View>
      <View>
        <AppInput
          placeholderTextColor={colors.INACTIVE_CONTRAST}
          placeholder={props.placeholder}
          keyboardType={props.keyboardType}
          autoCapitalize={props.autoCapitalize}
          secureTextEntry={props.secureTextEntry}
          onChangeText={handleChange(props.name)}
          value={values[props.name]}
          onBlur={handleBlur(props.name)}
        />
        {props.rightIcon ? (
          <Pressable onPress={props.onRightIconPress} style={styles.rightIcon}>
            {props.rightIcon}
          </Pressable>
        ) : null}
      </View>
      {/* </View> */}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {},
  label: {color: colors.CONTRAST},
  errorMsg: {
    color: colors.ERROR,
  },
  labelContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 5,
  },
  rightIcon: {
    position: 'absolute',
    width: 45,
    height: 45,
    right: 0,
    top: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default AuthInputField;
