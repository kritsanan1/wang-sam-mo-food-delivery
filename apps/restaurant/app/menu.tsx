import { useState, useEffect } from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, Alert, Switch, Modal } from "react-native";
import { useRouter } from "expo-router";
import { auth, db } from "@/services/firebase";
import { collection, onSnapshot, addDoc, updateDoc, deleteDoc, doc, getDoc } from "firebase/firestore";
import type { MenuItem } from "@/types";

export default function MenuManagementScreen() {
  const router = useRouter();
  const [menu, setMenu] = useState<MenuItem[]>([]);
  const [restaurantId, setRestaurantId] = useState<string | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [newItem, setNewItem] = useState({ name: "", price: "", description: "", category: "" });

  useEffect(() => {
    if (!auth.currentUser) {
      router.replace("/login");
      return;
    }
    const findRestaurant = async () => {
      const userSnap = await getDoc(doc(db, "users", auth.currentUser!.uid));
      const rid = userSnap.data()?.restaurantId;
      if (rid) {
        setRestaurantId(rid);
        const unsub = onSnapshot(collection(db, `restaurants/${rid}/menu`), (snap) => {
          setMenu(snap.docs.map((d) => ({ id: d.id, ...d.data() }) as MenuItem));
        });
      }
    };
    findRestaurant();
  }, []);

  const addItem = async () => {
    if (!restaurantId || !newItem.name || !newItem.price) {
      Alert.alert("กรุณากรอกชื่อและราคา");
      return;
    }
    await addDoc(collection(db, `restaurants/${restaurantId}/menu`), {
      name: newItem.name,
      price: parseFloat(newItem.price),
      description: newItem.description,
      category: newItem.category || "ทั่วไป",
      imageUrl: "",
      isAvailable: true,
    });
    setNewItem({ name: "", price: "", description: "", category: "" });
    setShowAdd(false);
  };

  const toggleAvailable = async (item: MenuItem) => {
    await updateDoc(doc(db, `restaurants/${restaurantId}/menu`, item.id), { isAvailable: !item.isAvailable });
  };

  const deleteItem = async (item: MenuItem) => {
    Alert.alert("ลบเมนู?", `ลบ "${item.name}" ใช่ไหม?`, [
      { text: "ยกเลิก" },
      { text: "ลบ", style: "destructive", onPress: () => deleteDoc(doc(db, `restaurants/${restaurantId}/menu`, item.id)) },
    ]);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}><Text style={styles.backBtn}>‹ กลับ</Text></TouchableOpacity>
        <Text style={styles.headerTitle}>จัดการเมนู</Text>
        <TouchableOpacity onPress={() => setShowAdd(true)}><Text style={styles.addBtn}>+ เพิ่ม</Text></TouchableOpacity>
      </View>
      <FlatList
        data={menu}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <View style={styles.menuCard}>
            <View style={styles.menuInfo}>
              <Text style={styles.menuName}>{item.name}</Text>
              <Text style={styles.menuPrice}>{item.price} บาท</Text>
              <Text style={styles.menuCat}>{item.category}</Text>
            </View>
            <View style={styles.menuActions}>
              <Switch value={item.isAvailable} onValueChange={() => toggleAvailable(item)} trackColor={{ true: "#2EC4B6" }} />
              <TouchableOpacity onPress={() => deleteItem(item)}><Text style={styles.deleteBtn}>ลบ</Text></TouchableOpacity>
            </View>
          </View>
        )}
        ListEmptyComponent={<Text style={styles.emptyText}>ยังไม่มีเมนู กด "+ เพิ่ม" เพื่อสร้าง</Text>}
      />
      <Modal visible={showAdd} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>เพิ่มเมนูใหม่</Text>
            <TextInput style={styles.input} placeholder="ชื่อเมนู" value={newItem.name} onChangeText={(v) => setNewItem({ ...newItem, name: v })} />
            <TextInput style={styles.input} placeholder="ราคา" keyboardType="decimal-pad" value={newItem.price} onChangeText={(v) => setNewItem({ ...newItem, price: v })} />
            <TextInput style={styles.input} placeholder="หมวดหมู่" value={newItem.category} onChangeText={(v) => setNewItem({ ...newItem, category: v })} />
            <TextInput style={styles.input} placeholder="คำอธิบาย" multiline value={newItem.description} onChangeText={(v) => setNewItem({ ...newItem, description: v })} />
            <View style={styles.modalActions}>
              <TouchableOpacity style={[styles.btn, styles.btnCancel]} onPress={() => setShowAdd(false)}><Text style={styles.btnText}>ยกเลิก</Text></TouchableOpacity>
              <TouchableOpacity style={[styles.btn, styles.btnConfirm]} onPress={addItem}><Text style={styles.btnText}>เพิ่ม</Text></TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8F9FA" },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", padding: 16, paddingTop: 50, backgroundColor: "#FF6B35" },
  backBtn: { color: "#fff", fontSize: 16 },
  headerTitle: { fontSize: 20, fontWeight: "bold", color: "#fff" },
  addBtn: { color: "#fff", fontSize: 16, fontWeight: "600" },
  list: { padding: 16 },
  menuCard: { flexDirection: "row", justifyContent: "space-between", backgroundColor: "#fff", borderRadius: 12, padding: 16, marginBottom: 8 },
  menuInfo: { flex: 1 },
  menuName: { fontSize: 16, fontWeight: "600", color: "#1A1A2E" },
  menuPrice: { fontSize: 15, fontWeight: "600", color: "#FF6B35", marginTop: 4 },
  menuCat: { fontSize: 13, color: "#6C757D", marginTop: 2 },
  menuActions: { alignItems: "flex-end" },
  deleteBtn: { color: "#E74C3C", fontSize: 14, marginTop: 8 },
  emptyText: { fontSize: 16, color: "#6C757D", textAlign: "center", marginTop: 40 },
  modalOverlay: { flex: 1, justifyContent: "center", backgroundColor: "rgba(0,0,0,0.5)", padding: 24 },
  modalContent: { backgroundColor: "#fff", borderRadius: 16, padding: 24 },
  modalTitle: { fontSize: 20, fontWeight: "bold", color: "#1A1A2E", marginBottom: 16 },
  input: { borderWidth: 1, borderColor: "#E0E0E0", borderRadius: 8, padding: 12, marginBottom: 8, fontSize: 16 },
  modalActions: { flexDirection: "row", marginTop: 8 },
  btn: { flex: 1, borderRadius: 8, padding: 14, alignItems: "center", marginHorizontal: 4 },
  btnCancel: { backgroundColor: "#E0E0E0" },
  btnConfirm: { backgroundColor: "#FF6B35" },
  btnText: { fontSize: 16, fontWeight: "600", color: "#1A1A2E" },
});
