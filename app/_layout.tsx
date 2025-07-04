import Colors from "@/constants/colors";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState } from "react";
import { StatusBar } from "react-native";
import { ErrorBoundary } from "./error-boundary";
import { getAuth, onAuthStateChanged, FirebaseAuthTypes } from "@react-native-firebase/auth";

export const unstable_settings = {
  initialRouteName: "(tabs)",
};

// Prevent the splash screen from auto-hiding before assets load
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    ...FontAwesome.font,
  });

  useEffect(() => {
    if (error) {
      console.error(error);
      throw error;
    }
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <ErrorBoundary>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />
      <RootLayoutNav />
    </ErrorBoundary>
  );
}

function RootLayoutNav() {
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState<FirebaseAuthTypes.User | null>(null);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (newUser) => {
      // Only update if changed
      setUser((prevUser) => {
        if (prevUser?.uid !== newUser?.uid) {
          return newUser;
        }
        return prevUser;
      });

      // Mark initialization as complete
      setInitializing(false);
    });

    return unsubscribe;
  }, []);

  // Show nothing while initializing
  if (initializing) return null;

  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: Colors.background },
        headerTintColor: Colors.text,
        headerTitleStyle: { fontWeight: "600" },
        contentStyle: { backgroundColor: Colors.background },
      }}
    >
      {/* Screens for authenticated and unauthenticated flows */}
      <Stack.Protected guard={!!user}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack.Protected>
      <Stack.Protected guard={!user}>
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      </Stack.Protected>

      {/* Public screens */}
      <Stack.Protected guard={!!user}>
      <Stack.Screen
        name="movie/[id]"
        options={{ title: "Movie Details", headerBackTitle: "Back" }}
      />
      <Stack.Screen
        name="profile/edit"
        options={{ title: "Edit Profile", headerBackTitle: "Back" }}
      />
      <Stack.Screen
        name="theater/[id]"
        options={{ title: "Seat Map", headerBackTitle: "Back" }}
      />
      <Stack.Screen
        name="booking/[id]"
        options={{ title: "Booking Details", headerBackTitle: "Back" }}
      />
      <Stack.Screen
        name="checkout"
        options={{ title: "Checkout", headerBackTitle: "Back" }}
      />
      </Stack.Protected>
      
      {/* Authenticated admin screens */}
      <Stack.Screen
        name="admin-options/admin"
        options={{ title: "Admin Dashboard", headerBackTitle: "Back" }}
      />
       <Stack.Screen
        name="admin-options/add-movie"
        options={{ title: "Add Movie", headerBackTitle: "Back" }}
      />
      <Stack.Screen
        name="admin-options/edit-movie/[id]"
        options={{ title: "Edit Movie", headerBackTitle: "Back" }}
      />
    </Stack>
  );
}
