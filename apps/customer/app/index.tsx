import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image } from "react-native";
import { useRouter } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/services/firebase";
import type { Restaurant } from "@/types";

export default function HomeScreen() {
  const router = useRouter();

  const { data: restaurants, isLoading } = useQuery({
    queryKey: ["restaurants", "open"],
    queryFn: async () => {
      const q = query(collection(db, "restaurants"), where("isOpen", "==", true));
      const snap = await getDocs(q);
      return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Restaurant);
    },
  });

  const renderRestaurant = ({ item }: { item: Restaurant }) => (
    <TouchableOpacity
      style={styles.restaurantCard}
      onPress={() => router.push(`/restaurant/${item.id}`)}
    >
      <Image source={{ uri: item.imageUrl }} style={styles.restaurantImage} />
      <View style={styles.restaurantInfo}>
        <Text style={styles.restaurantName}>{item.name}</Text>
        <Text style={styles.restaurantMeta}>
          ⭐ {item.rating.toFixed(1)} · ค่าส่ง {item.deliveryFee} บาท
        </Text>
        <Text style={styles.restaurantMeta}>
          ขั้นต่ำ {item.minOrder} บาท
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>วังสามหมอ Food</Text>
        <Text style={styles.headerSubtitle}>สั่งอาหารใกล้คุณ</Text>
      </View>

      {isLoading ? (
        <Text style={styles.loadingText}>กำลังโหลดร้าน...</Text>
      ) : (
        <FlatList
          data={restaurants}
          keyExtractor={(item) => item.id}
          renderItem={renderRestaurant}
          contentContainerStyle={styles.list}
          ListEmptyComponent={<Text style={styles.emptyText}>ยังไม่มีร้านเปิดอยู่</Text>}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8F9FA" },
  header: { padding: 16, backgroundColor: "#FF6B35", paddingTop: 50 },
  headerTitle: { fontSize: 24, fontWeight: "bold", color: "#fff" },
  headerSubtitle: { fontSize: 14, color: "#fff", opacity: 0.9 },
  list: { padding: 16 },
  restaurantCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    marginBottom: 12,
    overflow: "hidden",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  restaurantImage: { width: "100%", height: 160 },
  restaurantInfo: { padding: 12 },
  restaurantName: { fontSize: 18, fontWeight: "600", color: "#1A1A2E" },
  restaurantMeta: { fontSize: 14, color: "#6C757D", marginTop: 4 },
  loadingText: { textAlign: "center", marginTop: 40, color: "#6C757D" },
  emptyText: { textAlign: "center", marginTop: 40, color: "#6C757D" },
});
