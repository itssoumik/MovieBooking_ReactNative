import React, { useEffect, useState } from "react";
import { 
  StyleSheet, 
  Text, 
  View, 
  ScrollView, 
  Image,
  TouchableOpacity,
  ActivityIndicator
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Star, Clock, Calendar } from "lucide-react-native";
import { useMovieStore } from "@/store/movie-store";
import Colors from "@/constants/colors";
import GenreTag from "@/components/GenreTag";
import DateSelector from "@/components/DateSelector";
import YoutubeIframe from "react-native-youtube-iframe";
import ShowtimeCard from "@/components/ShowtimeCard";
import {theaters} from "@/mocks/theaters";
import { Showtime } from "@/types"
import { showtimes } from "@/mocks/showtimes";
import { useBookingStore } from "@/store/booking-store";

export default function MovieDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { getMovieById, selectedMovie, isLoading } = useMovieStore();
  const [playing, setPlaying] = useState(true);
  const { selectShowtime } = useBookingStore();
  const [selectedDate, setSelectedDate] = useState("");
  
  useEffect(() => {
    if (id) {
      getMovieById(id);
      
      // Set default date to today
      const today = new Date().toISOString().split("T")[0];
      setSelectedDate(today);
    }
  }, [id]);
  
  
  if (isLoading || !selectedMovie) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  const handleSelectShowtime = async (showtime: Showtime) => {
    await selectShowtime(showtime.id);
    router.push(`/theater/${showtime.theaterId}`);
    
  };

  const movieShowtimes = showtimes.filter(
    showtime => showtime.movieId === id
  );
  
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>

        <YoutubeIframe  
          height={200}
          play={playing}
          videoId={selectedMovie.ytCode}
          webViewProps={{
            allowsFullscreenVideo: true,
            style: {backgroundColor: Colors.background},
          }}
        /> 


        {/* <Image 
          source={{ uri: selectedMovie.backdrop || selectedMovie.poster }} 
          style={styles.backdrop}
          resizeMode="cover"
        /> */}
        
        <View style={styles.posterContainer}>
          <Image 
            source={{ uri: selectedMovie.poster }} 
            style={styles.poster}
            resizeMode="cover"
          />
        </View>
      </View>
      
      <View style={styles.content}>
        <Text style={styles.title}>{selectedMovie.title}</Text>
        
        <View style={styles.ratingContainer}>
          <Star size={16} color={Colors.rating} fill={Colors.rating} />
          <Text style={styles.rating}>
            {selectedMovie.rating.toFixed(1)}
          </Text>
          <Text style={styles.votes}>
            ({selectedMovie.votes} votes)
          </Text>
        </View>
        
        <View style={styles.genresContainer}>
          {selectedMovie.genres.map(genre => (
            <GenreTag key={genre} genre={genre} />
          ))}
        </View>
        
        <View style={styles.infoContainer}>
          <View style={styles.infoItem}>
            <Clock size={16} color={Colors.textSecondary} />
            <Text style={styles.infoText}>
              {Math.floor(selectedMovie.duration / 60)}h {selectedMovie.duration % 60}m
            </Text>
          </View>
          
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>
          <Text style={styles.description}>
            {selectedMovie.description}
          </Text>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Languages</Text>
          <View style={styles.languagesContainer}>
            {selectedMovie.languages.map(language => (
              <View key={language} style={styles.languageTag}>
                <Text style={styles.languageText}>{language}</Text>
              </View>
            ))}
          </View>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Select Date</Text>
          <DateSelector 
            selectedDate={selectedDate}
            onSelectDate={setSelectedDate}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Showtimes</Text>
          
          {theaters.map(theater => (
            <ShowtimeCard
              key={theater.id}
              theater={theater}
              showtimes={movieShowtimes}
              date={selectedDate}
              onSelectShowtime={handleSelectShowtime}
            />
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
  height: 200,
  position: "relative", // Helps force re-render
},

  backdrop: {
    width: "100%",
    height: "100%",
  },
  posterContainer: {
    position: "absolute",
    bottom: -60,
    left: 16,
    borderRadius: 12,
    borderWidth: 4,
    borderColor: Colors.background,
    overflow: "hidden",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  poster: {
    width: 100,
    height: 150,
  },
  content: {
    paddingTop: 70,
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: Colors.text,
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  rating: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.text,
    marginLeft: 4,
  },
  votes: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginLeft: 4,
  },
  genresContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 16,
  },
  infoContainer: {
    flexDirection: "row",
    marginBottom: 24,
  },
  infoItem: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 24,
  },
  infoText: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginLeft: 8,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.text,
    marginBottom: 12,
  },
  description: {
    fontSize: 14,
    lineHeight: 22,
    color: Colors.textSecondary,
  },
  languagesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  languageTag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: Colors.card,
    marginRight: 8,
    marginBottom: 8,
  },
  languageText: {
    fontSize: 12,
    fontWeight: "500",
    color: Colors.text,
  },
});