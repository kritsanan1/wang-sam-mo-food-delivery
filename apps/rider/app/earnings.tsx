import { View, Text, StyleSheet, ScrollView } from "react-native";
import { auth, db } from "@/services/firebase";
import { doc, getDoc } from "firebase/firestore";
import { useQuery } from "@tanstack/react-query";

export default function EarningsScreen() {
  const { data: rider } = useQuery({
    queryKey: ["rider", auth.currentUser?.uid],
    queryFn: async () => {
      if (!auth.currentUser) return null;
      const snap = await getDoc(doc(db, "riders", auth.currentUser.uid));
      return snap.data();
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>รายได้</Text>
      </View>
      <ScrollView style={styles.body}>
        <View style={styles.card}>
          <Text style={styles.cardLabel}>รายได้วันนี้</Text>
          <Text style={styles.cardValue}>{(rider?.totalEarnings || 0).toFixed(0)} บาท</Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.cardLabel}>งานส่งทั้งหมด</Text>
          <Text style={styles.cardValue}>{rider?.totalDeliveries || 0} งาน</Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.cardLabel}>คะแนน</Text>
          <Text style={styles.cardValue}>⭐ {rider?.rating?.toFixed(1) || "—"}</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8F9FA" },
  header: { padding: 16, paddingTop: 50, backgroundColor: "#2EC4B6" },
  headerTitle: { fontSize: 22, fontWeight: "bold", color: "#fff" },
  body: { flex: 1, padding: 16 },
  card: { backgroundColor: "#fff", borderRadius: 12, padding: 20, marginBottom: 12, alignItems: "center" },
  cardLabel: { fontSize: 14, color: "#6C757D", marginBottom: 8 },
  cardValue: { fontSize: 28, fontWeight: "bold", color: "#FF6B35" },
});
