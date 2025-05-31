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
import { LogOut } from "lucide-react-native";
import Colors from "@/constants/colors";
import auth from "@react-native-firebase/auth";



export default function profile() {

  const handleLogout = () => {
    auth().signOut()
      .then(() => {
        console.log('User signed out from Home!');
      })
      .catch((e) => {
        console.error('Error signing out:', e);
        Alert.alert('Logout Error', 'Failed to log out. Please try again.');
      });
  };

  return (
    <View>
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
  )
}

const styles = StyleSheet.create({
 
  
  
  
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
});


