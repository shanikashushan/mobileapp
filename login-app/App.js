import { StyleSheet, Text, View } from 'react-native';
import { AuthProvider } from './src/AuthContext';
import AppNavigator from './src/navigation/AppNavigator'

export default function App() {
  return (
    <AuthProvider>
      <View style={styles.container}>
        <AppNavigator />
      </View>
    </AuthProvider>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});