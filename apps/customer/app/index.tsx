import { useState, useMemo } from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, TextInput, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/services/firebase";
import { useUserLocation, haversineDistance } from "@/hooks/useUserLocation";
import { CartBadge } from "@/components/CartBadge";
import type { Restaurant } from "@/types";

const CATEGORIES = ["ทั้งหมด", "ไทย", "อีสาน", "ก๋วยเตี๋ยว", "ปิ้งย่าง", "ส้มตำ", "กาแฟ", "เครื่องดื่ม", "ขนม"];

export default function HomeScreen() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("ทั้งหมด");
  const { location } = useUserLocation();

  const { data: restaurants, isLoading } = useQuery({
    queryKey: ["restaurants", "all"],
    queryFn: async () => {
      const q = query(collection(db, "restaurants"), where("status", "==", "active"));
      const snap = await getDocs(q);
      return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Restaurant);
    },
  });

  const filtered = useMemo(() => {
    let list = restaurants || [];
    if (selectedCategory !== "ทั้งหมด") {
      list = list.filter((r) => r.categories?.includes(selectedCategory));
    }
    if (search.trim()) {
      const s = search.toLowerCase();
      list = list.filter((r) => r.name.toLowerCase().includes(s));
    }
    if (location) {
      list = list.map((r) => ({
        ...r,
        distance: r.geo ? haversineDistance(location.lat, location.lng, r.geo.lat, r.geo.lng) : undefined,
      }));
      list.sort((a, b) => (a.distance || 999) - (b.distance || 999));
    }
    return list;
  }, [restaurants, search, selectedCategory, location]);

  const renderRestaurant = ({ item }: { item: Restaurant }) => (
    <TouchableOpacity
      style={styles.restaurantCard}
      onPress={() => router.push(`/restaurant/${item.id}`)}
    >
      {item.imageUrl ? (
        <Image source={{ uri: item.imageUrl }} style={styles.restaurantImage} />
      ) : (
        <View style={[styles.restaurantImage, styles.imagePlaceholder]}>
          <Text style={styles.imagePlaceholderText}>🍽️</Text>
        </View>
      )}
      <View style={styles.restaurantInfo}>
        <View style={styles.restaurantHeader}>
          <Text style={styles.restaurantName}>{item.name}</Text>
          {!item.isOpen && <Text style={styles.closedBadge}>ปิดอยู่</Text>}
        </View>
        <Text style={styles.restaurantMeta}>
          ⭐ {item.rating?.toFixed(1) || "ใหม่"} · ค่าส่ง {item.deliveryFee} บาท · ขั้นต่ำ {item.minOrder} บาท
        </Text>
        {item.distance !== undefined && (
          <Text style={styles.distanceText}>📍 {item.distance < 1 ? `${Math.round(item.distance * 1000)} ม.` : `${item.distance.toFixed(1)} กม.`}</Text>
        )}
        {item.categories && (
          <View style={styles.categoryRow}>
            {item.categories.slice(0, 3).map((cat) => (
              <View key={cat} style={styles.categoryChip}>
                <Text style={styles.categoryChipText}>{cat}</Text>
              </View>
            ))}
          </View>
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.headerTitle}>วังสามหมอ Food</Text>
            <Text style={styles.headerSubtitle}>สั่งอาหารใกล้คุณ</Text>
          </View>
          <CartBadge />
        </View>
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="🔍 ค้นหาร้าน / เมนู..."
            value={search}
            onChangeText={setSearch}
          />
        </View>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryBar} contentContainerStyle={styles.categoryBarContent}>
        {CATEGORIES.map((cat) => (
          <TouchableOpacity
            key={cat}
            style={[styles.catChip, selectedCategory === cat && styles.catChipActive]}
            onPress={() => setSelectedCategory(cat)}
          >
            <Text style={[styles.catChipText, selectedCategory === cat && styles.catChipTextActive]}>{cat}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {isLoading ? (
        <Text style={styles.loadingText}>กำลังโหลดร้าน...</Text>
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(item) => item.id}
          renderItem={renderRestaurant}
          contentContainerStyle={styles.list}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>ไม่พบร้านที่ค้นหา</Text>
              <Text style={styles.emptySubtext}>ลองเปลี่ยนหมวดหมู่หรือคำค้นหา</Text>
            </View>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8F9FA" },
  header: { padding: 16, paddingTop: 50, backgroundColor: "#FF6B35" },
  headerTop: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  headerTitle: { fontSize: 24, fontWeight: "bold", color: "#fff" },
  headerSubtitle: { fontSize: 14, color: "#fff", opacity: 0.9 },
  searchContainer: { marginTop: 12 },
  searchInput: { backgroundColor: "#fff", borderRadius: 12, padding: 12, fontSize: 15 },
  categoryBar: { maxHeight: 50, backgroundColor: "#fff", borderBottomWidth: 1, borderBottomColor: "#F0F0F0" },
  categoryBarContent: { paddingHorizontal: 12, paddingVertical: 10, alignItems: "center" },
  catChip: { paddingHorizontal: 14, paddingVertical: 6, borderRadius: 16, marginRight: 8, backgroundColor: "#F8F9FA" },
  catChipActive: { backgroundColor: "#FF6B35" },
  catChipText: { fontSize: 13, color: "#6C757D", fontWeight: "500" },
  catChipTextActive: { color: "#fff" },
  list: { padding: 16 },
  restaurantCard: { backgroundColor: "#fff", borderRadius: 12, marginBottom: 12, overflow: "hidden", elevation: 2, shadowColor: "#000", shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 4 },
  restaurantImage: { width: "100%", height: 160 },
  imagePlaceholder: { backgroundColor: "#F8F9FA", alignItems: "center", justifyContent: "center" },
  imagePlaceholderText: { fontSize: 40 },
  restaurantInfo: { padding: 14 },
  restaurantHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  restaurantName: { fontSize: 18, fontWeight: "600", color: "#1A1A2E", flex: 1 },
  closedBadge: { backgroundColor: "#F8D7DA", color: "#721C24", fontSize: 12, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 10, marginLeft: 8 },
  restaurantMeta: { fontSize: 14, color: "#6C757D", marginTop: 6 },
  distanceText: { fontSize: 14, color: "#2EC4B6", marginTop: 4, fontWeight: "500" },
  categoryRow: { flexDirection: "row", marginTop: 8 },
  categoryChip: { backgroundColor: "#FFF5F0", borderRadius: 8, paddingHorizontal: 8, paddingVertical: 3, marginRight: 6 },
  categoryChipText: { fontSize: 12, color: "#FF6B35" },
  loadingText: { textAlign: "center", marginTop: 40, color: "#6C757D", fontSize: 16 },
  emptyContainer: { alignItems: "center", marginTop: 60 },
  emptyText: { fontSize: 18, color: "#6C757D", fontWeight: "500" },
  emptySubtext: { fontSize: 14, color: "#ADB5BD", marginTop: 4 },
});
