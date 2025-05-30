import React, { useState, useRef, useEffect } from "react";
import { 
  StyleSheet, 
  Text, 
  View, 
  Image, 
  TouchableOpacity, 
  Dimensions, 
  FlatList,
  Animated
} from "react-native";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { Movie } from "@/types";
import Colors from "@/constants/colors";

interface FeaturedMovieSliderProps {
  movies: Movie[];
}

const { width } = Dimensions.get("window");
const ITEM_WIDTH = width - 32; // Account for padding
const ITEM_HEIGHT = 280;

export default function FeaturedMovieSlider({ movies }: FeaturedMovieSliderProps) {
  const router = useRouter();
  const [activeIndex, setActiveIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);
  const scrollX = useRef(new Animated.Value(0)).current;
  
  // Auto-scroll functionality
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    
    if (movies.length > 1) {
      interval = setInterval(() => {
        if (flatListRef.current) {
          const nextIndex = (activeIndex + 1) % movies.length;
          flatListRef.current.scrollToIndex({
            index: nextIndex,
            animated: true
          });
          setActiveIndex(nextIndex);
        }
      }, 5000); // Change slide every 5 seconds
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [activeIndex, movies.length]);
  
  const handleMoviePress = (movieId: string) => {
    router.push(`/movie/${movieId}`);
  };
  
  const renderItem = ({ item, index }: { item: Movie, index: number }) => {
    
    
    // Calculate opacity and scale based on scroll position
    const inputRange = [
      (index - 1) * ITEM_WIDTH,
      index * ITEM_WIDTH,
      (index + 1) * ITEM_WIDTH
    ];
    
    const opacity = scrollX.interpolate({
      inputRange,
      outputRange: [0.7, 1, 0.7],
      extrapolate: "clamp"
    });
    
    const scale = scrollX.interpolate({
      inputRange,
      outputRange: [0.9, 1, 0.9],
      extrapolate: "clamp"
    });
    
    return (
      <Animated.View 
        style={[
          styles.slideContainer,
          { opacity, transform: [{ scale }] }
        ]}
      >
        <TouchableOpacity 
          activeOpacity={0.9}
          onPress={() => handleMoviePress(item.id)}
          style={styles.touchableSlide}
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
            <View style={styles.contentContainer}>
              {/* <Text style={styles.title}>{item.title}</Text> */}
            </View>
          </LinearGradient>
        </TouchableOpacity>
      </Animated.View>
    );
  };
  
  const handleScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { x: scrollX } } }],
    { 
      useNativeDriver: true,
      listener: (event: any) => {
        const scrollPosition = event.nativeEvent.contentOffset.x;
        const index = Math.round(scrollPosition / ITEM_WIDTH);
        setActiveIndex(index);
      }
    }
  );
  
  const handleDotPress = (index: number) => {
    if (flatListRef.current) {
      flatListRef.current.scrollToIndex({
        index,
        animated: true
      });
    }
  };
  
  return (
    <View style={styles.container}>
      <Animated.FlatList
        ref={flatListRef}
        data={movies}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        snapToInterval={ITEM_WIDTH}
        decelerationRate="fast"
        contentContainerStyle={styles.flatListContent}
        initialNumToRender={movies.length}
        getItemLayout={(_, index) => ({
          length: ITEM_WIDTH,
          offset: ITEM_WIDTH * index,
          index,
        })}
      />
      
      <View style={styles.paginationContainer}>
        {movies.map((_, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.paginationDot,
              index === activeIndex && styles.paginationDotActive
            ]}
            onPress={() => handleDotPress(index)}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: ITEM_HEIGHT,
    width: "100%",
    marginBottom: 16,
  },
  flatListContent: {
    paddingHorizontal: 16,
  },
  slideContainer: {
    width: ITEM_WIDTH,
    height: ITEM_HEIGHT,
    paddingHorizontal: 8,
  },
  touchableSlide: {
    flex: 1,
    borderRadius: 16,
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: "100%",
    borderRadius: 16,
  },
  gradient: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
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
    marginBottom: 4,
  },
  price: {
    fontSize: 16,
    fontWeight: "bold",
    color: Colors.primary,
  },
  paginationContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: -24,
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