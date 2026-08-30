import { Stack, Tabs } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { StyleSheet } from "react-native";
import { useCartStore } from "@/store/cart";

export default function RootLayout() {
  const getTotalItems = useCartStore((s) => s.getTotalItems);
  const cartCount = getTotalItems();

  return (
    <>
      <StatusBar style="dark" />
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: "#FF6B35",
          tabBarInactiveTintColor: "#6C757D",
          tabBarStyle: styles.tabBar,
          tabBarLabelStyle: styles.tabBarLabel,
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: "หน้าแรก",
            tabBarBadge: cartCount > 0 ? cartCount : undefined,
          }}
        />
        <Tabs.Screen
          name="orders"
          options={{
            title: "คำสั่ง",
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: "โปรไฟล์",
          }}
        />
        <Tabs.Screen
          name="login"
          options={{
            title: "เข้าสู่ระบบ",
            href: null,
          }}
        />
        <Tabs.Screen
          name="restaurant/[id]"
          options={{
            title: "ร้านอาหาร",
            href: null,
          }}
        />
        <Tabs.Screen
          name="item/[id]"
          options={{
            title: "เมนู",
            href: null,
          }}
        />
        <Tabs.Screen
          name="cart"
          options={{
            title: "รถเข็น",
            href: null,
          }}
        />
        <Tabs.Screen
          name="checkout"
          options={{
            title: "สั่งซื้อ",
            href: null,
          }}
        />
        <Tabs.Screen
          name="order/[id]"
          options={{
            title: "ติดตามคำสั่ง",
            href: null,
          }}
        />
      </Tabs>
    </>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#F0F0F0",
    paddingBottom: 4,
    paddingTop: 4,
    height: 56,
  },
  tabBarLabel: {
    fontSize: 12,
    fontWeight: "500",
  },
});
