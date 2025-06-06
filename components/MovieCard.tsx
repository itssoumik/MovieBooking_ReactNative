import React from "react";
import { StyleSheet, Text, View, Pressable, Image } from "react-native";
import { useRouter } from "expo-router";
import { Star } from "lucide-react-native";
import { Movie } from "@/types";
import Colors from "@/constants/colors";

interface MovieCardProps {
  movie: Movie;
  size?: "small" | "large";
}

export default function MovieCard({ movie, size = "small" }: MovieCardProps) {
  const router = useRouter();
  
  const handlePress = () => {
    router.push(`/movie/${movie.id}` );
  };
  
  return (
    <Pressable 
      style={[styles.container, size === "large" ? styles.large : styles.small]} 
      onPress={handlePress}
    >
      <Image 
        source={size==="large"?{ uri: movie.backdrop }:{ uri: movie.poster }} 
        style={[styles.poster, size === "large" ? styles.largePoster : styles.smallPoster]} 
        resizeMode="cover"
      />
      
      <View style={styles.infoContainer}>
        <Text 
          style={styles.title} 
          numberOfLines={1}
        >
          {movie.title}
        </Text>
        
        {size === "small" && (
          <View style={styles.ratingContainer}>
            <Star size={12} color={Colors.rating} fill={Colors.rating} />
            <Text style={styles.rating}>{movie.rating.toFixed(1)}</Text>
          </View>
        )}
        
        {size === "large" && (
          <View style={styles.detailsContainer}>
            <View style={styles.ratingContainer}>
              <Star size={14} color={Colors.rating} fill={Colors.rating} />
              <Text style={styles.rating}>{movie.rating.toFixed(1)}</Text>
              <Text style={styles.votes}>({movie.votes})</Text>
            </View>
            
            <Text style={styles.duration}>{Math.floor(movie.duration / 60)}h {movie.duration % 60}min</Text>
          </View>
        )}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.card,
    borderRadius: 12,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  small: {
    width: 120,
    height: 190,
  },
  large: {
    marginVertical: 8,
    width: "100%",
    height: 240,
  },
  poster: {
    width: "100%",
  },
  smallPoster: {
    height: 140,
  },
  largePoster: {
    height: 180,
  },
  infoContainer: {
    padding: 8,
  },
  title: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.text,
    marginBottom: 4,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  rating: {
    fontSize: 12,
    fontWeight: "500",
    color: Colors.textSecondary,
    marginLeft: 4,
  },
  votes: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginLeft: 2,
  },
  detailsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 4,
  },
  duration: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
});