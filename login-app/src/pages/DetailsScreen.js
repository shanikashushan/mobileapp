import React from "react";
import { View, Text, Button, Image, StyleSheet, Alert } from "react-native";
import { useCart } from "../CartContext";

export default function DetailsScreen({ route }) {
  const { item } = route.params;
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    addToCart(item);
    Alert.alert("เพิ่มสินค้า", `${item.name} ถูกเพิ่มเข้าตะกร้าแล้ว`);
  };

  return (
    <View style={styles.container}>
      {item.image_url && (
        <Image source={{ uri: item.image_url }} style={styles.image} />
      )}
      <Text style={styles.name}>{item.name}</Text>
      <Text style={styles.price}>{item.price} บาท</Text>
      <Text style={styles.description}>{item.description}</Text>

      <Button title="ใส่ตะกร้า" onPress={handleAddToCart} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  image: { width: "100%", height: 200, marginBottom: 20 },
  name: { fontSize: 22, fontWeight: "bold", marginBottom: 10 },
  price: { fontSize: 18, marginBottom: 10 },
  description: { fontSize: 16, marginBottom: 20 },
});
