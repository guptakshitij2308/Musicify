import colors from '@utils/colors';
import {FC} from 'react';
import {
  Pressable,
  StyleProp,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from 'react-native';
import DocumentPicker, {
  DocumentPickerOptions,
  DocumentPickerResponse,
} from 'react-native-document-picker';

interface Props {
  icon?: React.ReactNode;
  btnTitle?: string;
  style?: StyleProp<ViewStyle>;
  onSelect(file: DocumentPickerResponse): void;
  options: DocumentPickerOptions;
}

const FileSelector: FC<Props> = ({
  icon,
  onSelect,
  btnTitle,
  style,
  options,
}) => {
  async function handleDocumentSelect() {
    try {
      const doc = await DocumentPicker.pick(options);
      // console.log(doc);
      const file = doc[0];
      onSelect(file);
      // [{"fileCopyUri": null, "name": ", "size": , "type": "image/jpeg", "uri": ""}]
    } catch (e) {
      // If the error is not because of cancellation
      if (!DocumentPicker.isCancel(e)) {
        console.log('There was an error while selecting the document', e);
      }
    }
  }
  return (
    <Pressable
      onPress={handleDocumentSelect}
      style={[styles.btnContainer, style]}>
      <View style={styles.iconContainer}>{icon}</View>
      <Text style={styles.btnTitle}>{btnTitle}</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  btnContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    height: 70,
    aspectRatio: 1,
    borderWidth: 2,
    borderRadius: 7,
    borderColor: colors.SECONDARY,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnTitle: {
    marginTop: 5,
    color: colors.CONTRAST,
  },
});

export default FileSelector;
