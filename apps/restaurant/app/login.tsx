import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";

export default function RestaurantLoginScreen() {
  const router = useRouter();
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>วังสามหมอ ร้านอาหาร</Text>
        <Text style={styles.subtitle}>เข้าสู่ระบบร้าน</Text>
      </View>
      <View style={styles.form}>
        <Text style={styles.info}>กรุณาเข้าสู่ระบบด้วยเบอร์ที่ลงทะเบียนร้านไว้</Text>
        <TouchableOpacity style={styles.button} onPress={() => router.replace("/")}>
          <Text style={styles.buttonText}>เข้าสู่ระบบ</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8F9FA" },
  header: { padding: 24, paddingTop: 60, backgroundColor: "#FF6B35", borderBottomLeftRadius: 20, borderBottomRightRadius: 20 },
  title: { fontSize: 26, fontWeight: "bold", color: "#fff" },
  subtitle: { fontSize: 16, color: "#fff", opacity: 0.9, marginTop: 4 },
  form: { padding: 24 },
  info: { fontSize: 14, color: "#6C757D", marginBottom: 16, lineHeight: 22 },
  button: { backgroundColor: "#FF6B35", borderRadius: 12, padding: 16, alignItems: "center" },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "600" },
});
