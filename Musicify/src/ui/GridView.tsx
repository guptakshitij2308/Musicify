import colors from '@utils/colors';
import {StyleSheet, View} from 'react-native';

interface Props<T> {
  data: T[];
  renderItem(item: T): JSX.Element;
  col?: number;
}

const GridView = <T extends any>(props: Props<T>) => {
  const {data, col = 2, renderItem} = props;
  return (
    <View style={styles.container}>
      {data?.map((item, idx) => (
        <View key={idx} style={{width: `${100 / col}%`}}>
          <View style={{padding: 5}}>{renderItem(item)}</View>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {width: '100%', flexDirection: 'row', flexWrap: 'wrap'},
  title: {
    color: colors.CONTRAST,
    fontWeight: '500',
    fontSize: 16,
    marginTop: 5,
  },
});

export default GridView;
