import {NavigationProp, useNavigation} from '@react-navigation/native';
import React, {useState} from 'react';
import {Button, SafeAreaView, Text, TextInput, View} from 'react-native';
import {RootStackParamList} from '../../App';
import LocalDB from '../persistance/localdb';

export default function ProductAdd(): React.JSX.Element {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [nombre, setNombre] = useState<String>('');
  const [precio, setPrecio] = useState<String>('0');

  const btnGuardarOnPress = async () => {
    const db = await LocalDB.connect();
    db.transaction(tx => {
      tx.executeSql('INSERT INTO productos (nombre, precio) VALUES (?, ?)', [
        nombre,
        precio,
      ]);
      navigation.goBack();
    });
  };

  return (
    <SafeAreaView>
      <View>
        <Text>Guardar materiales</Text>
        <TextInput
          placeholder="Nombre"
          placeholderTextColor={'#828894'}
          onChangeText={u => setNombre(u)}
        />
        <TextInput
          placeholder="Precio"
          placeholderTextColor={'#828894'}
          onChangeText={p => setPrecio(p)}
        />
        <Button title="Guardar" onPress={btnGuardarOnPress} />
      </View>
    </SafeAreaView>
  );
}
