import { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, Image, Alert } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/services/firebase";
import { useCartStore } from "@/store/cart";
import type { MenuItem, CartItem } from "@/types";

export default function ItemDetailScreen() {
  const router = useRouter();
  const { id, restaurantId } = useLocalSearchParams<{ id: string; restaurantId: string }>();
  const { addItem, restaurantId: currentRestId, clear } = useCartStore();
  const [qty, setQty] = useState(1);
  const [notes, setNotes] = useState("");
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});

  const { data: item, isLoading } = useQuery({
    queryKey: ["menu-item", restaurantId, id],
    queryFn: async () => {
      const snap = await getDoc(doc(db, `restaurants/${restaurantId}/menu`, id));
      return { id: snap.id, ...snap.data() } as MenuItem;
    },
  });

  if (isLoading) {
    return <View style={styles.center}><Text style={styles.loading}>กำลังโหลด...</Text></View>;
  }

  if (!item) {
    return <View style={styles.center}><Text>ไม่พบเมนู</Text></View>;
  }

  const calculatePrice = () => {
    let total = item.price;
    if (item.options) {
      for (const opt of item.options) {
        const selected = selectedOptions[opt.name];
        if (selected) {
          const choice = opt.choices.find((c) => c.label === selected);
          if (choice) total += choice.priceAdd;
        }
      }
    }
    return total * qty;
  };

  const handleAddToCart = () => {
    if (currentRestId && currentRestId !== restaurantId) {
      Alert.alert(
        "เปลี่ยนร้าน?",
        "คุณมีรายการในรถเข็นจากร้านอื่น ต้องการเคลียร์แล้วเริ่มใหม่ไหม?",
        [
          { text: "ยกเลิก" },
          {
            text: "เคลียร์และเพิ่ม",
            onPress: () => {
              clear();
              doAddToCart();
            },
          },
        ]
      );
      return;
    }
    doAddToCart();
  };

  const doAddToCart = () => {
    const optionsArray = Object.entries(selectedOptions).map(([name, choice]) => {
      const opt = item.options?.find((o) => o.name === name);
      const choiceData = opt?.choices.find((c) => c.label === choice);
      return { name, choice, priceAdd: choiceData?.priceAdd || 0 };
    });

    const cartItem: CartItem = {
      itemId: item.id,
      name: item.name,
      price: item.price,
      qty,
      options: optionsArray,
      notes: notes || undefined,
      imageUrl: item.imageUrl || undefined,
    };

    addItem(cartItem, restaurantId);
    Alert.alert("เพิ่มลงรถเข็นแล้ว", `${item.name} ${qty} ชิ้น — ${calculatePrice()} บาท`, [
      { text: "ดูรถเข็น", onPress: () => router.push("/cart") },
      { text: "สั่งต่อ", onPress: () => router.back() },
    ]);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backBtn}>‹ กลับ</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.body}>
        {item.imageUrl ? (
          <Image source={{ uri: item.imageUrl }} style={styles.heroImage} />
        ) : (
          <View style={[styles.heroImage, styles.heroPlaceholder]}>
            <Text style={styles.heroPlaceholderText}>📷</Text>
          </View>
        )}

        <View style={styles.itemInfo}>
          <Text style={styles.itemName}>{item.name}</Text>
          <Text style={styles.itemDesc}>{item.description}</Text>
          <Text style={styles.itemPrice}>{item.price} บาท</Text>
        </View>

        {item.options?.map((opt) => (
          <View key={opt.name} style={styles.optionSection}>
            <Text style={styles.optionTitle}>{opt.name}</Text>
            {opt.choices.map((choice) => {
              const isSelected = selectedOptions[opt.name] === choice.label;
              return (
                <TouchableOpacity
                  key={choice.label}
                  style={[styles.optionChoice, isSelected && styles.optionSelected]}
                  onPress={() =>
                    setSelectedOptions((prev) => ({ ...prev, [opt.name]: choice.label }))
                  }
                >
                  <Text style={styles.optionLabel}>{choice.label}</Text>
                  <Text style={styles.optionPrice}>
                    {choice.priceAdd > 0 ? `+${choice.priceAdd} ฿` : "ฟรี"}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        ))}

        <View style={styles.optionSection}>
          <Text style={styles.optionTitle}>หมายเหตุ</Text>
          <TextInput
            style={styles.notesInput}
            placeholder="เช่น ไม่ใส่ผัก, เพิ่มน้ำ"
            value={notes}
            onChangeText={setNotes}
            multiline
          />
        </View>

        <View style={styles.qtySection}>
          <Text style={styles.optionTitle}>จำนวน</Text>
          <View style={styles.qtyRow}>
            <TouchableOpacity onPress={() => setQty(Math.max(1, qty - 1))} style={styles.qtyBtn}>
              <Text style={styles.qtyBtnText}>−</Text>
            </TouchableOpacity>
            <Text style={styles.qtyText}>{qty}</Text>
            <TouchableOpacity onPress={() => setQty(qty + 1)} style={styles.qtyBtn}>
              <Text style={styles.qtyBtnText}>+</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <View>
          <Text style={styles.footerLabel}>รวม</Text>
          <Text style={styles.footerPrice}>{calculatePrice()} บาท</Text>
        </View>
        <TouchableOpacity style={styles.addToCartBtn} onPress={handleAddToCart}>
          <Text style={styles.addToCartText}>เพิ่มลงรถเข็น</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8F9FA" },
  header: { padding: 16, paddingTop: 50, backgroundColor: "#FF6B35" },
  backBtn: { color: "#fff", fontSize: 16 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  loading: { fontSize: 16, color: "#6C757D" },
  body: { flex: 1 },
  heroImage: { width: "100%", height: 220 },
  heroPlaceholder: { backgroundColor: "#F0F0F0", alignItems: "center", justifyContent: "center" },
  heroPlaceholderText: { fontSize: 48, color: "#CCC" },
  itemInfo: { padding: 16, backgroundColor: "#fff" },
  itemName: { fontSize: 22, fontWeight: "bold", color: "#1A1A2E" },
  itemDesc: { fontSize: 15, color: "#6C757D", marginTop: 6, lineHeight: 22 },
  itemPrice: { fontSize: 20, fontWeight: "bold", color: "#FF6B35", marginTop: 10 },
  optionSection: { marginTop: 12, padding: 16, backgroundColor: "#fff" },
  optionTitle: { fontSize: 16, fontWeight: "bold", color: "#1A1A2E", marginBottom: 12 },
  optionChoice: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: "#F0F0F0" },
  optionSelected: { backgroundColor: "#FFF5F0", marginHorizontal: -8, paddingHorizontal: 8, borderRadius: 8 },
  optionLabel: { fontSize: 15, color: "#1A1A2E" },
  optionPrice: { fontSize: 14, color: "#FF6B35", fontWeight: "500" },
  notesInput: { borderWidth: 1, borderColor: "#E0E0E0", borderRadius: 8, padding: 12, fontSize: 15, minHeight: 60 },
  qtySection: { marginTop: 12, padding: 16, backgroundColor: "#fff", flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  qtyRow: { flexDirection: "row", alignItems: "center" },
  qtyBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: "#F0F0F0", alignItems: "center", justifyContent: "center" },
  qtyBtnText: { fontSize: 22, color: "#1A1A2E" },
  qtyText: { fontSize: 18, fontWeight: "bold", marginHorizontal: 20 },
  footer: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", padding: 16, backgroundColor: "#fff", borderTopWidth: 1, borderTopColor: "#E0E0E0" },
  footerLabel: { fontSize: 13, color: "#6C757D" },
  footerPrice: { fontSize: 22, fontWeight: "bold", color: "#FF6B35" },
  addToCartBtn: { backgroundColor: "#FF6B35", borderRadius: 12, paddingVertical: 14, paddingHorizontal: 28 },
  addToCartText: { color: "#fff", fontSize: 17, fontWeight: "bold" },
});
