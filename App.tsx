import React from 'react';
import {
  NavigationContainer,
  NavigationProp,
  useNavigation,
} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';

import Home from './app/screens/Home';
import Login from './app/screens/Login';
import ProductDetails, {
  Params as ProductDetailsParams,
} from './app/screens/productDetails';
import ProductAdd from './app/screens/ProductAdd';
import {Button} from 'react-native';

const Stack = createStackNavigator<RootStackParamList>();

export type RootStackParamList = {
  Login: undefined;
  Home: undefined;
  ProductDetails: ProductDetailsParams;
  ProductAdd: undefined;
};

/* creamos el archivo app/screens/Home.tsx */
function App(): React.JSX.Element {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen
          name="Login"
          component={Login}
          options={{
            headerShown: true,
            headerStyle: {backgroundColor: '#0ff040'},
          }}
        />
        <Stack.Screen
          name="Home"
          component={Home}
          options={{
            headerShown: true,
            headerStyle: {backgroundColor: 'blue'},
          }}
        />
        <Stack.Screen
          name="ProductDetails"
          component={ProductDetails}
          options={{
            headerShown: true,
            headerStyle: {backgroundColor: 'red'},
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
