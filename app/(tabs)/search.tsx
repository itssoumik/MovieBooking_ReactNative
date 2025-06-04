import React, { useState, useEffect } from "react";
import { 
  StyleSheet, 
  Text, 
  View, 
  FlatList,
  ActivityIndicator,
  TouchableOpacity
} from "react-native";
import { Search, X, Filter } from "lucide-react-native";
import { useMovieStore } from "@/store/movie-store";
import Colors from "@/constants/colors";
import Input from "@/components/Input";
import MovieCard from "@/components/MovieCard";
import GenreTag from "@/components/GenreTag";

export default function SearchScreen() {
  const { movies, filteredMovies, filterMovies, isLoading } = useMovieStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  
  // Get all unique genres and languages from movies
  const allGenres = Array.from(
    new Set(movies.flatMap(movie => movie.genres))
  ).sort();
  
  const allLanguages = Array.from(
    new Set(movies.flatMap(movie => movie.languages))
  ).sort();
  
  useEffect(() => {
    // Apply filters whenever search query or selected filters change
    filterMovies(searchQuery, selectedGenres, selectedLanguages);
  }, [searchQuery, selectedGenres, selectedLanguages]);
  
  const clearSearch = () => {
    setSearchQuery("");
  };
  
  const toggleGenre = (genre: string) => {
    setSelectedGenres(prev => 
      prev.includes(genre)
        ? prev.filter(g => g !== genre)
        : [...prev, genre]
    );
  };
  
  const toggleLanguage = (language: string) => {
    setSelectedLanguages(prev => 
      prev.includes(language)
        ? prev.filter(l => l !== language)
        : [...prev, language]
    );
  };
  
  const clearFilters = () => {
    setSelectedGenres([]);
    setSelectedLanguages([]);
  };
  
  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };
  
  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <Input
          placeholder="Search for movies..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          leftIcon={<Search size={20} color={Colors.textSecondary} />}
          rightIcon={
            searchQuery ? (
              <TouchableOpacity onPress={clearSearch}>
                <X size={20} color={Colors.textSecondary} />
              </TouchableOpacity>
            ) : null
          }
          containerStyle={styles.searchInputContainer}
        />
        
        <TouchableOpacity 
          style={styles.filterButton}
          onPress={toggleFilters}
        >
          <Filter size={20} color={Colors.text} />
        </TouchableOpacity>
      </View>
      
      {showFilters && (
        <View style={styles.filtersContainer}>
          <View style={styles.filterSection}>
            <View style={styles.filterHeader}>
              <Text style={styles.filterTitle}>Genres</Text>
              {selectedGenres.length > 0 && (
                <TouchableOpacity onPress={() => setSelectedGenres([])}>
                  <Text style={styles.clearText}>Clear</Text>
                </TouchableOpacity>
              )}
            </View>
            
            <View style={styles.tagsContainer}>
              {allGenres.map(genre => (
                <GenreTag
                  key={genre}
                  genre={genre}
                  selected={selectedGenres.includes(genre)}
                  onPress={() => toggleGenre(genre)}
                />
              ))}
            </View>
          </View>
          
          <View style={styles.filterSection}>
            <View style={styles.filterHeader}>
              <Text style={styles.filterTitle}>Languages</Text>
              {selectedLanguages.length > 0 && (
                <TouchableOpacity onPress={() => setSelectedLanguages([])}>
                  <Text style={styles.clearText}>Clear</Text>
                </TouchableOpacity>
              )}
            </View>
            
            <View style={styles.tagsContainer}>
              {allLanguages.map(language => (
                <GenreTag
                  key={language}
                  genre={language}
                  selected={selectedLanguages.includes(language)}
                  onPress={() => toggleLanguage(language)}
                />
              ))}
            </View>
          </View>
          
          {(selectedGenres.length > 0 || selectedLanguages.length > 0) && (
            <TouchableOpacity 
              style={styles.clearAllButton}
              onPress={clearFilters}
            >
              <Text style={styles.clearAllText}>Clear All Filters</Text>
            </TouchableOpacity>
          )}
        </View>
      )}
      
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      ) : filteredMovies.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No movies found</Text>
          <Text style={styles.emptySubtext}>
            Try adjusting your search or filters
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredMovies}
          keyExtractor={(item) => item.id}
          numColumns={1}
          contentContainerStyle={styles.moviesGrid}
          renderItem={({ item }) => (
            <MovieCard movie={item} size="large" />
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    padding: 16,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  searchInputContainer: {
    flex: 1,
    marginBottom: 0,
  },
  filterButton: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: Colors.card,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 12,
  },
  filtersContainer: {
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  filterSection: {
    marginBottom: 16,
  },
  filterHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  filterTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.text,
  },
  clearText: {
    fontSize: 14,
    color: Colors.primary,
  },
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  clearAllButton: {
    alignItems: "center",
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    marginTop: 8,
  },
  clearAllText: {
    fontSize: 14,
    fontWeight: "500",
    color: Colors.primary,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.text,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: "center",
  },
  moviesGrid: {
    paddingBottom: 16,
  },
  row: {
    justifyContent: "space-between",
    marginBottom: 16,
  },
});