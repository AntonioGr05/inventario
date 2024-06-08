import {useState} from 'react';
import {Button, Text, TextInput, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import LocalDB from '../persistance/localdb';

export default function DisStock({route, navigation}: any) {
  const [cantidad, setCantidad] = useState<string>('0');
  const {productId, productName, currentStock} = route.params || {
    productId: undefined,
    productName: undefined,
    currentStock: undefined,
  };

  const handleGuardar = async () => {
    if (cantidad < currentStock) {
      if (
        !route.params ||
        !route.params.productId ||
        !route.params.productName ||
        !route.params.currentStock
      ) {
        console.error('Missing productId or productName in route params');
        return;
      }

      const productId = route.params.productId;
      const productName = route.params.productName;
      const currentStock = route.params.currentStock;

      // Guardar la cantidad ingresada en la tabla maxstock
      const db = await LocalDB.connect();
      db.transaction(tx => {
        tx.executeSql(
          'INSERT INTO minstock (id_producto, nombre, cantidad) VALUES (?, ?, ?)',
          [productId, productName, cantidad],
          () => console.log('Guardado en minstock'),
          error => console.error({error}),
        );
      });

      // Actualizar el campo currentStock en la tabla productos
      db.transaction(tx => {
        tx.executeSql(
          'UPDATE productos SET currentStock = currentStock - ? WHERE id = ?',
          [cantidad, productId],
          () => {
            console.log('Actualizado currentStock en productos');
            navigation.goBack();
          },
          error => console.error({error}),
        );
      });
    }
  };

  return (
    <SafeAreaView>
      <View>
        <Text>VISTA DISMINUIR STOCK</Text>
        {productName && <Text>Producto: {productName}</Text>}
        {productId && <Text>ID del Producto: {productId}</Text>}
        {currentStock && <Text>Cantidad actual: {currentStock}</Text>}
        <TextInput
          placeholder="Cantidad a disminuir"
          placeholderTextColor={'#828894'}
          onChangeText={setCantidad}
        />
        <Button title="Guardar" onPress={handleGuardar} />
      </View>
    </SafeAreaView>
  );
}
