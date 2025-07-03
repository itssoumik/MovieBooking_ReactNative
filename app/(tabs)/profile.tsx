import React from "react";
import { 
  StyleSheet, 
  Text, 
  View, 
  Image, 
  ScrollView,
  TouchableOpacity,
  Alert
} from "react-native";
import { useRouter } from "expo-router";
import { 
  Search,
  User, 
  Mail, 
  Edit, 
  LogOut, 
  Ticket, 
  Star, 
  Settings 
} from "lucide-react-native";
import Colors from "@/constants/colors";
import Button from "@/components/Button";
import auth from "@react-native-firebase/auth";
import { useAuthStore } from "@/store/auth-store";




export default function profile() {
  const router = useRouter();
  const { user, logout } = useAuthStore(); // destructure 'user' and 'logout'

  
  const handleEditProfile = () => {
    router.push("/profile/edit");
  };
  
  const handleMyBookings = () => {
    router.push("/bookings");
  };
  const handleSearch = () => {
    router.push("/search");
  };

  const handleLogout = async () => {
  try {
    await logout();
    router.replace("/(auth)");
  } catch (e) {
    console.error("Logout error:", e);
    Alert.alert("Logout Error", "Failed to log out. Please try again.");
  }
};
console.log("User:", user?.avatar, user?.name, user?.email);


  return (
     <ScrollView style={styles.container}>
      <View style={styles.header}>
        {user?.avatar ? (
  <Image source={{ uri: user.avatar }} style={styles.avatar} />
) : (
  <View style={styles.avatarPlaceholder}>
    <Text style={styles.avatarText}>
      {user?.name?.charAt(0) || "U"}
    </Text>
  </View>
)}

<Text style={styles.name}>{user?.name}</Text>
<Text style={styles.email}>{user?.email}</Text>

        
        <Button
          title="Edit Profile"
          variant="outline"
          size="small"
          onPress={handleEditProfile}
          icon={<Edit size={16} color={Colors.primary} />}
          style={styles.editButton}
        />
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Account</Text>

        <TouchableOpacity 
          style={styles.menuItem}
          onPress={handleSearch}
        >
          <View style={styles.menuIconContainer}>
            <Search size={20} color={Colors.primary} />
          </View>
          <View style={styles.menuContent}>
            <Text style={styles.menuTitle}>Search</Text>
            <Text style={styles.menuDescription}>
              Find movies and shows
            </Text>
          </View>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.menuItem}
          onPress={handleMyBookings}
        >
          <View style={styles.menuIconContainer}>
            <Ticket size={20} color={Colors.primary} />
          </View>
          <View style={styles.menuContent}>
            <Text style={styles.menuTitle}>My Bookings</Text>
            <Text style={styles.menuDescription}>
              View all your movie bookings
            </Text>
          </View>
        </TouchableOpacity>
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>App</Text>
        
        <TouchableOpacity 
          style={styles.menuItem}
          onPress={handleLogout}
        >
          <View style={styles.menuIconContainer}>
            <LogOut size={20} color={Colors.error} />
          </View>
          <View style={styles.menuContent}>
            <Text style={[styles.menuTitle, styles.logoutText]}>Logout</Text>
            <Text style={styles.menuDescription}>
              Sign out from your account
            </Text>
          </View>
        </TouchableOpacity>
      </View>
      
      <View style={styles.footer}>
        <Text style={styles.footerText}>GrabYourShow v1.0.0</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    alignItems: "center",
    padding: 24,
    backgroundColor: Colors.card,
    borderRadius: 24,
    marginHorizontal: 16,
    marginTop: 8,
    marginBottom: 16,
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 16,
  },
  avatarPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: Colors.primary,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  avatarText: {
    fontSize: 40,
    fontWeight: "bold",
    color: Colors.card,
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
    color: Colors.text,
    marginBottom: 4,
  },
  email: {
    fontSize: 16,
    color: Colors.textSecondary,
    marginBottom: 16,
  },
  editButton: {
    paddingHorizontal: 24,
  },
  section: {
    //padding: 8,
    //marginBottom: 5,
    marginHorizontal: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.text,
    marginBottom: 16,
    marginLeft: 5,
  },
  menuItem: {
    flexDirection: "row",
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  menuIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primaryLight,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },
  menuContent: {
    flex: 1,
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.text,
    marginBottom: 4,
  },
  menuDescription: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  logoutText: {
    color: Colors.error,
  },
  footer: {
    padding: 70,
    alignItems: "center",
  },
  footerText: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
});
