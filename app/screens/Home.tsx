import {RouteProp} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import React, {useEffect, useState} from 'react';
import {SafeAreaView, StyleSheet, Text, View} from 'react-native';
import {Product} from '../models/product';
import {FlatList, TouchableOpacity} from 'react-native-gesture-handler';
/* import {Props as ProductDetailsProps} from './ProductDetails'; */
import {RootStackParamList} from '../../App';
import LocalDB from '../persistance/localdb';

type HomeScreenProps = StackNavigationProp<RootStackParamList, 'Home'>;
type HomeScreenRoute = RouteProp<RootStackParamList, 'Home'>;

type HomeProps = {
  navigation: HomeScreenProps;
  route: HomeScreenRoute;
};

function Home({navigation}: HomeProps): React.JSX.Element {
  const [products, setProducts] = useState<Product[]>([]);
  const productItem = ({item}: {item: Product}) => (
    <TouchableOpacity
      style={styles.productItem}
      onPress={() => navigation.push('ProductDetails', {product: item})}>
      <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
        <View style={{flexDirection: 'column'}}>
          <Text style={styles.itemTitle}>{item.nombre}</Text>
          <Text style={styles.itemDetails}>Precio: ${item.precio}</Text>
        </View>

        <View style={{flexDirection: 'column'}}>
          {/* cambiar el texto a color a rojo si el currentstock es menor que el min stock */}
          <Text
            style={[
              styles.itemDetails,
              item.currentStock < item.minStock ? styles.lowstock : null,
            ]}>
            Stock: {item.currentStock}/{item.maxStock}
          </Text>
          <Text
            style={[
              styles.itemDetails,
              item.currentStock < item.minStock ? styles.lowstock : null,
            ]}>
            Minimo: {item.minStock}
          </Text>
        </View>
        {/* <View >
                    <Text style={styles.itemBadge}>{item.currentStock}</Text>
                </View> */}
      </View>
    </TouchableOpacity>
  );

  useEffect(() => {
    LocalDB.init();
    navigation.addListener('focus', async () => {
      const db = await LocalDB.connect();
      db.transaction(async tx => {
        tx.executeSql(
          'SELECT * FROM productos',
          [],
          (_, res) => setProducts(res.rows.raw()),
          error => console.error({error}),
        );
      });
    });
  }, [navigation]);

  return (
    <SafeAreaView>
      <FlatList
        data={products}
        renderItem={productItem}
        keyExtractor={item => item.id.toString()}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  productItem: {
    padding: 12,
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
  },
  itemTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    textTransform: 'capitalize',
  },
  itemDetails: {
    fontSize: 16,
    opacity: 0.9,
  },
  itemBadge: {
    fontSize: 24,
    color: 'red',
    fontWeight: 'bold',
    alignSelf: 'center',
  },
  lowstock: {
    color: 'red',
    fontWeight: 'bold',
  },
});

export default Home;
