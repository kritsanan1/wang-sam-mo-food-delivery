import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, ScrollView } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/services/firebase";
import type { MenuItem } from "@/types";

export default function RestaurantDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();

  const { data: menu, isLoading } = useQuery({
    queryKey: ["menu", id],
    queryFn: async () => {
      const snap = await getDocs(collection(db, `restaurants/${id}/menu`));
      return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as MenuItem);
    },
  });

  const grouped = (menu || []).reduce<Record<string, MenuItem[]>>((acc, item) => {
    (acc[item.category] ||= []).push(item);
    return acc;
  }, {});

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backBtn}>‹ กลับ</Text>
        </TouchableOpacity>
      </View>

      {isLoading ? (
        <Text style={styles.loadingText}>กำลังโหลดเมนู...</Text>
      ) : (
        <ScrollView>
          {Object.entries(grouped).map(([category, items]) => (
            <View key={category} style={styles.categorySection}>
              <Text style={styles.categoryTitle}>{category}</Text>
              {items.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  style={styles.menuItem}
                  onPress={() => router.push(`/item/${item.id}?restaurantId=${id}`)}
                  disabled={!item.isAvailable}
                >
                  <View style={styles.menuItemInfo}>
                    <Text style={[styles.menuItemName, !item.isAvailable && styles.unavailable]}>
                      {item.name}
                    </Text>
                    <Text style={styles.menuItemDesc}>{item.description}</Text>
                    <Text style={styles.menuItemPrice}>{item.price} บาท</Text>
                    {!item.isAvailable && <Text style={styles.soldOut}>หมด</Text>}
                  </View>
                  {item.imageUrl ? (
                    <Image source={{ uri: item.imageUrl }} style={styles.menuItemImage} />
                  ) : null}
                </TouchableOpacity>
              ))}
            </View>
          ))}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8F9FA" },
  header: { padding: 16, paddingTop: 50, backgroundColor: "#FF6B35" },
  backBtn: { color: "#fff", fontSize: 16, fontWeight: "600" },
  loadingText: { textAlign: "center", marginTop: 40, color: "#6C757D" },
  categorySection: { marginBottom: 16 },
  categoryTitle: { fontSize: 18, fontWeight: "bold", color: "#1A1A2E", padding: 16, backgroundColor: "#fff" },
  menuItem: { flexDirection: "row", backgroundColor: "#fff", padding: 16, borderBottomWidth: 1, borderBottomColor: "#F0F0F0" },
  menuItemInfo: { flex: 1 },
  menuItemName: { fontSize: 16, fontWeight: "600", color: "#1A1A2E" },
  menuItemDesc: { fontSize: 14, color: "#6C757D", marginTop: 4 },
  menuItemPrice: { fontSize: 16, fontWeight: "600", color: "#FF6B35", marginTop: 8 },
  unavailable: { color: "#ADB5BD" },
  soldOut: { color: "#E74C3C", fontSize: 12, marginTop: 4 },
  menuItemImage: { width: 80, height: 80, borderRadius: 8, marginLeft: 12 },
});
