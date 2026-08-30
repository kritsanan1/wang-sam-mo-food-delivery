import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import { collection, query, where, orderBy, getDocs } from "firebase/firestore";
import { auth, db } from "@/services/firebase";
import { ORDER_STATUS_LABELS, type Order } from "@/types";

export default function OrdersScreen() {
  const router = useRouter();

  const { data: orders, isLoading } = useQuery({
    queryKey: ["orders", auth.currentUser?.uid],
    queryFn: async () => {
      if (!auth.currentUser) return [];
      const q = query(
        collection(db, "orders"),
        where("customerId", "==", auth.currentUser.uid),
        orderBy("createdAt", "desc")
      );
      const snap = await getDocs(q);
      return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Order);
    },
    enabled: !!auth.currentUser,
  });

  if (!auth.currentUser) {
    return (
      <View style={styles.center}>
        <Text style={styles.emptyText}>กรุณาเข้าสู่ระบบ</Text>
        <TouchableOpacity style={styles.button} onPress={() => router.push("/login")}>
          <Text style={styles.buttonText}>เข้าสู่ระบบ</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (isLoading) return <View style={styles.center}><ActivityIndicator size="large" color="#FF6B35" /></View>;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>คำสั่งของฉัน</Text>
      </View>
      <FlatList
        data={orders}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.orderCard} onPress={() => router.push(`/order/${item.id}`)}>
            <View style={styles.orderHeader}>
              <Text style={styles.orderId}>#{item.id.slice(-6)}</Text>
              <Text style={[styles.orderStatus, styles[`status_${item.status}`] || styles.status_default]}>
                {ORDER_STATUS_LABELS[item.status]}
              </Text>
            </View>
            <Text style={styles.orderItems}>{item.items.length} รายการ · {item.restaurantName || "ร้านอาหาร"}</Text>
            <Text style={styles.orderTotal}>{item.total} บาท</Text>
          </TouchableOpacity>
        )}
        ListEmptyComponent={<Text style={styles.emptyText}>ยังไม่มีคำสั่งซื้อ</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8F9FA" },
  header: { padding: 16, paddingTop: 50, backgroundColor: "#FF6B35" },
  headerTitle: { fontSize: 22, fontWeight: "bold", color: "#fff" },
  list: { padding: 16 },
  orderCard: { backgroundColor: "#fff", borderRadius: 12, padding: 16, marginBottom: 12 },
  orderHeader: { flexDirection: "row", justifyContent: "space-between", marginBottom: 8 },
  orderId: { fontSize: 16, fontWeight: "bold", color: "#1A1A2E" },
  orderStatus: { fontSize: 13, fontWeight: "600", paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  status_default: { backgroundColor: "#F0F0F0", color: "#6C757D" },
  status_pending: { backgroundColor: "#FFF3CD", color: "#856404" },
  status_accepted: { backgroundColor: "#D4EDDA", color: "#155724" },
  status_delivered: { backgroundColor: "#D1ECF1", color: "#0C5460" },
  status_rejected: { backgroundColor: "#F8D7DA", color: "#721C24" },
  status_cancelled: { backgroundColor: "#F8D7DA", color: "#721C24" },
  orderItems: { fontSize: 14, color: "#6C757D" },
  orderTotal: { fontSize: 16, fontWeight: "600", color: "#FF6B35", marginTop: 4 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  emptyText: { fontSize: 16, color: "#6C757D", textAlign: "center", marginTop: 40 },
  button: { backgroundColor: "#FF6B35", borderRadius: 12, padding: 16, alignItems: "center", marginTop: 16 },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "600" },
} as any);
