import React, { useEffect, useState } from "react";
import { 
  StyleSheet, 
  Text, 
  View, 
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Film, Clock, Calendar, Link, Plus, X, DollarSign } from "lucide-react-native";
import { useMovieStore } from "@/store/movie-store";
import Colors from "@/constants/colors";
import Input from "@/components/Input";
import Button from "@/components/Button";
import GenreTag from "@/components/GenreTag";

export default function EditMovieScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { getMovieById, updateMovie, isLoading, selectedMovie } = useMovieStore();
  
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [poster, setPoster] = useState("");
  const [backdrop, setBackdrop] = useState("");
  const [duration, setDuration] = useState("");
  const [releaseDate, setReleaseDate] = useState("");
  const [price, setPrice] = useState("");
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);
  const [newGenre, setNewGenre] = useState("");
  const [newLanguage, setNewLanguage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  useEffect(() => {
    if (id) {
      getMovieById(id);
    }
  }, [id]);
  
  useEffect(() => {
    if (selectedMovie) {
      setTitle(selectedMovie.title);
      setDescription(selectedMovie.description);
      setPoster(selectedMovie.poster);
      setBackdrop(selectedMovie.backdrop || "");
      setDuration(selectedMovie.duration.toString());
      //setReleaseDate(selectedMovie.releaseDate);
      setPrice(selectedMovie.price.toString());
      setSelectedGenres(selectedMovie.genres);
      setSelectedLanguages(selectedMovie.languages);
    }
  }, [selectedMovie]);
  
  const allGenres = [
    "Action", "Adventure", "Animation", "Comedy", "Crime", "Documentary", 
    "Drama", "Family", "Fantasy", "Horror", "Musical", "Mystery", 
    "Romance", "Sci-Fi", "Thriller", "War", "Western"
  ];
  
  const allLanguages = [
    "English", "Hindi", "Tamil", "Telugu", "Kannada", "Malayalam", 
    "Punjabi", "Bengali", "Marathi", "Gujarati"
  ];
  
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
  
  const addCustomGenre = () => {
    if (!newGenre.trim()) return;
    
    if (!selectedGenres.includes(newGenre)) {
      setSelectedGenres(prev => [...prev, newGenre]);
    }
    
    setNewGenre("");
  };
  
  const addCustomLanguage = () => {
    if (!newLanguage.trim()) return;
    
    if (!selectedLanguages.includes(newLanguage)) {
      setSelectedLanguages(prev => [...prev, newLanguage]);
    }
    
    setNewLanguage("");
  };
  
  const handleSubmit = async () => {
    if (!title || !description || !poster || !duration  || !price) {
      Alert.alert("Error", "Please fill in all required fields");
      return;
    }
    
    if (selectedGenres.length === 0) {
      Alert.alert("Error", "Please select at least one genre");
      return;
    }
    
    if (selectedLanguages.length === 0) {
      Alert.alert("Error", "Please select at least one language");
      return;
    }
    
    const durationInMinutes = parseInt(duration);
    const priceValue = parseInt(price);
    
    if (isNaN(durationInMinutes) || durationInMinutes <= 0) {
      Alert.alert("Error", "Please enter a valid duration");
      return;
    }
    
    if (isNaN(priceValue) || priceValue <= 0) {
      Alert.alert("Error", "Please enter a valid price");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await updateMovie(id as string, {
        title,
        description,
        poster,
        backdrop: backdrop || poster,
        duration: durationInMinutes,
        //releaseDate,
        genres: selectedGenres,
        languages: selectedLanguages,
        price: priceValue
      });
      
      Alert.alert(
        "Success",
        "Movie updated successfully",
        [
          {
            text: "OK",
            onPress: () => router.back()
          }
        ]
      );
    } catch (error) {
      Alert.alert("Error", "Failed to update movie");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (isLoading && !selectedMovie) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }
  
  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Movie Information</Text>
        
        <Input
          label="Title *"
          placeholder="Enter movie title"
          value={title}
          onChangeText={setTitle}
          leftIcon={<Film size={20} color={Colors.textSecondary} />}
        />
        
        <Input
          label="Description *"
          placeholder="Enter movie description"
          value={description}
          onChangeText={setDescription}
          multiline
          numberOfLines={4}
          style={styles.textArea}
        />
        
        <Input
          label="Poster URL *"
          placeholder="Enter poster image URL"
          value={poster}
          onChangeText={setPoster}
          leftIcon={<Link size={20} color={Colors.textSecondary} />}
        />
        
        <Input
          label="Backdrop URL (optional)"
          placeholder="Enter backdrop image URL"
          value={backdrop}
          onChangeText={setBackdrop}
          leftIcon={<Link size={20} color={Colors.textSecondary} />}
        />
        
        <Input
          label="Duration (minutes) *"
          placeholder="Enter duration in minutes"
          value={duration}
          onChangeText={setDuration}
          keyboardType="number-pad"
          leftIcon={<Clock size={20} color={Colors.textSecondary} />}
        />
        
        
        
        <Input
          label="Price (₹) *"
          placeholder="Enter ticket price"
          value={price}
          onChangeText={setPrice}
          keyboardType="number-pad"
          leftIcon={<DollarSign size={20} color={Colors.textSecondary} />}
        />
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Genres</Text>
        
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
        
        <View style={styles.customInputContainer}>
          <Input
            placeholder="Add custom genre"
            value={newGenre}
            onChangeText={setNewGenre}
            containerStyle={styles.customInput}
          />
          
          <TouchableOpacity 
            style={styles.addButton}
            onPress={addCustomGenre}
          >
            <Plus size={20} color={Colors.card} />
          </TouchableOpacity>
        </View>
        
        {selectedGenres.length > 0 && (
          <View style={styles.selectedContainer}>
            <Text style={styles.selectedTitle}>Selected Genres:</Text>
            <View style={styles.selectedTags}>
              {selectedGenres.map(genre => (
                <View key={genre} style={styles.selectedTag}>
                  <Text style={styles.selectedTagText}>{genre}</Text>
                  <TouchableOpacity onPress={() => toggleGenre(genre)}>
                    <X size={16} color={Colors.text} />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          </View>
        )}
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Languages</Text>
        
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
        
        <View style={styles.customInputContainer}>
          <Input
            placeholder="Add custom language"
            value={newLanguage}
            onChangeText={setNewLanguage}
            containerStyle={styles.customInput}
          />
          
          <TouchableOpacity 
            style={styles.addButton}
            onPress={addCustomLanguage}
          >
            <Plus size={20} color={Colors.card} />
          </TouchableOpacity>
        </View>
        
        {selectedLanguages.length > 0 && (
          <View style={styles.selectedContainer}>
            <Text style={styles.selectedTitle}>Selected Languages:</Text>
            <View style={styles.selectedTags}>
              {selectedLanguages.map(language => (
                <View key={language} style={styles.selectedTag}>
                  <Text style={styles.selectedTagText}>{language}</Text>
                  <TouchableOpacity onPress={() => toggleLanguage(language)}>
                    <X size={16} color={Colors.text} />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          </View>
        )}
      </View>
      
      <View style={styles.buttonContainer}>
        <Button
          title="Update Movie"
          onPress={handleSubmit}
          loading={isSubmitting}
          style={styles.submitButton}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.text,
    marginBottom: 16,
  },
  textArea: {
    height: 100,
    textAlignVertical: "top",
  },
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 16,
  },
  customInputContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  customInput: {
    flex: 1,
    marginBottom: 0,
  },
  addButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.primary,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 12,
  },
  selectedContainer: {
    marginTop: 16,
  },
  selectedTitle: {
    fontSize: 14,
    fontWeight: "500",
    color: Colors.text,
    marginBottom: 8,
  },
  selectedTags: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  selectedTag: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.card,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 8,
  },
  selectedTagText: {
    fontSize: 12,
    color: Colors.text,
  },
  buttonContainer: {
    marginBottom: 32,
  },
  submitButton: {
    width: "100%",
  },
});