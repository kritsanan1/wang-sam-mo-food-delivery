import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

export default function RiderRootLayout() {
  return (
    <>
      <StatusBar style="dark" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="login" />
        <Stack.Screen name="job/[id]" />
        <Stack.Screen name="earnings" />
      </Stack>
    </>
  );
}
