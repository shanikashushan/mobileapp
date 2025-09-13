import React from "react";
import { TextInput, Button, Card, Text } from "react-native-paper";
import { View,StyleSheet } from "react-native";
import { useAuth } from "../AuthContext";
import { useState } from "react";


const LoginForm = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("") ;
    const {login} = useAuth();




    const handleSubmit = () => {
      login(email, password);

    };



    return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Text variant="titleLarge">Login</Text>
          <TextInput
            label="Email"
            mode="outlined"
            keyboardType="email-address"
            autoCapitalize="none"
            style={{ marginBottom: 16 }}
            value={email}
            onChangeText={setEmail}
          />

          <TextInput
            label="Password"
            mode="outlined"
            secureTextEntry
            style={{ marginBottom: 16 }}
            value={password}
            onChangeText={setPassword}
          />
          <Button mode="contained" onPress={handleSubmit}>
            Submit
          </Button>
        </Card.Content>
      </Card>
    </View>
  );
};
 
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  card: {
    width: "100%",
    maxWidth: 400,
  },
});

export default LoginForm;
 