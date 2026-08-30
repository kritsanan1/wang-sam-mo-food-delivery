import { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Alert, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import { auth, db } from "@/services/firebase";
import { doc, updateDoc, onSnapshot, collection, query, where } from "firebase/firestore";

interface Order {
  id: string;
  restaurantName?: string;
  deliveryAddress: string;
  deliveryFee: number;
  status: string;
  items: any[];
}

export default function RiderHomeScreen() {
  const router = useRouter();
  const [isOnline, setIsOnline] = useState(false);
  const [jobs, setJobs] = useState<Order[]>([]);

  useEffect(() => {
    if (!auth.currentUser) {
      router.replace("/login");
      return;
    }
    const q = query(
      collection(db, "orders"),
      where("riderId", "==", auth.currentUser?.uid),
      where("status", "in", ["ready", "picked_up"])
    );
    const unsub = onSnapshot(q, (snap) => {
      setJobs(snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Order));
    });
    return () => unsub();
  }, []);

  const toggleOnline = () => {
    setIsOnline(!isOnline);
    Alert.alert(isOnline ? "ออฟไลน์" : "ออนไลน์", isOnline ? "หยุดรับงานแล้ว" : "เริ่มรับงานแล้ว");
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>วังสามหมอ Rider</Text>
        <TouchableOpacity onPress={() => router.push("/earnings")}>
          <Text style={styles.earningsLink}>รายได้</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={[styles.onlineToggle, isOnline ? styles.onlineOn : styles.onlineOff]} onPress={toggleOnline}>
        <Text style={styles.onlineToggleText}>{isOnline ? "🟢 ออนไลน์" : "⚪ ออฟไลน์"}</Text>
        <Text style={styles.onlineToggleSub}>{isOnline ? "กดเพื่อหยุดรับงาน" : "กดเพื่อเริ่มรับงาน"}</Text>
      </TouchableOpacity>

      <View style={styles.jobsSection}>
        <Text style={styles.jobsTitle}>งานปัจจุบัน</Text>
        {jobs.length === 0 ? (
          <Text style={styles.emptyText}>{isOnline ? "รองาน..." : "ออนไลน์เพื่อรับงาน"}</Text>
        ) : (
          <FlatList
            data={jobs}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity style={styles.jobCard} onPress={() => router.push(`/job/${item.id}`)}>
                <Text style={styles.jobId}>#{item.id.slice(-6)}</Text>
                <Text style={styles.jobInfo}>{item.restaurantName}</Text>
                <Text style={styles.jobAddress}>{item.deliveryAddress}</Text>
                <Text style={styles.jobFee}>ค่าส่ง {item.deliveryFee} บาท</Text>
              </TouchableOpacity>
            )}
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8F9FA" },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", padding: 16, paddingTop: 50, backgroundColor: "#2EC4B6" },
  headerTitle: { fontSize: 22, fontWeight: "bold", color: "#fff" },
  earningsLink: { color: "#fff", fontSize: 14 },
  onlineToggle: { margin: 16, borderRadius: 16, padding: 24, alignItems: "center" },
  onlineOn: { backgroundColor: "#D4EDDA" },
  onlineOff: { backgroundColor: "#fff", borderWidth: 1, borderColor: "#E0E0E0" },
  onlineToggleText: { fontSize: 24, fontWeight: "bold" },
  onlineToggleSub: { fontSize: 14, color: "#6C757D", marginTop: 4 },
  jobsSection: { flex: 1, padding: 16 },
  jobsTitle: { fontSize: 18, fontWeight: "bold", color: "#1A1A2E", marginBottom: 12 },
  emptyText: { fontSize: 16, color: "#6C757D", textAlign: "center", marginTop: 40 },
  jobCard: { backgroundColor: "#fff", borderRadius: 12, padding: 16, marginBottom: 12 },
  jobId: { fontSize: 16, fontWeight: "bold", color: "#2EC4B6" },
  jobInfo: { fontSize: 15, color: "#1A1A2E", marginTop: 4 },
  jobAddress: { fontSize: 14, color: "#6C757D", marginTop: 4 },
  jobFee: { fontSize: 16, fontWeight: "600", color: "#FF6B35", marginTop: 8 },
});
