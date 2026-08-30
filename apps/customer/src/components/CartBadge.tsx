import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { useCartStore } from "@/store/cart";

export function CartBadge() {
  const router = useRouter();
  const getTotalItems = useCartStore((s) => s.getTotalItems);
  const count = getTotalItems();

  if (count === 0) return null;

  return (
    <TouchableOpacity style={styles.badge} onPress={() => router.push("/cart")}>
      <Text style={styles.badgeText}>🛒 {count}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  badge: {
    backgroundColor: "#fff",
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
  },
  badgeText: { fontSize: 14, fontWeight: "600", color: "#FF6B35" },
});
