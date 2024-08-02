import { Stack } from 'expo-router';
import { WeatherProvider } from './WeatherContext';
export default function RootLayout() {
  return (
    <WeatherProvider>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" />
      </Stack>
    </WeatherProvider>
  );
}
