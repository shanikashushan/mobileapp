// screens/HomeScreen.js
import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";
import { Appbar, Card, Button, Badge, IconButton } from "react-native-paper";
import { useAuth } from "../AuthContext";
import { supabase } from "../config/supabase"; // import supabase client

const HomeScreen = ({ navigation }) => {
  const { signOut, user } = useAuth(); // user จาก context
  const [cart, setCart] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // ดึงข้อมูลสินค้าจาก Supabase
  const fetchProducts = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: true });

    if (error) console.log("Error fetching products:", error.message);
    else setProducts(data);

    setLoading(false);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const addToCart = (item) => {
    setCart([...cart, item]);
  };

  const handleLogout = async () => {
    await signOut();
  };

  return (
    <View style={styles.container}>
      {/* App Bar */}
      <Appbar.Header style={styles.header}>
        <Appbar.Content title="ร้านเสน่ห์ชา" />
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <IconButton icon="cart" iconColor="#fff" onPress={() => { }} />
          {cart.length > 0 && <Badge style={styles.badge}>{cart.length}</Badge>}
          <Appbar.Action icon="logout" onPress={handleLogout} iconColor="#fff" />
        </View>
      </Appbar.Header>

      {/* Banner */}
      <View style={styles.banner}>
        <Text style={styles.bannerText}>เมนูแนะนำ</Text>
      </View>

      {/* ปุ่มไปหน้าแอดมิน (แสดงเฉพาะ admin) */}
      {user?.role === "admin" && (
        <Button
          mode="contained"
          style={{ margin: 10 }}
          onPress={() => navigation.navigate("AdminProducts")}
        >
          จัดการสินค้า (Admin)
        </Button>
      )}

      {/* Product List */}
      {loading ? (
        <Text style={{ textAlign: "center", marginTop: 20 }}>กำลังโหลด...</Text>
      ) : (
        <FlatList
          data={products}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.productList}
          renderItem={({ item }) => (
            <Card style={styles.card}>
              <Card.Cover source={{ uri: item.image_url }} />
              <Card.Content>
                <Text style={styles.productName}>{item.name}</Text>
                <Text style={styles.productPrice}>{item.price} บาท</Text>
              </Card.Content>
              <Card.Actions>
                <Button mode="contained" onPress={() => addToCart(item)}>
                  เพิ่มลงรถเข็น
                </Button>
              </Card.Actions>
            </Card>
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f9f9f9" },
  header: { backgroundColor: "#6200ea" },
  badge: { position: "absolute", top: 5, right: 55 },
  banner: { backgroundColor: "#6200ea", padding: 20, alignItems: "center" },
  bannerText: { fontSize: 28, fontWeight: "bold", color: "#fff" },
  productList: { padding: 10 },
  card: { marginBottom: 15 },
  productName: { fontSize: 18, marginTop: 8 },
  productPrice: { fontSize: 16, color: "#666", marginBottom: 8 },
});

export default HomeScreen;
