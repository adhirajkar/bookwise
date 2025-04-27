import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import SafeScreen from "../components/SafeScreen";
import { authStore } from "../store/authStore";
import { useSegments, useRouter } from "expo-router";
import { useEffect } from "react";

export default function RootLayout() {
  const segment = useSegments();
  const router = useRouter();
  const {checkAuth, user, token} = authStore();

  useEffect(()=>{
    checkAuth();
  },[])

  useEffect(()=>{
    const inAuthScreen = segment[0] === '(auth)'
    const isLoggedIn = user && token;
    if(!inAuthScreen && !isLoggedIn) router.push('/(auth)')
    else if(inAuthScreen && isLoggedIn) router.push('/(tabs)')
  },[segment, user, token])

  return (
    <SafeAreaProvider>
      <SafeScreen>
        <Stack screenOptions={{headerShown: false}}>
          <Stack.Screen name="(tabs)"  />
          <Stack.Screen name="(auth)"  />
        </Stack>
      </SafeScreen>
    </SafeAreaProvider>
  );
}
