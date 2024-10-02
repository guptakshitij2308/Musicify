import colors from '@utils/colors';
import {FC} from 'react';
import Icon from 'react-native-vector-icons/Entypo';

interface Props {
  privateIcon?: boolean;
}

const PasswordVisibilityIcon: FC<Props> = props => {
  return props.privateIcon ? (
    <Icon name="eye" size={20} color={colors.CONTRAST} />
  ) : (
    <Icon name="eye-with-line" size={20} color={colors.CONTRAST} />
  );
};

export default PasswordVisibilityIcon;
