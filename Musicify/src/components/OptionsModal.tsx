import BasicModalContainer from '@ui/BasicModalContainer';
import {StyleSheet, View} from 'react-native';

interface Props<T> {
  onRequestClose: () => void;
  visible: boolean;
  options: T[];
  renderItem(item: T): JSX.Element;
}

const OptionsModal = <T extends any>({
  visible,
  options,
  onRequestClose,
  renderItem,
}: Props<T>) => {
  return (
    <BasicModalContainer onRequestClose={onRequestClose} visible={visible}>
      {options.map((item, index) => (
        <View key={index}>{renderItem(item)}</View>
      ))}
    </BasicModalContainer>
  );
};

const styles = StyleSheet.create({
  container: {},
});

export default OptionsModal;
