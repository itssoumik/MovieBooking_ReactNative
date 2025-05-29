import React, { useState, useRef } from "react";
import { 
  StyleSheet, 
  Text, 
  View, 
  Image, 
  TouchableOpacity, 
  Dimensions, 
  FlatList
} from "react-native";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { Movie } from "@/types";
import Colors from "@/constants/colors";

interface FeaturedMovieSliderProps {
  movies: Movie[];
}

const { width } = Dimensions.get("window");

export default function FeaturedMovieSlider({ movies }: FeaturedMovieSliderProps) {
  const router = useRouter();
  const [activeIndex, setActiveIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);
  
  const handleMoviePress = (movieId: string) => {
    router.push('/movie/${movie.id}');
  };
  
  const renderItem = ({ item }: { item: Movie }) => {
    
    return (
      <TouchableOpacity 
        style={styles.slideContainer}
        onPress={() => handleMoviePress(item.id)}
        activeOpacity={0.9}
      >
        <Image 
          source={{ uri: item.backdrop || item.poster }} 
          style={styles.image}
          resizeMode="cover"
        />
        
        <LinearGradient
          colors={["transparent", "rgba(0,0,0,0.8)"]}
          style={styles.gradient}
        >
        </LinearGradient>
      </TouchableOpacity>
    );
  };
  
  const handleScroll = (event: any) => {
    const scrollPosition = event.nativeEvent.contentOffset.x;
    const index = Math.round(scrollPosition / width);
    setActiveIndex(index);
  };
  
  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={movies}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      />
      
      <View style={styles.paginationContainer}>
        {movies.map((_, index) => (
          <View 
            key={index} 
            style={[
              styles.paginationDot,
              index === activeIndex && styles.paginationDotActive
            ]} 
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 280,
    width: "100%",
    marginBottom: 16,
  },
  slideContainer: {
    width,
    height: 280,
    paddingHorizontal: 16,
  },
  image: {
    width: "100%",
    height: "100%",
    borderRadius: 16,
  },
  gradient: {
    position: "absolute",
    bottom: 0,
    left: 16,
    right: 16,
    height: "60%",
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    justifyContent: "flex-end",
  },
  contentContainer: {
    padding: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "white",
    marginBottom: 8,
  },
  releaseDate: {
    fontSize: 14,
    color: "rgba(255,255,255,0.8)",
    fontWeight: "500",
  },
  paginationContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: -20,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "rgba(255,255,255,0.5)",
    marginHorizontal: 4,
  },
  paginationDotActive: {
    backgroundColor: Colors.primary,
    width: 12,
    height: 12,
    borderRadius: 6,
  },
});