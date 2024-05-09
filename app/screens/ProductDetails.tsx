/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {SafeAreaView, Text, StyleSheet, View} from 'react-native';
import {Product} from '../models/product';
import {useRoute} from '@react-navigation/native';

function ProductDetails(): React.JSX.Element {
  const route = useRoute<{
    params: any;
    product: Product;
    key: string;
    name: string;
  }>();
  const product: Product = route.params.product;

  if (!product) {
    return (
      <SafeAreaView style={styles.container}>
        <Text>No product details available</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.card}>
        <View style={{flexDirection: 'column'}}>
          <Text style={styles.itemTitle}>{product.nombre}</Text>
          <Text style={styles.itemDetails}>Precio: ${product.precio}</Text>
        </View>
        <View style={{flexDirection: 'column'}}>
          <Text
            style={[
              styles.itemDetails,
              product.currentStock < product.minStock ? styles.lowstock : null,
            ]}>
            Stock: {product.currentStock}/{product.maxStock}
          </Text>
          <Text
            style={[
              styles.itemDetails,
              product.currentStock < product.minStock ? styles.lowstock : null,
            ]}>
            Minimo: {product.minStock}
          </Text>
        </View>
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
    flexDirection: 'row',
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
