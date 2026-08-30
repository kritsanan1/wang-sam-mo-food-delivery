import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from "react-native";
import { useRouter } from "expo-router";
import { useCartStore } from "@/store/cart";
import { CartItem } from "@/types";

export default function CartScreen() {
  const router = useRouter();
  const { items, removeItem, updateQty, getSubtotal, restaurantId, clear } = useCartStore();

  const subtotal = getSubtotal();
  const deliveryFee = 30;
  const total = subtotal + deliveryFee;

  const renderItem = ({ item, index }: { item: CartItem; index: number }) => (
    <View style={styles.cartItem}>
      <View style={styles.itemInfo}>
        <Text style={styles.itemName}>{item.name}</Text>
        {item.options.map((opt, i) => (
          <Text key={i} style={styles.itemOption}>{opt.name}: {opt.choice} (+{opt.priceAdd}฿)</Text>
        ))}
        {item.notes ? <Text style={styles.itemNotes}>หมายเหตุ: {item.notes}</Text> : null}
        <Text style={styles.itemPrice}>{(item.price + item.options.reduce((s, o) => s + o.priceAdd, 0)) * item.qty} บาท</Text>
        <View style={styles.qtyRow}>
          <TouchableOpacity onPress={() => updateQty(index, item.qty - 1)} style={styles.qtyBtn}>
            <Text style={styles.qtyBtnText}>−</Text>
          </TouchableOpacity>
          <Text style={styles.qtyText}>{item.qty}</Text>
          <TouchableOpacity onPress={() => updateQty(index, item.qty + 1)} style={styles.qtyBtn}>
            <Text style={styles.qtyBtnText}>+</Text>
          </TouchableOpacity>
        </View>
      </View>
      <TouchableOpacity onPress={() => removeItem(index)}>
        <Text style={styles.removeBtn}>ลบ</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>รถเข็น</Text>
      </View>

      {items.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyText}>รถเข็นว่าง</Text>
          <TouchableOpacity style={styles.button} onPress={() => router.replace("/")}>
            <Text style={styles.buttonText}>สั่งอาหาร</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          <FlatList
            data={items}
            renderItem={renderItem}
            keyExtractor={(_, i) => String(i)}
            contentContainerStyle={styles.list}
          />
          <View style={styles.summary}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>ยอดอาหาร</Text>
              <Text style={styles.summaryValue}>{subtotal} บาท</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>ค่าส่ง</Text>
              <Text style={styles.summaryValue}>{deliveryFee} บาท</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryTotal}>รวม</Text>
              <Text style={styles.summaryTotalValue}>{total} บาท</Text>
            </View>
            <TouchableOpacity
              style={styles.button}
              onPress={() => router.push("/checkout")}
            >
              <Text style={styles.buttonText}>ดำเนินการสั่งซื้อ</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8F9FA" },
  header: { padding: 16, paddingTop: 50, backgroundColor: "#FF6B35" },
  headerTitle: { fontSize: 22, fontWeight: "bold", color: "#fff" },
  list: { padding: 16 },
  cartItem: { flexDirection: "row", backgroundColor: "#fff", borderRadius: 12, padding: 16, marginBottom: 12 },
  itemInfo: { flex: 1 },
  itemName: { fontSize: 16, fontWeight: "600", color: "#1A1A2E" },
  itemOption: { fontSize: 13, color: "#6C757D", marginTop: 2 },
  itemNotes: { fontSize: 13, color: "#6C757D", marginTop: 2, fontStyle: "italic" },
  itemPrice: { fontSize: 15, fontWeight: "600", color: "#FF6B35", marginTop: 6 },
  qtyRow: { flexDirection: "row", alignItems: "center", marginTop: 8 },
  qtyBtn: { width: 32, height: 32, borderRadius: 16, backgroundColor: "#F0F0F0", alignItems: "center", justifyContent: "center" },
  qtyBtnText: { fontSize: 20, color: "#1A1A2E" },
  qtyText: { fontSize: 16, fontWeight: "600", marginHorizontal: 16 },
  removeBtn: { color: "#E74C3C", fontSize: 14, padding: 8 },
  summary: { backgroundColor: "#fff", padding: 16, borderTopWidth: 1, borderTopColor: "#E0E0E0" },
  summaryRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 8 },
  summaryLabel: { fontSize: 14, color: "#6C757D" },
  summaryValue: { fontSize: 14, color: "#1A1A2E", fontWeight: "500" },
  summaryTotal: { fontSize: 18, fontWeight: "bold", color: "#1A1A2E" },
  summaryTotalValue: { fontSize: 18, fontWeight: "bold", color: "#FF6B35" },
  button: { backgroundColor: "#FF6B35", borderRadius: 12, padding: 16, alignItems: "center", marginTop: 12 },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "600" },
  empty: { flex: 1, alignItems: "center", justifyContent: "center" },
  emptyText: { fontSize: 18, color: "#6C757D", marginBottom: 16 },
});
