import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "@/services/firebase";
import { ORDER_STATUS_LABELS, ORDER_STATUS_STEPS, type Order } from "@/types";
import { useEffect, useState } from "react";

export default function OrderTrackingScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    const unsub = onSnapshot(doc(db, "orders", id), (snap) => {
      if (snap.exists()) {
        setOrder({ id: snap.id, ...snap.data() } as Order);
      }
      setLoading(false);
    });
    return () => unsub();
  }, [id]);

  if (loading) {
    return <View style={styles.center}><ActivityIndicator size="large" color="#FF6B35" /></View>;
  }

  if (!order) {
    return <View style={styles.center}><Text>ไม่พบคำสั่ง</Text></View>;
  }

  const currentStepIndex = ORDER_STATUS_STEPS.indexOf(order.status);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backBtn}>‹ กลับ</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>ติดตามคำสั่ง</Text>
      </View>

      <ScrollView style={styles.body}>
        <Text style={styles.orderId}>คำสั่ง #{id?.slice(-6)}</Text>

        <View style={styles.statusTracker}>
          {ORDER_STATUS_STEPS.map((status, index) => (
            <View key={status} style={styles.stepRow}>
              <View style={[styles.stepCircle, index <= currentStepIndex ? styles.stepDone : styles.stepPending]}>
                <Text style={styles.stepCircleText}>{index <= currentStepIndex ? "✓" : index + 1}</Text>
              </View>
              {index < ORDER_STATUS_STEPS.length - 1 && (
                <View style={[styles.stepLine, index < currentStepIndex ? styles.stepLineDone : styles.stepLinePending]} />
              )}
              <Text style={[styles.stepLabel, index <= currentStepIndex && styles.stepLabelDone]}>
                {ORDER_STATUS_LABELS[status]}
              </Text>
            </View>
          ))}
        </View>

        <View style={styles.detailSection}>
          <Text style={styles.detailTitle}>รายการอาหาร</Text>
          {order.items.map((item, i) => (
            <View key={i} style={styles.itemRow}>
              <Text style={styles.itemQty}>{item.qty}×</Text>
              <Text style={styles.itemName}>{item.name}</Text>
              <Text style={styles.itemPrice}>{(item.price + item.options.reduce((s, o) => s + o.priceAdd, 0)) * item.qty} ฿</Text>
            </View>
          ))}
          <View style={styles.divider} />
          <View style={styles.totalRow}><Text>ยอดรวม</Text><Text style={styles.totalValue}>{order.total} บาท</Text></View>
        </View>

        <View style={styles.detailSection}>
          <Text style={styles.detailTitle}>ที่อยู่จัดส่ง</Text>
          <Text style={styles.addressText}>{order.deliveryAddress}</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8F9FA" },
  header: { flexDirection: "row", alignItems: "center", padding: 16, paddingTop: 50, backgroundColor: "#FF6B35" },
  backBtn: { color: "#fff", fontSize: 16, marginRight: 12 },
  headerTitle: { fontSize: 20, fontWeight: "bold", color: "#fff" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  body: { flex: 1, padding: 16 },
  orderId: { fontSize: 18, fontWeight: "bold", color: "#1A1A2E", marginBottom: 16, textAlign: "center" },
  statusTracker: { backgroundColor: "#fff", borderRadius: 12, padding: 20, marginBottom: 16 },
  stepRow: { flexDirection: "row", alignItems: "center", marginBottom: 24, position: "relative" },
  stepCircle: { width: 32, height: 32, borderRadius: 16, alignItems: "center", justifyContent: "center", marginRight: 12 },
  stepDone: { backgroundColor: "#2EC4B6" },
  stepPending: { backgroundColor: "#E0E0E0" },
  stepCircleText: { color: "#fff", fontWeight: "bold", fontSize: 14 },
  stepLine: { position: "absolute", left: 15, top: 32, width: 2, height: 24, backgroundColor: "#E0E0E0" },
  stepLineDone: { backgroundColor: "#2EC4B6" },
  stepLinePending: { backgroundColor: "#E0E0E0" },
  stepLabel: { fontSize: 14, color: "#6C757D", flex: 1 },
  stepLabelDone: { color: "#1A1A2E", fontWeight: "500" },
  detailSection: { backgroundColor: "#fff", borderRadius: 12, padding: 16, marginBottom: 16 },
  detailTitle: { fontSize: 16, fontWeight: "bold", color: "#1A1A2E", marginBottom: 12 },
  itemRow: { flexDirection: "row", marginBottom: 8 },
  itemQty: { width: 30, fontSize: 14, color: "#FF6B35", fontWeight: "600" },
  itemName: { flex: 1, fontSize: 14, color: "#1A1A2E" },
  itemPrice: { fontSize: 14, color: "#1A1A2E", fontWeight: "500" },
  divider: { height: 1, backgroundColor: "#F0F0F0", marginVertical: 12 },
  totalRow: { flexDirection: "row", justifyContent: "space-between" },
  totalValue: { fontSize: 18, fontWeight: "bold", color: "#FF6B35" },
  addressText: { fontSize: 14, color: "#6C757D", lineHeight: 22 },
});
