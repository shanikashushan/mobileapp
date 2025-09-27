// screens/HomeScreen.js
import React from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";
import { Appbar, Card, Button, Badge, IconButton } from "react-native-paper";
import { useAuth } from "../AuthContext";
import { useProducts } from "../ProductContext"; 
import { useCart } from "../CartContext";

const HomeScreen = ({ navigation }) => {
  const { signOut, user } = useAuth(); 
  const { products, loading } = useProducts(); 
  const { cartItems, addToCart } = useCart(); // Use the cart context

  const handleLogout = async () => {
    await signOut();
  };

  return (
    <View style={styles.container}>
      {/* App Bar */}
      <Appbar.Header style={styles.header}>
        <Appbar.Content title="Flower shop" />
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <IconButton 
            icon="cart" 
            iconColor="#ad0606ff" 
            onPress={() => navigation.navigate("Cart")} 
          />
          {cartItems.length > 0 && (
            <Badge style={styles.badge}>{cartItems.length}</Badge>
          )}
          <Appbar.Action icon="logout" onPress={handleLogout} iconColor="#c21a1aff" />
        </View>
      </Appbar.Header>

      {/* Banner */}
      <View style={styles.banner}>
        <Text style={styles.bannerText}>สินค้าแนะนำ</Text>
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
              <Card.Cover source={{ uri: item.image_url ?? "https://placehold.co/300" }} />
              <Card.Content>
                <Text style={styles.productName}>{item.name}</Text>
                <Text style={styles.productPrice}>{item.price} บาท</Text>
                {/* แสดงหมวดหมู่ด้วย */}
                <Text style={styles.productCategory}>
                  หมวดหมู่: {item.categories?.name ?? "สินค้าขายดี"}
                </Text>
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
  container: { flex: 1, backgroundColor: "#fdd1ffff" },
  header: { backgroundColor: "#ffcfdfff" },
  badge: { position: "absolute", top: 5, right: 55 },
  banner: { backgroundColor: "#FFF0F5", padding: 15, alignItems: "center" },
  bannerText: { fontSize: 30, fontWeight: "bold", color: "#200207ff" },
  productList: { padding: 10 },
  card: { marginBottom: 15 },
  productName: { fontSize: 20, marginTop: 8 },
  productPrice: { fontSize: 20, color: "#301c1cff", marginBottom: 4 },
  productCategory: { fontSize: 15, color: "#999" },
});

export default HomeScreen;