// screens/AdminProductsScreen.js
import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, FlatList, Alert, TextInput, Modal } from "react-native";
import { Appbar, Card, Button, IconButton } from "react-native-paper";
import { supabase } from "../config/supabase";
import { useAuth } from "../AuthContext";

const AdminProductsScreen = () => {
    const { signOut } = useAuth();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalVisible, setModalVisible] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [form, setForm] = useState({ name: "", price: "", image_url: "", category_id: "" });

    // ดึงข้อมูลสินค้า
    const fetchProducts = async () => {
        setLoading(true);
        const { data, error } = await supabase.from("products").select("*").order("created_at", { ascending: true });
        if (error) console.log(error);
        else setProducts(data);
        setLoading(false);
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const handleLogout = async () => {
        await signOut();
    };

    // ฟังก์ชันเพิ่ม/แก้ไข
    const saveProduct = async () => {
        const { name, price, image_url, category_id } = form;
        if (!name || !price) return Alert.alert("กรุณากรอกชื่อและราคา");

        if (editingProduct) {
            // อัพเดต
            const { error } = await supabase
                .from("products")
                .update({ name, price: parseFloat(price), image_url, category_id: parseInt(category_id) || null })
                .eq("id", editingProduct.id);
            if (error) Alert.alert("Error updating product", error.message);
        } else {
            // เพิ่ม
            const { error } = await supabase
                .from("products")
                .insert([{ name, price: parseFloat(price), image_url, category_id: parseInt(category_id) || null }]);
            if (error) Alert.alert("Error adding product", error.message);
        }
        setModalVisible(false);
        setForm({ name: "", price: "", image_url: "", category_id: "" });
        setEditingProduct(null);
        fetchProducts();
    };

    // ฟังก์ชันลบ
    const deleteProduct = async (id) => {
        Alert.alert("ยืนยันการลบ?", "คุณแน่ใจว่าจะลบสินค้านี้?", [
            { text: "ยกเลิก" },
            {
                text: "ลบ",
                style: "destructive",
                onPress: async () => {
                    const { error } = await supabase.from("products").delete().eq("id", id);
                    if (error) Alert.alert("Error deleting product", error.message);
                    else fetchProducts();
                },
            },
        ]);
    };

    // แก้ไขสินค้า
    const editProduct = (product) => {
        setEditingProduct(product);
        setForm({
            name: product.name,
            price: product.price.toString(),
            image_url: product.image_url || "",
            category_id: product.category_id ? product.category_id.toString() : "",
        });
        setModalVisible(true);
    };

    return (
        <View style={styles.container}>
            {/* App Bar */}
            <Appbar.Header style={styles.header}>
                <Appbar.Content title="จัดการสินค้า" />
                <Appbar.Action icon="logout" onPress={handleLogout} iconColor="#fff" />
            </Appbar.Header>

            <Button mode="contained" onPress={() => setModalVisible(true)} style={{ margin: 10 }}>
                เพิ่มสินค้าใหม่
            </Button>

            {loading ? (
                <Text style={{ textAlign: "center", marginTop: 20 }}>กำลังโหลด...</Text>
            ) : (
                <FlatList
                    data={products}
                    keyExtractor={(item) => item.id.toString()}
                    contentContainerStyle={{ padding: 10 }}
                    renderItem={({ item }) => (
                        <Card style={styles.card}>
                            <Card.Cover source={{ uri: item.image_url }} />
                            <Card.Content>
                                <Text style={styles.productName}>{item.name}</Text>
                                <Text style={styles.productPrice}>{item.price} บาท</Text>
                            </Card.Content>
                            <Card.Actions>
                                <Button onPress={() => editProduct(item)}>แก้ไข</Button>
                                <Button onPress={() => deleteProduct(item.id)} color="red">
                                    ลบ
                                </Button>
                            </Card.Actions>
                        </Card>
                    )}
                />
            )}

            {/* Modal สำหรับเพิ่ม/แก้ไข */}
            <Modal visible={modalVisible} animationType="slide" transparent={true}>
                <View style={styles.modalBackground}>
                    <View style={styles.modalContainer}>
                        <TextInput
                            placeholder="ชื่อสินค้า"
                            value={form.name}
                            onChangeText={(text) => setForm({ ...form, name: text })}
                            style={styles.input}
                        />
                        <TextInput
                            placeholder="ราคา"
                            value={form.price}
                            keyboardType="numeric"
                            onChangeText={(text) => setForm({ ...form, price: text })}
                            style={styles.input}
                        />
                        <TextInput
                            placeholder="URL รูปภาพ"
                            value={form.image_url}
                            onChangeText={(text) => setForm({ ...form, image_url: text })}
                            style={styles.input}
                        />
                        <TextInput
                            placeholder="Category ID"
                            value={form.category_id}
                            keyboardType="numeric"
                            onChangeText={(text) => setForm({ ...form, category_id: text })}
                            style={styles.input}
                        />
                        <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 10 }}>
                            <Button mode="contained" onPress={saveProduct}>
                                {editingProduct ? "บันทึกการแก้ไข" : "เพิ่มสินค้า"}
                            </Button>
                            <Button mode="outlined" onPress={() => { setModalVisible(false); setEditingProduct(null); setForm({ name: "", price: "", image_url: "", category_id: "" }); }}>
                                ยกเลิก
                            </Button>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#f9f9f9" },
    header: { backgroundColor: "#6200ea" },
    card: { marginBottom: 15 },
    productName: { fontSize: 18, marginTop: 8 },
    productPrice: { fontSize: 16, color: "#666", marginBottom: 8 },
    modalBackground: { flex: 1, justifyContent: "center", backgroundColor: "rgba(0,0,0,0.5)" },
    modalContainer: { backgroundColor: "#fff", margin: 20, padding: 20, borderRadius: 10 },
    input: { borderWidth: 1, borderColor: "#ccc", padding: 10, marginVertical: 5, borderRadius: 5 },
});

export default AdminProductsScreen;
