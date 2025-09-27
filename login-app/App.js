// App.js
import React from 'react';
import { StyleSheet } from 'react-native';
import { AuthProvider } from './src/AuthContext';
import AppNavigator from './src/navigation/AppNavigator';
import { ProductProvider } from './src/ProductContext';
import { CartProvider } from './src/CartContext';
import CartScreen from './src/pages/CartScreen';
import HomeScreen from './src/pages/HomeScreen';  

export default function App() {
  return (
    <AuthProvider>
      <ProductProvider>
        <CartProvider>
          <AppNavigator/>
        </CartProvider>
      </ProductProvider>
    </AuthProvider>
  );
}



const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
