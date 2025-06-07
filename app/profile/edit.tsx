import React, { useState } from "react";
import { 
  StyleSheet, 
  Text, 
  View, 
  TouchableOpacity, 
  Image,
  Alert
} from "react-native";
import { useRouter } from "expo-router";
import { User, Mail, Camera } from "lucide-react-native";
import * as ImagePicker from "expo-image-picker";
import { useAuthStore } from "@/store/auth-store";
import Colors from "@/constants/colors";
import Input from "@/components/Input";
import Button from "@/components/Button";
import { uploadToCloudinary } from "@/utils/uploadToCloudinary";

export default function EditProfileScreen() {
  const router = useRouter();
  const { user, updateProfile, isLoading } = useAuthStore();
  
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [avatar, setAvatar] = useState(user?.avatar || "");
  
  const handlePickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (permissionResult.granted === false) {
      Alert.alert("Permission Required", "You need to allow access to your photos to change your profile picture.");
      return;
    }
    
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });
    
    if (!result.canceled) {
      setAvatar(result.assets[0].uri);
    }
  };
  
  const handleSave = async () => {
  if (!name) {
    Alert.alert("Error", "Name is required");
    return;
  }

  await updateProfile({
    name,
    avatar,
  });

  router.back();
};

  
  return (
    <View style={styles.container}>
      <View style={styles.avatarContainer}>
        {avatar ? (
          <Image source={{ uri: avatar }} style={styles.avatar} />
        ) : (
          <View style={styles.avatarPlaceholder}>
            <Text style={styles.avatarText}>
              {name.charAt(0) || "U"}
            </Text>
          </View>
        )}
        
        <TouchableOpacity 
          style={styles.changeAvatarButton}
          onPress={handlePickImage}
        >
          <Camera size={20} color={Colors.card} />
        </TouchableOpacity>
      </View>
      
      <View style={styles.form}>
        <Input
          label="Name"
          placeholder="Enter your name"
          value={name}
          onChangeText={setName}
          leftIcon={<User size={20} color={Colors.textSecondary} />}
        />
        
        <Input
          label="Email"
          placeholder="Enter your email"
          value={email}
          onChangeText={setEmail}
          editable={false}
          leftIcon={<Mail size={20} color={Colors.textSecondary} />}
        />
        
        <Button
          title="Save Changes"
          onPress={handleSave}
          loading={isLoading}
          disabled={!name}
          style={styles.saveButton}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    padding: 16,
  },
  avatarContainer: {
    alignItems: "center",
    marginVertical: 24,
    position: "relative",
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  avatarPlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: Colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    fontSize: 48,
    fontWeight: "bold",
    color: Colors.card,
  },
  changeAvatarButton: {
    position: "absolute",
    bottom: 0,
    right: 100,
    backgroundColor: Colors.primary,
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 3,
    borderColor: Colors.background,
  },
  form: {
    marginTop: 16,
  },
  saveButton: {
    marginTop: 24,
  },
});