import AppInput from '@ui/AppInput';
import colors from '@utils/colors';
import {useFormikContext} from 'formik';
import {FC} from 'react';
import {
  View,
  StyleSheet,
  Text,
  TextInputProps,
  ViewStyle,
  StyleProp,
} from 'react-native';

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
}

const AuthInputField: FC<Props> = props => {
  const {handleChange, values, errors, handleBlur, touched} = useFormikContext<{
    [key: string]: string;
  }>();
  const errorMsg =
    touched[props.name] && errors[props.name] ? errors[props.name] : '';
  return (
    <View style={[props.containerStyle, styles.container]}>
      <View style={styles.labelContainer}>
        <Text style={styles.label}>{props.label}</Text>
        <Text style={styles.errorMsg}>{errorMsg}</Text>
      </View>
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
    </View>
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
});

export default AuthInputField;
