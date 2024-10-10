import CircleUi from '@ui/CircleUi';
import colors from '@utils/colors';
import {FC, ReactNode} from 'react';
import {View, Text, StyleSheet, Image} from 'react-native';

interface Props {
  title: string;
  subtitle?: string;
  children?: ReactNode;
}

const AuthFormContainer: FC<Props> = ({children, title, subtitle}) => {
  return (
    <View style={styles.container}>
      <CircleUi position="top-left" size={250} />
      <CircleUi position="top-right" size={200} />
      <CircleUi position="bottom-left" size={200} />
      <CircleUi position="bottom-right" size={250} />

      <View style={styles.header}>
        <View style={{alignItems: 'center'}}>
          <Image source={require('../assets/logo.png')} />
        </View>

        <Text style={styles.title}>{title}</Text>
        {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
      </View>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.PRIMARY,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 15,
  },
  header: {
    width: '100%',
    marginBottom: 20,
  },
  title: {
    color: colors.SECONDARY,
    fontSize: 25,
    fontWeight: 'bold',
    paddingVertical: 5,
  },
  subtitle: {
    color: colors.CONTRAST,
    fontSize: 16,
  },
});

export default AuthFormContainer;
