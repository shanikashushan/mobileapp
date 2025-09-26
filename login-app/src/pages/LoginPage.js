import React from "react";
import { View, StyleSheet } from "react-native";
import LoginForm from "../components/LoginForm";

const LoginPage = () => {
  return (
    <View style={styles.container}>
      <LoginForm />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default LoginPage;
