import Button from "@/components/Button";
import Input from "@/components/Input";
import Colors from "@/constants/colors";
import { FirebaseError } from "firebase/app";
import { useRouter } from "expo-router";
import { Eye, EyeOff, Lock, Mail, User2 } from "lucide-react-native";
import React, { use, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import {useAuthStore} from "@/store/auth-store";

export default function RegisterScreen() {
  const router = useRouter();
  const { register } = useAuthStore(); // Use the register function from auth store
  //const auth=getAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleRegistration = async () => {
    
    setLoading(true);
    if(email==="admin@gmail.com"){
      alert("This email is reserved for admin. Please use a different email.");
      setLoading(false);
      return;
    }
    else{
      try {
      await register(username, email, password);
      router.replace("/(tabs)"); // Navigate to main app
    }
    catch (error: any) {
      const err=error as FirebaseError;
      if (err.code === 'auth/email-already-in-use') {
        alert("This email is already registered. Please use a different email.");
      } else if (err.code === 'auth/invalid-email') {
        alert("Invalid email format. Please enter a valid email.");
      } else if (err.code === 'auth/weak-password') {
        alert("Weak password. Please choose a stronger password.");
      } else {
        console.error("Registration error:", {err});
      }
    } finally {
      setLoading(false);
    }
    }
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const navigateToLogin = () => {
    router.push("/(auth)/login");
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Create Account</Text>
        <Text style={styles.subtitle}>
          Sign up to start booking your favorite movies
        </Text>
      </View>

      <View style={styles.form}>
        <Input
          label="Username"
          placeholder="Enter your username"
          value={username}
          onChangeText={setUsername}
          leftIcon={<User2 size={20} color={Colors.textSecondary} />}
        />

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
          title="Create Account"
          onPress={handleRegistration}
          disabled={!email || !password}
          style={styles.loginButton}
        />
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Already have an account?</Text>
        <TouchableOpacity onPress={navigateToLogin}>
          <Text style={styles.registerText}>Login</Text>
        </TouchableOpacity>
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
