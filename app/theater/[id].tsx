import React, { useEffect, useState } from "react";
import { 
  StyleSheet, 
  Text, 
  View, 
  ScrollView,
  ActivityIndicator
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useBookingStore } from "@/store/booking-store";
import { useMovieStore } from "@/store/movie-store";
import { theaters } from "@/mocks/theaters";
import Colors from "@/constants/colors";
import SeatMap from "@/components/SeatMap";
import Button from "@/components/Button";

export default function TheaterScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  const { 
    selectedShowtime, 
    selectedSeats, 
    availableSeats,
    toggleSeatSelection,
    isLoading 
  } = useBookingStore();

  const { movies } = useMovieStore();

  const [theater, setTheater] = useState(theaters[0]);
  const [movie, setMovie] = useState(movies[0]);

  useEffect(() => {
    const foundTheater = theaters.find(t => t.id === id);
    if (foundTheater) setTheater(foundTheater);

    if (selectedShowtime) {
      const foundMovie = movies.find(m => m.id === selectedShowtime.movieId);
      if (foundMovie) setMovie(foundMovie);
    }
  }, [id, selectedShowtime, movies]);

  // Move redirect logic into effect
  useEffect(() => {
    if (!selectedShowtime && movie?.id) {
      router.replace(`/movie/${movie.id}`);
    }
  }, [selectedShowtime, movie?.id]);

  const handleProceedToCheckout = () => {
    router.push("/checkout");
  };

  // Prevent render crash if no showtime and redirection is pending
  if (!selectedShowtime) return null;

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollContainer}>
        <View style={styles.header}>
          <Text style={styles.theaterName}>{theater.name}</Text>
          <Text style={styles.movieTitle}>{movie.title}</Text>
          <Text style={styles.showInfo}>
            {new Date(selectedShowtime.date).toLocaleDateString("en-US", {
              weekday: "short",
              day: "numeric",
              month: "short"
            })} • {selectedShowtime.time}
          </Text>
        </View>

        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={Colors.primary} />
          </View>
        ) : (
          <SeatMap
            seats={availableSeats}
            selectedSeats={selectedSeats}
            onToggleSeat={toggleSeatSelection}
          />
        )}
      </ScrollView>

      <View style={styles.footer}>
        <View style={styles.summaryContainer}>
          <View>
            <Text style={styles.seatsLabel}>
              {selectedSeats.length} Seats
            </Text>
            <Text style={styles.seatsList}>
              {selectedSeats.map(seat => `${seat.row}${seat.number}`).join(", ")}
            </Text>
          </View>

          <View>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalAmount}>
              ₹{movie.price * selectedSeats.length}
            </Text>
          </View>
        </View>

        <Button
          title="Proceed to Checkout"
          onPress={handleProceedToCheckout}
          disabled={selectedSeats.length === 0}
          style={styles.checkoutButton}
        />
      </View>
    </View>
  );
}

// styles remain unchanged...


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContainer: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 40,
  },
  header: {
    padding: 16,
    backgroundColor: Colors.card,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
  },
  theaterName: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.text,
    marginBottom: 4,
  },
  movieTitle: {
    fontSize: 16,
    color: Colors.text,
    marginBottom: 4,
  },
  showInfo: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  footer: {
    padding: 16,
    backgroundColor: Colors.card,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  summaryContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  seatsLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.text,
    marginBottom: 4,
  },
  seatsList: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  totalLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.text,
    marginBottom: 4,
    textAlign: "right",
  },
  totalAmount: {
    fontSize: 18,
    fontWeight: "bold",
    color: Colors.primary,
    textAlign: "right",
  },
  checkoutButton: {
    width: "100%",
  },
});