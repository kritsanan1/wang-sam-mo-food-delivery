import { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Alert, Switch } from "react-native";
import { useRouter } from "expo-router";
import { auth, db } from "@/services/firebase";
import { collection, query, where, onSnapshot, doc, updateDoc, getDoc } from "firebase/firestore";
import { ORDER_STATUS_LABELS, type Order, type OrderStatus } from "@/types";

export default function RestaurantDashboardScreen() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isOpen, setIsOpen] = useState(true);
  const [restaurantId, setRestaurantId] = useState<string | null>(null);
  const [todayStats, setTodayStats] = useState({ count: 0, total: 0 });

  useEffect(() => {
    if (!auth.currentUser) {
      router.replace("/login");
      return;
    }
    // Find restaurant by owner
    const findRestaurant = async () => {
      const userSnap = await getDoc(doc(db, "users", auth.currentUser!.uid));
      const rid = userSnap.data()?.restaurantId;
      if (rid) {
        setRestaurantId(rid);
        const restSnap = await getDoc(doc(db, "restaurants", rid));
        setIsOpen(restSnap.data()?.isOpen ?? true);

        const q = query(collection(db, "orders"), where("restaurantId", "==", rid), where("status", "in", ["pending", "accepted", "preparing", "ready"]));
        const unsub = onSnapshot(q, (snap) => {
          const newOrders = snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Order);
          setOrders(newOrders);
          const today = new Date();
          const todayOrders = newOrders.filter((o) => o.createdAt?.toDate?.()?.toDateString() === today.toDateString());
          setTodayStats({ count: todayOrders.length, total: todayOrders.reduce((s, o) => s + o.total, 0) });
        });
      }
    };
    findRestaurant();
  }, []);

  const toggleOpen = async () => {
    if (!restaurantId) return;
    const newVal = !isOpen;
    setIsOpen(newVal);
    await updateDoc(doc(db, "restaurants", restaurantId), { isOpen: newVal }, { merge: true });
  };

  const acceptOrder = async (orderId: string) => {
    await updateDoc(doc(db, "orders", orderId), { status: "accepted" as OrderStatus }, { merge: true });
  };

  const rejectOrder = async (orderId: string) => {
    await updateDoc(doc(db, "orders", orderId), { status: "rejected" as OrderStatus }, { merge: true });
  };

  const markReady = async (orderId: string) => {
    await updateDoc(doc(db, "orders", orderId), { status: "ready" as OrderStatus }, { merge: true });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>แดชบอร์ดร้าน</Text>
        <View style={styles.headerRight}>
          <TouchableOpacity onPress={() => router.push("/menu")}><Text style={styles.navLink}>เมนู</Text></TouchableOpacity>
          <TouchableOpacity onPress={() => router.push("/reports")}><Text style={styles.navLink}>รายงาน</Text></TouchableOpacity>
        </View>
      </View>

      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>คำสั่งวันนี้</Text>
          <Text style={styles.statValue}>{todayStats.count}</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>ยอดขายวันนี้</Text>
          <Text style={styles.statValue}>{todayStats.total} ฿</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>เปิด/ปิด</Text>
          <Switch value={isOpen} onValueChange={toggleOpen} trackColor={{ true: "#2EC4B6" }} />
        </View>
      </View>

      <Text style={styles.sectionTitle}>คำสั่งใหม่</Text>
      <FlatList
        data={orders}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <View style={styles.orderCard}>
            <View style={styles.orderHeader}>
              <Text style={styles.orderId}>#{item.id.slice(-6)}</Text>
              <Text style={styles.orderStatus}>{ORDER_STATUS_LABELS[item.status]}</Text>
            </View>
            {item.items.map((it, i) => (
              <Text key={i} style={styles.orderItem}>• {it.qty}× {it.name} {it.notes ? `(${it.notes})` : ""}</Text>
            ))}
            <Text style={styles.orderAddress}>📍 {item.deliveryAddress}</Text>
            <Text style={styles.orderPhone}>📞 {item.customerPhone}</Text>
            <Text style={styles.orderTotal}>ยอด: {item.total} บาท</Text>
            <View style={styles.orderActions}>
              {item.status === "pending" && (
                <>
                  <TouchableOpacity style={[styles.btn, styles.btnAccept]} onPress={() => acceptOrder(item.id)}>
                    <Text style={styles.btnText}>รับ</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.btn, styles.btnReject]} onPress={() => rejectOrder(item.id)}>
                    <Text style={styles.btnText}>ปฏิเสธ</Text>
                  </TouchableOpacity>
                </>
              )}
              {item.status === "accepted" && (
                <TouchableOpacity style={[styles.btn, styles.btnReady]} onPress={() => markReady(item.id)}>
                  <Text style={styles.btnText}>พร้อมส่ง</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        )}
        ListEmptyComponent={<Text style={styles.emptyText}>ไม่มีคำสั่งใหม่</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8F9FA" },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", padding: 16, paddingTop: 50, backgroundColor: "#FF6B35" },
  headerTitle: { fontSize: 22, fontWeight: "bold", color: "#fff" },
  headerRight: { flexDirection: "row" },
  navLink: { color: "#fff", fontSize: 14, marginLeft: 16 },
  statsRow: { flexDirection: "row", padding: 12 },
  statCard: { flex: 1, backgroundColor: "#fff", borderRadius: 12, padding: 12, marginHorizontal: 4, alignItems: "center" },
  statLabel: { fontSize: 12, color: "#6C757D", marginBottom: 4 },
  statValue: { fontSize: 20, fontWeight: "bold", color: "#1A1A2E" },
  sectionTitle: { fontSize: 18, fontWeight: "bold", color: "#1A1A2E", padding: 16 },
  list: { padding: 16 },
  orderCard: { backgroundColor: "#fff", borderRadius: 12, padding: 16, marginBottom: 12 },
  orderHeader: { flexDirection: "row", justifyContent: "space-between", marginBottom: 8 },
  orderId: { fontSize: 16, fontWeight: "bold", color: "#FF6B35" },
  orderStatus: { fontSize: 13, fontWeight: "600", color: "#2EC4B6" },
  orderItem: { fontSize: 14, color: "#1A1A2E", marginBottom: 4 },
  orderAddress: { fontSize: 14, color: "#6C757D", marginTop: 8 },
  orderPhone: { fontSize: 14, color: "#6C757D", marginTop: 4 },
  orderTotal: { fontSize: 16, fontWeight: "600", color: "#1A1A2E", marginTop: 8 },
  orderActions: { flexDirection: "row", marginTop: 12 },
  btn: { flex: 1, borderRadius: 8, padding: 12, alignItems: "center", marginHorizontal: 4 },
  btnAccept: { backgroundColor: "#2EC4B6" },
  btnReject: { backgroundColor: "#E74C3C" },
  btnReady: { backgroundColor: "#FF6B35" },
  btnText: { color: "#fff", fontSize: 15, fontWeight: "600" },
  emptyText: { fontSize: 16, color: "#6C757D", textAlign: "center", marginTop: 40 },
});
