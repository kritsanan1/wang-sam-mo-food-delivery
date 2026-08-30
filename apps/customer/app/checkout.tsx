import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { auth, db } from "@/services/firebase";
import { useCartStore } from "@/store/cart";

export default function CheckoutScreen() {
  const router = useRouter();
  const { items, getSubtotal, restaurantId, clear } = useCartStore();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"promptpay" | "cod">("cod");
  const [loading, setLoading] = useState(false);

  const subtotal = getSubtotal();
  const deliveryFee = 30;
  const total = subtotal + deliveryFee;
  const commission = Math.round(subtotal * 0.12);

  const placeOrder = async () => {
    if (!name || !phone || !address) {
      Alert.alert("กรุณากรอกข้อมูลให้ครบ");
      return;
    }
    if (!auth.currentUser) {
      Alert.alert("กรุณาเข้าสู่ระบบก่อน", "", [{ text: "ตกลง", onPress: () => router.push("/login") }]);
      return;
    }
    setLoading(true);
    try {
      const orderData = {
        customerId: auth.currentUser.uid,
        customerName: name,
        customerPhone: phone,
        restaurantId,
        items,
        subtotal,
        deliveryFee,
        total,
        commission,
        status: "pending",
        deliveryAddress: address,
        paymentMethod,
        paymentStatus: "pending",
        createdAt: serverTimestamp(),
        autoRejectAt: new Date(Date.now() + 3 * 60 * 1000),
      };
      const docRef = await addDoc(collection(db, "orders"), orderData);
      clear();
      Alert.alert("สั่งซื้อสำเร็จ!", "คำสั่งของคุณถูกส่งไปยังร้านแล้ว", [
        { text: "ติดตามคำสั่ง", onPress: () => router.replace(`/order/${docRef.id}`) },
      ]);
    } catch (error: any) {
      Alert.alert("สั่งซื้อไม่สำเร็จ", error?.message || "กรุณาลองอีกครั้ง");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>สรุปคำสั่งซื้อ</Text>
      </View>
      <ScrollView style={styles.body}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>ที่อยู่จัดส่ง</Text>
          <TextInput style={styles.input} placeholder="ชื่อ" value={name} onChangeText={setName} />
          <TextInput style={styles.input} placeholder="เบอร์โทร" keyboardType="phone-pad" value={phone} onChangeText={setPhone} />
          <TextInput style={styles.input} placeholder="ที่อยู่" multiline value={address} onChangeText={setAddress} />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>วิธีชำระเงิน</Text>
          <TouchableOpacity style={[styles.payOption, paymentMethod === "cod" && styles.paySelected]} onPress={() => setPaymentMethod("cod")}>
            <Text style={styles.payText}>💵 เก็บเงินปลายทาง (COD)</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.payOption, paymentMethod === "promptpay" && styles.paySelected]} onPress={() => setPaymentMethod("promptpay")}>
            <Text style={styles.payText}>📱 PromptPay QR</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <View style={styles.summaryRow}><Text>ยอดอาหาร</Text><Text>{subtotal} บาท</Text></View>
          <View style={styles.summaryRow}><Text>ค่าส่ง</Text><Text>{deliveryFee} บาท</Text></View>
          <View style={styles.summaryRow}><Text style={styles.totalText}>รวม</Text><Text style={styles.totalValue}>{total} บาท</Text></View>
        </View>
      </ScrollView>
      <TouchableOpacity style={styles.button} onPress={placeOrder} disabled={loading}>
        <Text style={styles.buttonText}>{loading ? "กำลังสั่ง..." : `สั่งซื้อ (${total} บาท)`}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8F9FA" },
  header: { padding: 16, paddingTop: 50, backgroundColor: "#FF6B35" },
  headerTitle: { fontSize: 22, fontWeight: "bold", color: "#fff" },
  body: { flex: 1 },
  section: { backgroundColor: "#fff", margin: 12, borderRadius: 12, padding: 16 },
  sectionTitle: { fontSize: 16, fontWeight: "bold", color: "#1A1A2E", marginBottom: 12 },
  input: { borderWidth: 1, borderColor: "#E0E0E0", borderRadius: 8, padding: 12, marginBottom: 8, fontSize: 16 },
  payOption: { padding: 16, borderWidth: 1, borderColor: "#E0E0E0", borderRadius: 8, marginBottom: 8 },
  paySelected: { borderColor: "#FF6B35", backgroundColor: "#FFF5F0" },
  payText: { fontSize: 16, color: "#1A1A2E" },
  summaryRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 8 },
  totalText: { fontSize: 18, fontWeight: "bold" },
  totalValue: { fontSize: 18, fontWeight: "bold", color: "#FF6B35" },
  button: { backgroundColor: "#FF6B35", padding: 18, alignItems: "center" },
  buttonText: { color: "#fff", fontSize: 18, fontWeight: "bold" },
});
