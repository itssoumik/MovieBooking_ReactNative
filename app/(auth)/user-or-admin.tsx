import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";

import Button from "@/components/Button";

export default function WelcomeScreen() {
   const router = useRouter();
  
  const handleLogin = () => {
    router.push("/(auth)/login");
  };
  
  const handleAdminLogin = () => {
    router.push("/(auth)/admin-login");
  };
  
  return (
    <View style={styles.container}>
      <Image
        source={{ uri: "https://images.unsplash.com/photo-1616530940355-351fabd9524b?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60" }}
        style={styles.backgroundImage}
      />
      
      <LinearGradient
        colors={["transparent", "rgba(0,0,0,0.8)"]}
        style={styles.gradient}
      />
      
      <View style={styles.content}>
        <Text style={styles.title}>Grab Your Show</Text>
        <Text style={styles.subtitle}>
          Book movie tickets...
        </Text>
        
        <View style={styles.buttonContainer}>
          <Button
            title="User Login"
            onPress={handleLogin}
            style={styles.button}
          />
          
          <Button
            title="Admin Login"
            variant="outline"
            onPress={handleAdminLogin}
            style={styles.button}
            textStyle={styles.registerButtonText}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    ...StyleSheet.absoluteFillObject,
    width: "100%",
    height: "100%",
  },
  gradient: {
    ...StyleSheet.absoluteFillObject,
  },
  content: {
    flex: 1,
    justifyContent: "flex-end",
    padding: 24,
  },
  title: {
    fontSize: 40,
    fontWeight: "bold",
    color: "white",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    color: "rgba(255, 255, 255, 0.8)",
    marginBottom: 48,
  },
  buttonContainer: {
    gap: 16,
    marginBottom: 48,
  },
  button: {
    width: "100%",
  },
  registerButtonText: {
    color: "white",
  },
});