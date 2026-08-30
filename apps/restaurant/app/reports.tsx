import { View, Text, StyleSheet, ScrollView } from "react-native";
import { useRouter } from "expo-router";

export default function ReportsScreen() {
  const router = useRouter();
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}><Text style={styles.backBtn}>‹ กลับ</Text></TouchableOpacity>
        <Text style={styles.headerTitle}>รายงานยอดขาย</Text>
      </View>
      <ScrollView style={styles.body}>
        <View style={styles.card}>
          <Text style={styles.cardLabel}>ยอดขายวันนี้</Text>
          <Text style={styles.cardValue}>— บาท</Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.cardLabel}>ยอดขายสัปดาห์</Text>
          <Text style={styles.cardValue}>— บาท</Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.cardLabel}>ยอดขายเดือน</Text>
          <Text style={styles.cardValue}>— บาท</Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.infoText}>กราฟและสถิติเพิ่มเติมจะเพิ่มในเฟส 2</Text>
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
  body: { flex: 1, padding: 16 },
  card: { backgroundColor: "#fff", borderRadius: 12, padding: 20, marginBottom: 12 },
  cardLabel: { fontSize: 14, color: "#6C757D", marginBottom: 8 },
  cardValue: { fontSize: 24, fontWeight: "bold", color: "#FF6B35" },
  infoText: { fontSize: 14, color: "#6C757D", textAlign: "center" },
});
