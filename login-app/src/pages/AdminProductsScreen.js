import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Button, FlatList, Alert, StyleSheet } from "react-native";
import { useProducts } from "../ProductContext";
import { supabase } from "../config/supabase";

export default function AdminProductsScreen() {
  const { products, addProduct, deleteProduct, loading, fetchProducts } = useProducts();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [categories, setCategories] = useState([]);

  // ดึงหมวดหมู่จาก categories table
  useEffect(() => {
    const fetchCategories = async () => {
      const { data, error } = await supabase.from("categories").select("*");
      if (error) console.log("Error fetching categories:", error.message);
      else setCategories(data);
    };
    fetchCategories();
  }, []);

  const handleAdd = async () => {
    if (!name || !price || !categoryId) {
      return Alert.alert("Error", "กรุณากรอกชื่อ ราคา และเลือกหมวดหมู่");
    }

    const product = {
      name,
      description,
      price: parseFloat(price),
      image_url: imageUrl,
      category_id: parseInt(categoryId),
    };

    await addProduct(product);

    // รีเซ็ตฟอร์ม
    setName("");
    setDescription("");
    setPrice("");
    setImageUrl("");
    setCategoryId("");
  };

  const handleDelete = (id, name) => {
    Alert.alert(
      "ยืนยันลบ",
      `คุณต้องการลบ ${name} ใช่หรือไม่?`,
      [
        { text: "ยกเลิก" },
        { text: "ลบ", onPress: () => deleteProduct(id) }
      ]
    );
  };

  if (loading) return <Text style={{ textAlign: "center", marginTop: 20 }}>กำลังโหลด...</Text>;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>เพิ่มสินค้า</Text>

      <TextInput
        placeholder="ชื่อสินค้า"
        value={name}
        onChangeText={setName}
        style={styles.input}
      />
      <TextInput
        placeholder="รายละเอียดสินค้า"
        value={description}
        onChangeText={setDescription}
        style={styles.input}
      />
      <TextInput
        placeholder="ราคา"
        value={price}
        onChangeText={setPrice}
        keyboardType="numeric"
        style={styles.input}
      />
      <TextInput
        placeholder="URL รูปภาพ"
        value={imageUrl}
        onChangeText={setImageUrl}
        style={styles.input}
      />
      <TextInput
        placeholder="Category ID"
        value={categoryId.toString()}
        onChangeText={setCategoryId}
        keyboardType="numeric"
        style={styles.input}
      />
      <Button title="เพิ่มสินค้า" onPress={handleAdd} />

      <Text style={styles.subtitle}>รายการสินค้า</Text>
      <FlatList
        data={products}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text>{item.name} - {item.price} บาท</Text>
            <Button
              title="ลบ"
              color="red"
              onPress={() => handleDelete(item.id, item.name)}
            />
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, marginTop: 50 },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 20 },
  subtitle: { fontSize: 18, fontWeight: "bold", marginTop: 20, marginBottom: 10 },
  input: { borderWidth: 1, borderRadius: 5, padding: 10, marginBottom: 10 },
  item: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 10 },
});
