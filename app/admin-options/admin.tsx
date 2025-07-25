import React, { useEffect } from "react";
import { 
  StyleSheet, 
  Text, 
  View, 
  FlatList,
  TouchableOpacity,
  Alert
} from "react-native";
import { useRouter } from "expo-router";
import { Plus, Edit, Trash,LogOut } from "lucide-react-native";
import { useMovieStore } from "@/store/movie-store";
import Colors from "@/constants/colors";
import Button from "@/components/Button";
import MovieCard from "@/components/MovieCard";

export default function AdminScreen() {
  const router = useRouter();
  const { movies, fetchMovies, deleteMovie, isLoading } = useMovieStore();
  
  useEffect(() => {
    fetchMovies();
  }, []);
  
  
  const handleAddMovie = () => {
    router.push("/admin-options/add-movie");
  };
  
  const handleEditMovie = (movieId: string) => {
    router.push(`/admin-options/edit-movie/${movieId}`);
  };
  
  const handleDeleteMovie = (movieId: string) => {
    Alert.alert(
      "Delete Movie",
      "Are you sure you want to delete this movie?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Delete",
          onPress: () => deleteMovie(movieId),
          style: "destructive"
        }
      ]
    );
  };
  

  
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Button
          title="Add Movie"
          onPress={handleAddMovie}
          icon={<Plus size={16} color={Colors.card} />}
          size="small"
        />
        <Button
          title=" Logout "
          //variant="outline"
          style={{ backgroundColor: Colors.error , borderColor: Colors.error }}
          textStyle={{ color: Colors.card }}
          icon={<LogOut size={16} color={Colors.card} />}
          onPress={() => router.replace("/(auth)")}
          size="small"
          />
      </View>
      
      <FlatList
        data={movies}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.moviesList}
        renderItem={({ item }) => (
          <View style={styles.movieItem}>
            <MovieCard movie={item} size="large"  />
            
            <View style={styles.actionsContainer}>
              <TouchableOpacity 
                style={[styles.actionButton, styles.editButton]}
                onPress={() => handleEditMovie(item.id)}
              >
                <Edit size={16} color={Colors.primary} />
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.actionButton, styles.deleteButton]}
                onPress={() => handleDeleteMovie(item.id)}
              >
                <Trash size={16} color={Colors.error} />
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    padding: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: Colors.text,
  },
  moviesList: {
    paddingBottom: 16,
  },
  movieItem: {
    marginBottom: 24,
  },
  actionsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 8,
    gap: 16,
  },
  actionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  editButton: {
    backgroundColor: Colors.primaryLight,
  },
  deleteButton: {
    backgroundColor: Colors.error + "20",
  },
  unauthorizedContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  unauthorizedText: {
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: "center",
  },
});