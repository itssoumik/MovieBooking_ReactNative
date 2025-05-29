import Button from "@/components/Button";
import Input from "@/components/Input";
import Colors from "@/constants/colors";
import { useRouter } from "expo-router";
import { Eye, EyeOff, Lock, Mail } from "lucide-react-native";
import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = () => {
    if (email === 'admin@gmail.com' && password === 'admin') {
        router.replace("/(tabs)");
    } else {
      alert('Login failed. Invalid email or password.');
    }
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const navigateToRegister = () => {
    router.push("/(auth)/register");
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Welcome Back Admin</Text>
        <Text style={styles.subtitle}>
          Login to continue...
        </Text>
      </View>

      <View style={styles.form}>
        <Input
          label="Email"
          placeholder="Enter your email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          leftIcon={<Mail size={20} color={Colors.textSecondary} />}
        />

        <Input
          label="Password"
          placeholder="Enter your password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={!showPassword}
          leftIcon={<Lock size={20} color={Colors.textSecondary} />}
          rightIcon={
            <TouchableOpacity onPress={toggleShowPassword}>
              {showPassword ? (
                <EyeOff size={20} color={Colors.textSecondary} />
              ) : (
                <Eye size={20} color={Colors.textSecondary} />
              )}
            </TouchableOpacity>
          }
        />

        <Button
          title="Login"
          onPress={handleLogin}
          disabled={!email || !password}
          style={styles.loginButton}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
  },
  header: {
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: Colors.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.textSecondary,
  },
  form: {
    marginBottom: 24,
  },
  loginButton: {
    marginTop: 16,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 16,
  },
  footerText: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginRight: 4,
  },
  registerText: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.primary,
  },
});
