import React, { createContext, useState, useContext, useEffect } from "react";
import { supabase } from "./config/supabase";

const ProductContext = createContext();

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  // ตรวจสอบผู้ใช้เมื่อ Component ถูกโหลด
  useEffect(() => {
    // ตรวจสอบผู้ใช้ปัจจุบัน
    const getCurrentUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };

    getCurrentUser();

    // ฟังการเปลี่ยนแปลงสถานะ authentication
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user || null);
      }
    );

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  // ฟังก์ชันอัพโหลดภาพ
  const uploadImage = async (imageUri) => {
    try {
      if (!user) throw new Error("User not authenticated");

      const filename = `${user.id}/${Date.now()}.jpg`;
      console.log("Uploading image:", filename);

      // สร้าง FormData object
      const formData = new FormData();
      formData.append("file", {
        uri: imageUri,
        name: filename,
        type: "image/jpeg",
      });

      // อัพโหลดไฟล์ไปยัง Supabase Storage
      const { data, error } = await supabase.storage
        .from("posts") // เปลี่ยนเป็น "products" ถ้าต้องการ bucket เฉพาะ
        .upload(filename, formData, {
          contentType: "image/jpeg",
        });

      if (error) {
        console.error("Supabase upload error:", error);
        throw error;
      }

      // ดึง URL สาธารณะของภาพ
      const { data: { publicUrl } } = supabase.storage
        .from("posts")
        .getPublicUrl(filename);

      console.log("Image uploaded successfully:", publicUrl);
      return { url: publicUrl, error: null };
    } catch (error) {
      console.error("Error uploading image:", error);
      return { url: null, error };
    }
  };

  // ฟังก์ชันดึงข้อมูลสินค้าทั้งหมด
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("products")
        .select(`
          *,
          categories (name),
          product_images (image_url, alt_text, is_primary)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.log("Error fetching products:", error.message);
    } finally {
      setLoading(false);
    }
  };

  // ฟังก์ชันเพิ่มสินค้าใหม่ (พร้อมอัพโหลดภาพ)
  const addProduct = async (productData, imageUri = null) => {
    try {
      let imageUrl = productData.image_url;

      // ถ้ามีภาพใหม่ให้อัพโหลด
      if (imageUri) {
        const { url, error: uploadError } = await uploadImage(imageUri);
        if (uploadError) throw uploadError;
        imageUrl = url;
      }

      // เพิ่มสินค้าในฐานข้อมูล
      const productToInsert = {
        ...productData,
        image_url: imageUrl,
        created_at: new Date().toISOString(),
      };

      const { data, error } = await supabase
        .from("products")
        .insert([productToInsert])
        .select(`
          *,
          categories (name),
          product_images (image_url, alt_text, is_primary)
        `);

      if (error) throw error;

      // อัพเดท state
      setProducts(prevProducts => [data[0], ...prevProducts]);
      return { data: data[0], error: null };
    } catch (error) {
      console.log("Error adding product:", error.message);
      return { data: null, error };
    }
  };

  // ฟังก์ชันอัพเดทสินค้า (พร้อมอัพโหลดภาพใหม่ถ้ามี)
  const updateProduct = async (id, updatedFields, newImageUri = null) => {
    try {
      let imageUrl = updatedFields.image_url;

      // ถ้ามีภาพใหม่ให้อัพโหลด
      if (newImageUri) {
        const { url, error: uploadError } = await uploadImage(newImageUri);
        if (uploadError) throw uploadError;
        imageUrl = url;
      }

      // อัพเดทสินค้าในฐานข้อมูล
      const fieldsToUpdate = {
        ...updatedFields,
        ...(newImageUri && { image_url: imageUrl }),
      };

      const { data, error } = await supabase
        .from("products")
        .update(fieldsToUpdate)
        .eq("id", id)
        .select(`
          *,
          categories (name),
          product_images (image_url, alt_text, is_primary)
        `);

      if (error) throw error;

      // อัพเดท state
      setProducts(prevProducts => 
        prevProducts.map(p => (p.id === id ? data[0] : p))
      );
      return { data: data[0], error: null };
    } catch (error) {
      console.log("Error updating product:", error.message);
      return { data: null, error };
    }
  };

  // ฟังก์ชันลบสินค้า
  const deleteProduct = async (id) => {
    try {
      const { error } = await supabase.from("products").delete().eq("id", id);
      if (error) throw error;
      
      // อัพเดท state
      setProducts(prevProducts => prevProducts.filter(p => p.id !== id));
      return { error: null };
    } catch (error) {
      console.log("Error deleting product:", error.message);
      return { error };
    }
  };

  // ฟังก์ชันดึงข้อมูลสินค้าตาม ID
  const getProductById = async (id) => {
    try {
      const { data, error } = await supabase
        .from("products")
        .select(`
          *,
          categories (name),
          product_images (image_url, alt_text, is_primary)
        `)
        .eq("id", id)
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.log("Error fetching product by ID:", error.message);
      return { data: null, error };
    }
  };

  // ฟังก์ชันเพิ่มภาพสินค้าเพิ่มเติม
  const addProductImage = async (productId, imageUri, altText = "", isPrimary = false) => {
    try {
      const { url, error: uploadError } = await uploadImage(imageUri);
      if (uploadError) throw uploadError;

      const { data, error } = await supabase
        .from("product_images")
        .insert([{
          product_id: productId,
          image_url: url,
          alt_text: altText,
          is_primary: isPrimary
        }])
        .select();

      if (error) throw error;

      // รีเฟรชข้อมูลสินค้า
      await fetchProducts();
      return { data: data[0], error: null };
    } catch (error) {
      console.log("Error adding product image:", error.message);
      return { data: null, error };
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <ProductContext.Provider value={{ 
      products, 
      user,
      loading, 
      addProduct, 
      updateProduct, 
      deleteProduct, 
      fetchProducts,
      getProductById,
      uploadImage,
      addProductImage
    }}>
      {children}
    </ProductContext.Provider>
  );
};

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error("useProducts must be used within a ProductProvider");
  }
  return context;
};