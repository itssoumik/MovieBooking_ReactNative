import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import firestore from "@react-native-firebase/firestore";
import { User } from "@/types";
import auth from "@react-native-firebase/auth";

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  updateProfile: (userData: Partial<User>) => Promise<void>;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (email, password) => {
        set({ isLoading: true, error: null });
        try {
          await AsyncStorage.setItem("userEmail", email);

          const userDoc = await firestore().collection("Users").doc(email).get();
          const userData = userDoc.data();

          if (!userData) {
            throw new Error("User profile not found");
          }

          const user: User = {
            id: email,
            email,
            name: userData.username || "User",
            avatar: userData.avatar || "",
          };

          set({
            user,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : "Login failed",
            isLoading: false,
          });
        }
      },

      register: async (name, email, password) => {
        set({ isLoading: true, error: null });

        try {
          const defaultAvatar = "https://res.cloudinary.com/dcyah4eaw/image/upload/v1749206662/placeholder-profile-icon-orange-6cgz191l5ancz0mu_giautn.png";

          // Save new user to Firestore
          await firestore().collection("Users").doc(email).set({
            username: name,
            avatar: defaultAvatar,
          });

          await AsyncStorage.setItem("userEmail", email);

          const user: User = {
            id: email,
            email,
            name,
            avatar: defaultAvatar,
          };

          set({
            user,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : "Registration failed",
            isLoading: false,
          });
        }
      },

      logout: async () => {
        try {
          await auth().signOut(); // Firebase sign out
          await AsyncStorage.removeItem("userEmail"); // Remove saved email

          set({
            user: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,
          });
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : "Logout failed",
          });
        }
      },

      updateProfile: async (userData) => {
        set({ isLoading: true, error: null });
        try {
          const email = await AsyncStorage.getItem("userEmail");
          if (!email) throw new Error("No user email found in storage");

          await firestore().collection("Users").doc(email).update(userData);

          set((state) => ({
            user: state.user ? { ...state.user, ...userData } : null,
            isLoading: false,
          }));
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : "Update failed",
            isLoading: false,
          });
        }
      },
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);