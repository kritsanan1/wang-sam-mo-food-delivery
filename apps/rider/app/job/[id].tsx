import { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert, Linking, ScrollView } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { auth, db } from "@/services/firebase";
import { doc, onSnapshot, updateDoc } from "firebase/firestore";
import { ORDER_STATUS_LABELS, type Order } from "./src/types";
import { ActivityIndicator } from "react-native";

export default function JobDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    const unsub = onSnapshot(doc(db, "orders", id), (snap) => {
      if (snap.exists()) setOrder({ id: snap.id, ...snap.data() } as Order);
      setLoading(false);
    });
    return () => unsub();
  }, [id]);

  if (loading) return <View style={styles.center}><ActivityIndicator size="large" color="#2EC4B6" /></View>;
  if (!order) return <View style={styles.center}><Text>ไม่พบงาน</Text></View>;

  const acceptJob = async () => {
    if (!auth.currentUser) return;
    await updateDoc(doc(db, "orders", id!), { riderId: auth.currentUser.uid, status: "picked_up" }, { merge: true });
  };

  const completeDelivery = async () => {
    await updateDoc(doc(db, "orders", id!), { status: "delivered", deliveredAt: new Date() }, { merge: true });
    Alert.alert("ส่งสำเร็จ!", `รายได้ ${order.deliveryFee * 0.8} บาท`, [{ text: "ตกลง", onPress: () => router.replace("/") }]);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}><Text style={styles.backBtn}>‹ กลับ</Text></TouchableOpacity>
        <Text style={styles.headerTitle}>งาน #{id?.slice(-6)}</Text>
      </View>
      <ScrollView style={styles.body}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>ร้านอาหาร</Text>
          <Text style={styles.infoText}>{order.restaurantName}</Text>
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>รายการอาหาร</Text>
          {order.items.map((item, i) => (
            <View key={i} style={styles.itemRow}>
              <Text style={styles.itemQty}>{item.qty}×</Text>
              <Text style={styles.itemName}>{item.name}</Text>
            </View>
          ))}
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>ที่หมาย</Text>
          <Text style={styles.infoText}>{order.deliveryAddress}</Text>
          <Text style={styles.infoText}>เบอร์ลูกค้า: {order.customerPhone}</Text>
          <TouchableOpacity onPress={() => Linking.openURL(`tel:${order.customerPhone}`)}>
            <Text style={styles.callBtn}>📞 โทรหาลูกค้า</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>ค่าส่ง</Text>
          <Text style={styles.feeText}>{order.deliveryFee} บาท (ได้รับ {order.deliveryFee * 0.8} บาท)</Text>
        </View>
      </ScrollView>
      {order.status === "ready" && (
        <TouchableOpacity style={styles.actionBtn} onPress={acceptJob}>
          <Text style={styles.actionBtnText}>รับงาน</Text>
        </TouchableOpacity>
      )}
      {order.status === "picked_up" && (
        <TouchableOpacity style={styles.actionBtn} onPress={completeDelivery}>
          <Text style={styles.actionBtnText}>ส่งถึงแล้ว</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8F9FA" },
  header: { flexDirection: "row", alignItems: "center", padding: 16, paddingTop: 50, backgroundColor: "#2EC4B6" },
  backBtn: { color: "#fff", fontSize: 16, marginRight: 12 },
  headerTitle: { fontSize: 20, fontWeight: "bold", color: "#fff" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  body: { flex: 1, padding: 16 },
  section: { backgroundColor: "#fff", borderRadius: 12, padding: 16, marginBottom: 12 },
  sectionTitle: { fontSize: 16, fontWeight: "bold", color: "#1A1A2E", marginBottom: 8 },
  infoText: { fontSize: 15, color: "#1A1A2E", marginBottom: 4 },
  itemRow: { flexDirection: "row", marginBottom: 6 },
  itemQty: { width: 30, fontSize: 15, fontWeight: "600", color: "#FF6B35" },
  itemName: { flex: 1, fontSize: 15, color: "#1A1A2E" },
  callBtn: { color: "#2EC4B6", fontSize: 16, fontWeight: "600", marginTop: 8 },
  feeText: { fontSize: 18, fontWeight: "bold", color: "#FF6B35" },
  actionBtn: { backgroundColor: "#2EC4B6", padding: 18, alignItems: "center" },
  actionBtnText: { color: "#fff", fontSize: 18, fontWeight: "bold" },
});
