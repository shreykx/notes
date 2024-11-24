import { Stack } from "expo-router";

export default function RootLayout() {
  return <Stack>
    <Stack.Screen name="index" options={{ headerShown: false }} />
    <Stack.Screen name="write" options={{ headerShown: false, animation: 'slide_from_bottom' }} />

  </Stack>;
}
