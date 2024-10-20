import colors from '@utils/colors';
import {useState} from 'react';
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import MaterialComIcon from 'react-native-vector-icons/MaterialCommunityIcons';

interface Props<T> {
  visible?: boolean;
  title: string;
  data: T[];
  renderItem(item: T): JSX.Element;
  onSelect(item: T, index: number): void;
  onRequestClose?(): void;
}

const CategorySelector = <T extends any>({
  visible = false,
  title,
  data,
  renderItem,
  onSelect,
  onRequestClose,
}: Props<T>) => {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  function handleSelect(item: T, index: number) {
    setSelectedIndex(index);
    onSelect(item, index);
    if (onRequestClose) {
      onRequestClose();
    }
  }

  return (
    <Modal
      onRequestClose={onRequestClose}
      visible={visible}
      style={styles.container}
      transparent>
      <View style={styles.modalContainer}>
        <Pressable onPress={onRequestClose} style={styles.backdrop} />
        <View style={styles.modal}>
          <Text style={styles.title}>{title}</Text>
          <ScrollView>
            {data.map((item, index) => {
              return (
                <Pressable
                  onPress={() => handleSelect(item, index)}
                  key={index}
                  style={styles.selectorContainer}>
                  {selectedIndex === index ? (
                    <MaterialComIcon name="radiobox-marked" />
                  ) : (
                    <MaterialComIcon name="radiobox-blank" />
                  )}
                  {renderItem(item)}
                </Pressable>
              );
            })}
          </ScrollView>
        </View>
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
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.SECONDARY,
    paddingVertical: 10,
  },
  selectorContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default CategorySelector;
