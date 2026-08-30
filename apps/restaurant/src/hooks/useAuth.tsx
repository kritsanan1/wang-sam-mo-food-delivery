import { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from "react-native";
import { useRouter, usePathname } from "expo-router";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "@/services/firebase";

const PUBLIC_ROUTES = ["/login"];

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  return { user, loading };
}

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && !user && !PUBLIC_ROUTES.includes(pathname)) {
      router.replace("/login");
    }
  }, [user, loading, pathname, router]);

  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#FF6B35" />
        <Text style={styles.loadingText}>กำลังโหลด...</Text>
      </View>
    );
  }

  if (!user && !PUBLIC_ROUTES.includes(pathname)) {
    return (
      <View style={styles.loading}>
        <Text style={styles.loadingText}>กรุณาเข้าสู่ระบบร้าน</Text>
        <TouchableOpacity style={styles.loginBtn} onPress={() => router.replace("/login")}>
          <Text style={styles.loginBtnText}>เข้าสู่ระบบ</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return <>{children}</>;
}

const styles = StyleSheet.create({
  loading: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#F8F9FA" },
  loadingText: { marginTop: 12, fontSize: 16, color: "#6C757D" },
  loginBtn: { backgroundColor: "#FF6B35", borderRadius: 12, padding: 16, marginTop: 16 },
  loginBtnText: { color: "#fff", fontSize: 16, fontWeight: "600" },
});
