import colors from '@utils/colors';
import {FC, forwardRef} from 'react';
import {StyleSheet, TextInput, TextInputProps} from 'react-native';

interface Props extends TextInputProps {
  ref?: any;
}

// We use forwardRefs to pass the references from the parent to the child

const OTPField: FC<Props> = forwardRef<TextInput, Props>((props, ref) => {
  return (
    <TextInput
      {...props}
      ref={ref}
      style={[styles.input, props.style]}
      placeholderTextColor={colors.INACTIVE_CONTRAST}
    />
  );
});

const styles = StyleSheet.create({
  input: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderColor: colors.SECONDARY,
    borderWidth: 2,
    textAlign: 'center',
    color: colors.CONTRAST,
    fontSize: 18,
    fontWeight: 'bold',
    lineHeight: 18,
  },
});

export default OTPField;
