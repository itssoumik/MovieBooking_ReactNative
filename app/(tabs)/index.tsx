import React, { useEffect, useState } from "react";
import { 
  StyleSheet, 
  Text, 
  View, 
  ScrollView, 
  FlatList,
  TouchableOpacity,
  RefreshControl,
  Image as RNImage
} from "react-native";
import { useRouter } from "expo-router";
//import { MapPin, ChevronDown } from "lucide-react-native";
import { useMovieStore } from "@/store/movie-store";
import Colors from "@/constants/colors";
import MovieCard from "@/components/MovieCard";
import GenreTag from "@/components/GenreTag";
import FeaturedMovieSlider from "@/components/FearturedMovieSlider";

export default function HomeScreen() {
  const router = useRouter();
  const { movies, fetchMovies, isLoading, filterMovies } = useMovieStore();
  const [refreshing, setRefreshing] = useState(false);
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null);
  
  useEffect(() => {
    fetchMovies();
  }, []);
  
  useEffect(() => {
    // Apply genre filter when selectedGenre changes
    if (selectedGenre) {
      filterMovies("", [selectedGenre]);
    } else {
      filterMovies("");
    }
  }, [selectedGenre]);
  
  const onRefresh = async () => {
    setRefreshing(true);
    await fetchMovies();
    setRefreshing(false);
  };
  
  // Get all unique genres from movies
  const allGenres = Array.from(
    new Set(movies.flatMap(movie => movie.genres))
  ).slice(0, 20);
  
  // Featured movies (first 5 movies)
  const featuredMovies = movies.slice(0, 5);
  
  const handleGenreSelect = (genre: string) => {
    setSelectedGenre(selectedGenre === genre ? null : genre);
  };
  
  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Now Showing..</Text>
          <TouchableOpacity style={styles.locationContainer}>
            <Text style={styles.locationText}>Movies in Kolkata</Text>
          </TouchableOpacity>
        </View>
      </View>
      
      {/* Featured Movie Slider */}
      {featuredMovies.length > 0 && (
        <FeaturedMovieSlider movies={featuredMovies} />
      )}
      
      <View style={styles.genresContainer}>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.genresScrollContent}
        >
          {allGenres.map(genre => (
            <GenreTag 
              key={genre} 
              genre={genre} 
              selected={selectedGenre === genre}
              onPress={() => handleGenreSelect(genre)}
            />
          ))}
        </ScrollView>
      </View>
      
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>
            {selectedGenre ? `${selectedGenre} Movies` : "All Movies"}
          </Text>
          <TouchableOpacity onPress={() => router.push("/(tabs)/search")}>
            <Text style={styles.viewAllText}>View all</Text>
          </TouchableOpacity>
        </View>
        
        <FlatList
          data={selectedGenre ? movies.filter(movie => movie.genres.includes(selectedGenre)) : movies}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.moviesList}
          renderItem={({ item }) => (
            <MovieCard movie={item} />
          )}
        />
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
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: Colors.text,
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  locationText: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginRight: 4,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  avatarPlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    fontSize: 18,
    fontWeight: "bold",
    color: Colors.card,
  },
  genresContainer: {
    marginBottom: 16,
  },
  genresScrollContent: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.text,
  },
  viewAllText: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: "500",
  },
  moviesList: {
    paddingHorizontal: 16,
    gap: 16,
  },
});