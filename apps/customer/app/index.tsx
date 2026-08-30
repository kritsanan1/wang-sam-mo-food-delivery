import { useState, useMemo } from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, TextInput, ScrollView, Platform } from "react-native";
import { useRouter } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/services/firebase";
import { useUserLocation, haversineDistance } from "@/hooks/useUserLocation";
import { CartBadge } from "@/components/CartBadge";
import type { Restaurant } from "@/types";

const CATEGORIES = [
  { label: "ทั้งหมด", icon: "🍴" },
  { label: "ไทย", icon: "🍛" },
  { label: "อีสาน", icon: "🌶️" },
  { label: "ก๋วยเตี๋ยว", icon: "🍜" },
  { label: "ปิ้งย่าง", icon: "🔥" },
  { label: "ส้มตำ", icon: "🥗" },
  { label: "กาแฟ", icon: "☕" },
  { label: "เครื่องดื่ม", icon: "🥤" },
  { label: "ขนม", icon: "🍰" },
];

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
      activeOpacity={0.85}
    >
      {item.imageUrl ? (
        <Image source={{ uri: item.imageUrl }} style={styles.restaurantImage} />
      ) : (
        <View style={[styles.restaurantImage, styles.imagePlaceholder]}>
          <Text style={styles.imagePlaceholderText}>🍽️</Text>
        </View>
      )}
      {!item.isOpen && (
        <View style={styles.closedOverlay}>
          <Text style={styles.closedOverlayText}>ปิดอยู่</Text>
        </View>
      )}
      <View style={styles.restaurantInfo}>
        <View style={styles.restaurantHeader}>
          <Text style={styles.restaurantName} numberOfLines={1}>{item.name}</Text>
          <View style={styles.ratingBadge}>
            <Text style={styles.ratingText}>⭐ {item.rating?.toFixed(1) || "ใหม่"}</Text>
          </View>
        </View>
        <View style={styles.metaRow}>
          <Text style={styles.metaItem}>🛵 ค่าส่ง {item.deliveryFee}฿</Text>
          <Text style={styles.metaItem}>📦 ขั้นต่ำ {item.minOrder}฿</Text>
          {item.distance !== undefined && (
            <Text style={styles.distanceText}>
              📍 {item.distance < 1 ? `${Math.round(item.distance * 1000)}ม.` : `${item.distance.toFixed(1)}กม.`}
            </Text>
          )}
        </View>
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
      {/* Gradient header */}
      <View style={styles.headerGradient}>
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.headerTitle}>วังสามหมอ Food</Text>
            <Text style={styles.headerSubtitle}>สั่งอาหารใกล้คุณ 🍽️</Text>
          </View>
          <CartBadge />
        </View>
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="🔍 ค้นหาร้าน / เมนู..."
            placeholderTextColor="#ADB5BD"
            value={search}
            onChangeText={setSearch}
          />
        </View>
      </View>

      {/* Category bar */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryBar} contentContainerStyle={styles.categoryBarContent}>
        {CATEGORIES.map((cat) => (
          <TouchableOpacity
            key={cat.label}
            style={[styles.catChip, selectedCategory === cat.label && styles.catChipActive]}
            onPress={() => setSelectedCategory(cat.label)}
          >
            <Text style={styles.catChipIcon}>{cat.icon}</Text>
            <Text style={[styles.catChipText, selectedCategory === cat.label && styles.catChipTextActive]}>{cat.label}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>กำลังโหลดร้าน...</Text>
        </View>
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(item) => item.id}
          renderItem={renderRestaurant}
          contentContainerStyle={styles.list}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyIcon}>🔍</Text>
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
  headerGradient: {
    paddingTop: 50,
    paddingBottom: 16,
    paddingHorizontal: 16,
    backgroundColor: "#FF6B35",
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    ...Platform.select({
      ios: { shadowColor: "#FF6B35", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8 },
      android: { elevation: 8 },
    }),
  },
  headerTop: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 12 },
  headerTitle: { fontSize: 26, fontWeight: "bold", color: "#fff" },
  headerSubtitle: { fontSize: 14, color: "#fff", opacity: 0.9, marginTop: 2 },
  searchContainer: {},
  searchInput: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 14,
    fontSize: 15,
    color: "#1A1A2E",
    ...Platform.select({
      ios: { shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4 },
      android: { elevation: 3 },
    }),
  },
  categoryBar: { maxHeight: 56, backgroundColor: "#fff", borderBottomWidth: 1, borderBottomColor: "#F0F0F0" },
  categoryBarContent: { paddingHorizontal: 12, paddingVertical: 10, alignItems: "center" },
  catChip: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    backgroundColor: "#F8F9FA",
  },
  catChipActive: { backgroundColor: "#FF6B35" },
  catChipIcon: { fontSize: 16, marginRight: 4 },
  catChipText: { fontSize: 13, color: "#6C757D", fontWeight: "500" },
  catChipTextActive: { color: "#fff" },
  list: { padding: 16, paddingTop: 12 },
  restaurantCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    marginBottom: 14,
    overflow: "hidden",
    ...Platform.select({
      ios: { shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 8 },
      android: { elevation: 4 },
    }),
  },
  restaurantImage: { width: "100%", height: 180 },
  imagePlaceholder: { backgroundColor: "#F0F0F0", alignItems: "center", justifyContent: "center" },
  imagePlaceholderText: { fontSize: 48 },
  closedOverlay: { position: "absolute", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0,0,0,0.5)", alignItems: "center", justifyContent: "center", height: 180 },
  closedOverlayText: { color: "#fff", fontSize: 18, fontWeight: "bold" },
  restaurantInfo: { padding: 16 },
  restaurantHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 8 },
  restaurantName: { fontSize: 18, fontWeight: "600", color: "#1A1A2E", flex: 1, marginRight: 8 },
  ratingBadge: { backgroundColor: "#FFF5F0", borderRadius: 12, paddingHorizontal: 10, paddingVertical: 4 },
  ratingText: { fontSize: 13, color: "#FF6B35", fontWeight: "600" },
  metaRow: { flexDirection: "row", gap: 12 },
  metaItem: { fontSize: 13, color: "#6C757D" },
  distanceText: { fontSize: 13, color: "#2EC4B6", fontWeight: "500" },
  categoryRow: { flexDirection: "row", marginTop: 10 },
  categoryChip: { backgroundColor: "#FFF5F0", borderRadius: 8, paddingHorizontal: 10, paddingVertical: 4, marginRight: 6 },
  categoryChipText: { fontSize: 12, color: "#FF6B35", fontWeight: "500" },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  loadingText: { fontSize: 16, color: "#6C757D" },
  emptyContainer: { alignItems: "center", marginTop: 80 },
  emptyIcon: { fontSize: 48, marginBottom: 12 },
  emptyText: { fontSize: 18, color: "#6C757D", fontWeight: "500" },
  emptySubtext: { fontSize: 14, color: "#ADB5BD", marginTop: 4 },
});
