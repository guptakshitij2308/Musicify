import colors from '@utils/colors';
import {FC} from 'react';
import {View, StyleSheet, Modal, Pressable} from 'react-native';

interface Props {
  visible?: boolean;
  onRequestClose?: () => void;
  children?: React.ReactNode;
}

const BasicModalContainer: FC<Props> = ({
  visible,
  onRequestClose,
  children,
}) => {
  return (
    <Modal
      onRequestClose={onRequestClose}
      visible={visible}
      style={styles.container}
      transparent>
      <View style={styles.modalContainer}>
        <Pressable onPress={onRequestClose} style={styles.backdrop} />
        <View style={styles.modal}>{children}</View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {},
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.INACTIVE_CONTRAST,
    zIndex: -1,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
    zIndex: 1,
  },
  modal: {
    width: '90%',
    maxHeight: '50%',
    borderRadius: 10,
    padding: 10,
    backgroundColor: colors.PRIMARY,
  },
});

export default BasicModalContainer;
