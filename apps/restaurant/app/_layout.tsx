import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

export default function RestaurantRootLayout() {
  return (
    <>
      <StatusBar style="dark" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="login" />
        <Stack.Screen name="menu" />
        <Stack.Screen name="reports" />
      </Stack>
    </>
  );
}
