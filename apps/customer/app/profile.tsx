import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { useRouter } from "expo-router";
import { auth } from "@/services/firebase";
import { signOut } from "firebase/auth";

export default function ProfileScreen() {
  const router = useRouter();

  const handleLogout = () => {
    Alert.alert("ออกจากระบบ?", "คุณต้องการออกจากระบบใช่ไหม?", [
      { text: "ยกเลิก" },
      {
        text: "ออกจากระบบ",
        style: "destructive",
        onPress: async () => {
          await signOut(auth);
          router.replace("/login");
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>โปรไฟล์</Text>
      </View>
      <View style={styles.body}>
        <Text style={styles.phone}>{auth.currentUser?.phoneNumber || "ไม่ได้เข้าสู่ระบบ"}</Text>
        <TouchableOpacity style={styles.menuItem} onPress={() => router.push("/orders")}>
          <Text style={styles.menuText}>คำสั่งของฉัน</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem} onPress={() => Alert.alert("เร็วๆ นี้", "ฟีเจอร์นี้กำลังพัฒนา")}>
          <Text style={styles.menuText}>แก้ไขที่อยู่</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem} onPress={() => Alert.alert("เร็วๆ นี้", "ฟีเจอร์นี้กำลังพัฒนา")}>
          <Text style={styles.menuText}>ตั้งค่าการแจ้งเตือน</Text>
        </TouchableOpacity>
        {auth.currentUser && (
          <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
            <Text style={styles.logoutText}>ออกจากระบบ</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8F9FA" },
  header: { padding: 16, paddingTop: 50, backgroundColor: "#FF6B35" },
  headerTitle: { fontSize: 22, fontWeight: "bold", color: "#fff" },
  body: { padding: 16 },
  phone: { fontSize: 18, fontWeight: "600", color: "#1A1A2E", marginBottom: 24 },
  menuItem: { backgroundColor: "#fff", borderRadius: 12, padding: 16, marginBottom: 8 },
  menuText: { fontSize: 16, color: "#1A1A2E" },
  logoutBtn: { marginTop: 24, alignItems: "center" },
  logoutText: { fontSize: 16, color: "#E74C3C" },
});
