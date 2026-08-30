import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { useRouter } from "expo-router";
import { PhoneAuthProvider, signInWithCredential } from "firebase/auth";
import { auth } from "@/services/firebase";

export default function LoginScreen() {
  const router = useRouter();
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [verificationId, setVerificationId] = useState("");
  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [loading, setLoading] = useState(false);

  const sendOtp = async () => {
    if (!phone || phone.length < 9) {
      Alert.alert("กรุณาใส่เบอร์โทรศัพท์");
      return;
    }
    setLoading(true);
    try {
      const fullPhone = phone.startsWith("+66") ? phone : `+66${phone.replace(/^0/, "")}`;
      const provider = new PhoneAuthProvider(auth);
      const vId = await provider.verifyPhoneNumber(fullPhone, auth.app.options as any);
      setVerificationId(vId);
      setStep("otp");
      Alert.alert("ส่งรหัส OTP แล้ว", `กรุณาใส่รหัส 6 หลักที่ส่งไปยัง ${fullPhone}`);
    } catch (error: any) {
      Alert.alert("ส่ง OTP ไม่สำเร็จ", error?.message || "กรุณาลองอีกครั้ง");
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async () => {
    if (!code || code.length !== 6) {
      Alert.alert("กรุณาใส่รหัส OTP 6 หลัก");
      return;
    }
    setLoading(true);
    try {
      const credential = PhoneAuthProvider.credential(verificationId, code);
      await signInWithCredential(auth, credential);
      router.replace("/");
    } catch (error: any) {
      Alert.alert("รหัสไม่ถูกต้อง", error?.message || "กรุณาลองอีกครั้ง");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>วังสามหมอ Food</Text>
        <Text style={styles.subtitle}>เข้าสู่ระบบ</Text>
      </View>

      {step === "phone" ? (
        <View style={styles.form}>
          <Text style={styles.label}>เบอร์โทรศัพท์</Text>
          <TextInput
            style={styles.input}
            placeholder="0812345678"
            keyboardType="phone-pad"
            value={phone}
            onChangeText={setPhone}
          />
          <TouchableOpacity style={styles.button} onPress={sendOtp} disabled={loading}>
            <Text style={styles.buttonText}>{loading ? "กำลังส่ง..." : "ส่งรหัส OTP"}</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.form}>
          <Text style={styles.label}>รหัส OTP (6 หลัก)</Text>
          <TextInput
            style={styles.input}
            placeholder="123456"
            keyboardType="number-pad"
            maxLength={6}
            value={code}
            onChangeText={setCode}
          />
          <TouchableOpacity style={styles.button} onPress={verifyOtp} disabled={loading}>
            <Text style={styles.buttonText}>{loading ? "กำลังยืนยัน..." : "ยืนยัน"}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setStep("phone")}>
            <Text style={styles.linkText}>เปลี่ยนเบอร์โทร</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8F9FA" },
  header: { padding: 24, paddingTop: 60, backgroundColor: "#FF6B35", borderBottomLeftRadius: 20, borderBottomRightRadius: 20 },
  title: { fontSize: 28, fontWeight: "bold", color: "#fff" },
  subtitle: { fontSize: 16, color: "#fff", opacity: 0.9, marginTop: 4 },
  form: { padding: 24 },
  label: { fontSize: 14, color: "#1A1A2E", marginBottom: 8, fontWeight: "500" },
  input: { backgroundColor: "#fff", borderRadius: 12, padding: 16, fontSize: 18, borderWidth: 1, borderColor: "#E0E0E0" },
  button: { backgroundColor: "#FF6B35", borderRadius: 12, padding: 16, alignItems: "center", marginTop: 16 },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "600" },
  linkText: { color: "#2EC4B6", textAlign: "center", marginTop: 16, fontSize: 14 },
});
