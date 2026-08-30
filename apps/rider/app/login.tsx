import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { useRouter } from "expo-router";
import { auth } from "@/services/firebase";
import { PhoneAuthProvider, signInWithCredential } from "firebase/auth";

export default function RiderLoginScreen() {
  const router = useRouter();
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>วังสามหมอ Rider</Text>
        <Text style={styles.subtitle}>เข้าสู่ระบบ Rider</Text>
      </View>
      <View style={styles.form}>
        <Text style={styles.info}>กรุณาเข้าสู่ระบบด้วยเบอร์โทรที่ลงทะเบียน Rider ไว้</Text>
        <TouchableOpacity style={styles.button} onPress={() => router.replace("/")}>
          <Text style={styles.buttonText}>เข้าสู่ระบบ</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8F9FA" },
  header: { padding: 24, paddingTop: 60, backgroundColor: "#2EC4B6", borderBottomLeftRadius: 20, borderBottomRightRadius: 20 },
  title: { fontSize: 28, fontWeight: "bold", color: "#fff" },
  subtitle: { fontSize: 16, color: "#fff", opacity: 0.9, marginTop: 4 },
  form: { padding: 24 },
  info: { fontSize: 14, color: "#6C757D", marginBottom: 16, lineHeight: 22 },
  button: { backgroundColor: "#2EC4B6", borderRadius: 12, padding: 16, alignItems: "center" },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "600" },
});
