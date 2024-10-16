import CategorySelector from '@components/CategorySelector';
import FileSelector from '@components/FileSelector';
import AppButton from '@ui/AppButton';
import {getFromAsyncStorage, Keys} from '@utils/asyncStorage';
import {categories} from '@utils/categories';
import colors from '@utils/colors';
import {FC, useState} from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import {DocumentPickerResponse, types} from 'react-native-document-picker';
import MaterialComIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import client from 'src/api/client';
import * as yup from 'yup';

interface Props {}

interface FormFields {
  title: string;
  about: string;
  category: string;
  poster?: DocumentPickerResponse;
  file?: DocumentPickerResponse;
}

const defaultForm: FormFields = {
  title: '',
  about: '',
  category: '',
};

const audioInfoSchema = yup.object().shape({
  title: yup.string().trim().required('Title is required!'),
  category: yup.string().oneOf(categories, 'Category is missing!'),
  about: yup.string().trim().required('About is required!'),
  file: yup.object().shape({
    uri: yup.string().required('Audio file is missing!'),
    name: yup.string().required('Audio file is missing!'),
    type: yup.string().required('Audio file is missing!'),
    size: yup.number().required('Audio file is missing!'),
  }),
  poster: yup.object().shape({
    uri: yup.string(),
    name: yup.string(),
    type: yup.string(),
    size: yup.number(),
  }),
});

const Upload: FC<Props> = props => {
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [audioInfo, setAudioInfo] = useState({
    ...defaultForm,
  });

  async function handleUpload() {
    try {
      const finalData = await audioInfoSchema.validate(audioInfo);
      // console.log(finalData);
      const formData = new FormData();
      formData.append('title', finalData.title);
      formData.append('about', finalData.about);
      formData.append('category', finalData.category);
      formData.append('file', {
        name: finalData.file.name,
        type: finalData.file.type,
        uri: finalData.file.uri,
      });

      if (finalData.poster.uri) {
        formData.append('poster', {
          name: finalData.poster.name,
          type: finalData.poster.type,
          uri: finalData.poster.uri,
        });
      }

      const token = await getFromAsyncStorage(Keys.AUTH_TOKEN);
      console.log(token);

      const {data} = await client.post('/audio/create', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      }); // as in backend we want this as multipart form data, we use FormData for it
      console.log(data);
    } catch (e) {
      if (e instanceof yup.ValidationError) {
        console.log('Validation Error : ', e);
      } else {
        console.log(e.response.data);
      }
    }
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.fileSelectorContainer}>
        <FileSelector
          icon={
            <MaterialComIcon
              name="image-outline"
              size={35}
              color={colors.SECONDARY}
            />
          }
          btnTitle="Select Poster"
          options={{type: [types.images]}}
          onSelect={item => setAudioInfo({...audioInfo, poster: item})}
        />
        <FileSelector
          icon={
            <MaterialComIcon
              name="file-music-outline"
              size={35}
              color={colors.SECONDARY}
            />
          }
          style={{marginLeft: 20}}
          btnTitle="Select Audio"
          options={{type: [types.audio]}}
          onSelect={item => setAudioInfo({...audioInfo, file: item})}
        />
      </View>
      <View style={styles.formContainer}>
        <TextInput
          placeholderTextColor={colors.INACTIVE_CONTRAST}
          placeholder="Title"
          style={styles.input}
          onChange={e =>
            setAudioInfo({...audioInfo, title: e.nativeEvent.text})
          }
        />

        <Pressable
          onPress={() => setShowCategoryModal(true)}
          style={styles.categorySelector}>
          <Text style={styles.categorySelectorTitle}>Category</Text>
          <Text style={styles.selectedCategory}>{audioInfo.category}</Text>
        </Pressable>

        <TextInput
          placeholderTextColor={colors.INACTIVE_CONTRAST}
          placeholder="About"
          style={styles.input}
          multiline
          numberOfLines={10}
          onChange={e =>
            setAudioInfo({...audioInfo, about: e.nativeEvent.text})
          }
        />
        <View style={{marginBottom: 20}} />
        <AppButton borderRadius={7} title="Submit" onPress={handleUpload} />
        <CategorySelector
          visible={showCategoryModal}
          title="Category"
          data={categories}
          renderItem={item => {
            return <Text style={styles.category}>{item}</Text>;
          }}
          onSelect={item => setAudioInfo({...audioInfo, category: item})}
          onRequestClose={() => setShowCategoryModal(false)}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {padding: 10},
  fileSelectorContainer: {
    flexDirection: 'row',
  },
  formContainer: {
    marginTop: 20,
  },
  input: {
    borderWidth: 2,
    borderColor: colors.CONTRAST,
    borderRadius: 7,
    padding: 10,
    fontSize: 18,
    color: colors.CONTRAST,
    // marginBottom: 20,
    textAlignVertical: 'top',
  },
  category: {padding: 10, color: colors.INACTIVE_CONTRAST},
  categorySelector: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  categorySelectorTitle: {color: colors.CONTRAST},
  selectedCategory: {
    color: colors.SECONDARY,
    marginLeft: 10,
    fontStyle: 'italic',
  },
});

export default Upload;
