import React, {useEffect, useState} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  FlatList,
  Button,
} from 'react-native';
import {Product} from '../models/Product';
import {RouteProp} from '@react-navigation/native';
import {RootStackParamList} from '../../App';
import {StackNavigationProp} from '@react-navigation/stack';
import {useNavigation} from '@react-navigation/native';
import LocalDB from '../persistance/localdb';

type LoginProps = {
  navigation: StackNavigationProp<RootStackParamList, 'Home'>;
};

export type Params = {
  product: Product;
};

export type Props = {
  route: RouteProp<RootStackParamList, 'ProductDetails'>;
  navigation: StackNavigationProp<RootStackParamList, 'ProductDetails'>;
};

type StockMovement = {
  id: number;
  id_producto: number;
  nombre: string;
  cantidad: number;
  fecha: string;
};

function ProductDetails({route}: Props): React.JSX.Element {
  const [product, setProduct] = useState<Product>();
  const [maxStockMovements, setMaxStockMovements] = useState<StockMovement[]>(
    [],
  );
  const [minStockMovements, setMinStockMovements] = useState<StockMovement[]>(
    [],
  );

  const navigation = useNavigation();

  useEffect(() => {
    setProduct(route.params.product);

    const fetchStockMovements = async () => {
      navigation.addListener('focus', async () => {
        const db = await LocalDB.connect();
        db.transaction((tx: any) => {
          tx.executeSql(
            'SELECT * FROM maxstock WHERE idproducto = ?',
            [product?.id], // Add null check here
            (_, res: any) => setMaxStockMovements(res.rows.raw()),
            (error: any) => console.error({error}),
          );
          tx.executeSql(
            'SELECT * FROM minstock WHERE id_producto = ?',
            [product?.id], // Add null check here
            (_, res: any) => setMinStockMovements(res.rows.raw()),
            (error: any) => console.error({error}),
          );
        });
      });
    };

    fetchStockMovements();
  }, [navigation, product?.id, route]);

  if (!product) {
    return (
      <SafeAreaView style={styles.container}>
        <Text>No product details available</Text>
      </SafeAreaView>
    );
  }

  const btnMaxStock = function () {
    if (product) {
      navigation.navigate('AumStock', {
        productId: product.id,
        productName: product.nombre,
        currentStock: product.currentStock,
      } as {}); // Update the type of the second argument to {}
    }
  };

  const btnMinStock = function () {
    if (product) {
      navigation.navigate('DisStock', {
        productId: product.id,
        productName: product.nombre,
        currentStock: product.currentStock,
      } as {}); // Update the type of the second argument to {}
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.card}>
        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
          <View style={{flexDirection: 'column'}}>
            <Text style={styles.itemTitle}>{product.nombre}</Text>
            <Text style={styles.itemDetails}>Precio: ${product.precio}</Text>
          </View>
          <View style={{flexDirection: 'column'}}>
            <Text
              style={[
                styles.itemDetails,
                product.currentStock < product.minStock
                  ? styles.lowstock
                  : null,
              ]}>
              Stock: {product.currentStock}/{product.maxStock}
            </Text>
            <Text
              style={[
                styles.itemDetails,
                product.currentStock < product.minStock
                  ? styles.lowstock
                  : null,
              ]}>
              Minimo: {product.minStock}
            </Text>
          </View>
        </View>
        <Button title="AumentarStock" onPress={btnMaxStock} />
        <Button title="DisminuirStock" onPress={btnMinStock} />
        <Text style={styles.title}>Movimientos de Aumento de Stock</Text>
        <FlatList
          data={maxStockMovements}
          keyExtractor={item => item.id.toString()}
          renderItem={({item}) => (
            <View style={styles.movementItem}>
              <Text>
                {item.nombre} - Cantidad: {item.cantidad} - Fecha: {item.fecha}
              </Text>
            </View>
          )}
        />
        <Text style={styles.title}>Movimientos de Disminución de Stock</Text>
        <FlatList
          data={minStockMovements}
          keyExtractor={item => item.id.toString()}
          renderItem={({item}) => (
            <View style={styles.movementItem}>
              <Text>
                {item.nombre} - Cantidad: {item.cantidad} - Fecha: {item.fecha}
              </Text>
            </View>
          )}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    width: '100%',
    paddingTop: 20,
  },
  movementItem: {
    padding: 10,
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
  },
  card: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    width: '90%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  itemTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'black',
  },
  itemDetails: {
    fontSize: 16,
    opacity: 0.9,
  },
  lowstock: {
    color: 'red',
    fontWeight: 'bold',
  },
});

export default ProductDetails;
