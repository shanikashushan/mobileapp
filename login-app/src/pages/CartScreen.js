// screens/CartScreen.js
import React from "react";
import { View, Text, FlatList, StyleSheet, Alert, ScrollView } from "react-native";
import { Card, Button, IconButton, Badge } from "react-native-paper";
import { useCart } from "../CartContext";

export default function CartScreen({ navigation }) {
  const { cartItems, removeFromCart, clearCart, getTotalPrice, updateQuantity } = useCart();

  const handleRemove = (id, name) => {
    Alert.alert(
      "ยืนยันลบ",
      `คุณต้องการลบ ${name} ออกจากตะกร้าหรือไม่?`,
      [
        { text: "ยกเลิก", style: "cancel" },
        { text: "ลบ", onPress: () => removeFromCart(id), style: "destructive" }
      ]
    );
  };

  const handleQuantityChange = (item, change) => {
    const newQuantity = item.quantity + change;
    if (newQuantity < 1) {
      handleRemove(item.id, item.name);
    } else {
      updateQuantity(item.id, newQuantity);
    }
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      Alert.alert("ตะกร้าว่าง", "กรุณาเพิ่มสินค้าเข้าตะกร้าก่อนชำระเงิน");
      return;
    }
    
    Alert.alert(
      "ยืนยันการชำระเงิน",
      `รวมทั้งหมด ${getTotalPrice()} บาท`,
      [
        { text: "ยกเลิก", style: "cancel" },
        { 
          text: "ชำระเงิน", 
          onPress: () => {
            Alert.alert("ชำระเงินสำเร็จ", `ขอบคุณสำหรับการสั่งซื้อ! รวมทั้งหมด ${getTotalPrice()} บาท`);
            clearCart();
          }
        }
      ]
    );
  };

  const handleContinueShopping = () => {
    navigation.navigate("Home");
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <IconButton 
          icon="arrow-left" 
          size={24} 
          onPress={() => navigation.goBack()}
          iconColor="#fff"
        />
        <Text style={styles.headerTitle}>ตะกร้าสินค้า</Text>
        <View style={styles.headerRight}>
          {cartItems.length > 0 && (
            <Badge style={styles.badge}>{cartItems.length}</Badge>
          )}
          <IconButton 
            icon="delete-empty" 
            size={24} 
            onPress={() => {
              if (cartItems.length > 0) {
                Alert.alert(
                  "ลบทั้งหมด",
                  "คุณต้องการลบสินค้าทั้งหมดออกจากตะกร้าหรือไม่?",
                  [
                    { text: "ยกเลิก", style: "cancel" },
                    { text: "ลบทั้งหมด", onPress: () => clearCart(), style: "destructive" }
                  ]
                );
              }
            }}
            iconColor="#fff"
          />
        </View>
      </View>

      <ScrollView style={styles.scrollView}>
        {cartItems.length === 0 ? (
          <View style={styles.emptyCart}>
            <IconButton 
              icon="cart-off" 
              size={80} 
              iconColor="#ccc"
            />
            <Text style={styles.emptyText}>ไม่มีสินค้าในตะกร้า</Text>
            <Button 
              mode="contained" 
              onPress={handleContinueShopping}
              style={styles.continueButton}
              labelStyle={styles.continueButtonText}
            >
              ไปช้อปปิ้งต่อ
            </Button>
          </View>
        ) : (
          <>
            {/* Cart Items */}
            <View style={styles.itemsContainer}>
              {cartItems.map((item) => (
                <Card key={item.id} style={styles.cartItem}>
                  <Card.Content style={styles.itemContent}>
                    <View style={styles.itemImageContainer}>
                      <Card.Cover 
                        source={{ uri: item.image_url ?? "https://placehold.co/300" }} 
                        style={styles.itemImage}
                      />
                    </View>
                    
                    <View style={styles.itemDetails}>
                      <Text style={styles.itemName} numberOfLines={2}>{item.name}</Text>
                      <Text style={styles.itemPrice}>{item.price} บาท</Text>
                      
                      <View style={styles.quantityContainer}>
                        <Text style={styles.quantityLabel}>จำนวน:</Text>
                        <View style={styles.quantityControls}>
                          <IconButton 
                            icon="minus" 
                            size={20} 
                            onPress={() => handleQuantityChange(item, -1)}
                            style={styles.quantityButton}
                          />
                          <Text style={styles.quantityText}>{item.quantity}</Text>
                          <IconButton 
                            icon="plus" 
                            size={20} 
                            onPress={() => handleQuantityChange(item, 1)}
                            style={styles.quantityButton}
                          />
                        </View>
                      </View>
                      
                      <Text style={styles.itemTotal}>
                        รวม: {item.price * item.quantity} บาท
                      </Text>
                    </View>
                    
                    <IconButton 
                      icon="delete" 
                      size={24} 
                      onPress={() => handleRemove(item.id, item.name)}
                      iconColor="#ff4444"
                      style={styles.deleteButton}
                    />
                  </Card.Content>
                </Card>
              ))}
            </View>

            {/* Summary */}
            <Card style={styles.summaryCard}>
              <Card.Content>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>จำนวนสินค้า:</Text>
                  <Text style={styles.summaryValue}>{cartItems.reduce((total, item) => total + item.quantity, 0)} ชิ้น</Text>
                </View>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>รวมทั้งหมด:</Text>
                  <Text style={styles.totalPrice}>{getTotalPrice()} บาท</Text>
                </View>
              </Card.Content>
            </Card>
          </>
        )}
      </ScrollView>

      {/* Checkout Button */}
      {cartItems.length > 0 && (
        <View style={styles.footer}>
          <Button 
            mode="contained" 
            onPress={handleCheckout}
            style={styles.checkoutButton}
            labelStyle={styles.checkoutButtonText}
          >
            ชำระเงิน {getTotalPrice()} บาท
          </Button>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8f9fa" },
  header: {
    backgroundColor: "#ff6b9d",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 10,
    paddingTop: 40,
    paddingBottom: 15,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
  },
  badge: {
    backgroundColor: "#ff4444",
    position: "absolute",
    top: -5,
    right: -5,
    zIndex: 1,
  },
  scrollView: { flex: 1, padding: 15 },
  emptyCart: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 100,
  },
  emptyText: {
    fontSize: 18,
    color: "#666",
    marginBottom: 20,
  },
  continueButton: {
    backgroundColor: "#ff6b9d",
    borderRadius: 25,
    paddingHorizontal: 30,
  },
  continueButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  itemsContainer: {
    marginBottom: 20,
  },
  cartItem: {
    marginBottom: 15,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  itemContent: {
    flexDirection: "row",
    padding: 10,
  },
  itemImageContainer: {
    marginRight: 15,
  },
  itemImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  itemDetails: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  itemPrice: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
  },
  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  quantityLabel: {
    fontSize: 14,
    color: "#666",
    marginRight: 10,
  },
  quantityControls: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 20,
  },
  quantityButton: {
    margin: 0,
    width: 30,
    height: 30,
  },
  quantityText: {
    fontSize: 16,
    fontWeight: "bold",
    minWidth: 30,
    textAlign: "center",
  },
  itemTotal: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#ff6b9d",
  },
  deleteButton: {
    margin: 0,
    alignSelf: "flex-start",
  },
  summaryCard: {
    backgroundColor: "#fff",
    marginBottom: 20,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  summaryLabel: {
    fontSize: 16,
    color: "#666",
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: "bold",
  },
  totalPrice: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#ff6b9d",
  },
  footer: {
    padding: 15,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  checkoutButton: {
    backgroundColor: "#ff6b9d",
    borderRadius: 25,
    paddingVertical: 10,
  },
  checkoutButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});