import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Alert
} from "react-native";
import { useRouter } from "expo-router";
import { useBookingStore } from "@/store/booking-store";
import { useMovieStore } from "@/store/movie-store";
import { useAuthStore } from "@/store/auth-store";
import Colors from "@/constants/colors";
import Button from "@/components/Button";
import RazorpayCheckout from "react-native-razorpay";
import { or } from "@react-native-firebase/firestore";

export default function CheckoutScreen() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { selectedShowtime, selectedSeats, availableSeats, createBooking, isLoading } = useBookingStore();
  const { movies } = useMovieStore();

  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (selectedSeats.length > 0 && availableSeats.length > 0) {
      const unavailableSelectedSeats = selectedSeats.filter(
        seat => !availableSeats.find(s => s.id === seat.id)?.isAvailable
      );

      if (unavailableSelectedSeats.length > 0) {
        Alert.alert(
          "Seats No Longer Available",
          "Some of the seats you selected are no longer available. Please select different seats.",
          [{ text: "OK", onPress: () => router.back() }]
        );
      }
    }
  }, [selectedSeats, availableSeats]);

  // useEffect(() => {
  //   if (!selectedShowtime || selectedSeats.length === 0 || !user) {
  //     Alert.alert(
  //       "Missing Information",
  //       "Please select a showtime and seats before proceeding to checkout.",
  //       [{ text: "OK", onPress: () => router.replace("/(tabs)") }]
  //     );
  //   }
  // }, [selectedShowtime, selectedSeats, user]);

  if (!selectedShowtime || selectedSeats.length === 0 || !user) {
    return null;
  }

  const movie = movies.find(m => m.id === selectedShowtime.movieId);
  const ticketPrice = movie?.price ?? selectedShowtime.price ?? 0;
  const totalAmount = ticketPrice * selectedSeats.length;
  console.log("Total Amount:", totalAmount);

  const handlePayment = async () => {
  setIsProcessing(true);
  try {
    const options = {
      key: "rzp_test_DdTMMpZv7X2aTQ",
      amount: (totalAmount + 20) * 100,
      currency: "INR",
      name: "Grab Your Show",
      description: "Payment for movie tickets",
      image: 'https://res.cloudinary.com/dim7h6yym/image/upload/v1752056462/FinalIcon_pwmgw5.png',
      prefill: {
        name: user.name,
        email: user.id,
        contact: '8013934567',
      },
      theme: {
        color: Colors.background,
      },
    };

    const data = await RazorpayCheckout.open(options as any);
    console.log("Payment Success:", data);
    await createBooking(user.id);
    router.replace("/(tabs)/bookings");
  } catch (error) {
    console.error("Payment Failed:", error);
    Alert.alert("Payment Failed", "There was an issue processing your payment.");
  } finally {
    setIsProcessing(false);
  }
};



  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Booking Summary</Text>
        <View style={styles.summaryCard}>
          <Text style={styles.movieTitle}>{movie?.title}</Text>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Date & Time:</Text>
            <Text style={styles.summaryValue}>
              {new Date(selectedShowtime.date).toLocaleDateString("en-US", {
                weekday: "short",
                day: "numeric",
                month: "short"
              })} • {selectedShowtime.time}
            </Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Seats:</Text>
            <Text style={styles.summaryValue}>
              {selectedSeats.map(seat => `${seat.row}${seat.number}`).join(", ")}
            </Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>Ticket Price:</Text>
            <Text style={styles.priceValue}>₹{totalAmount}</Text>
          </View>
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>Convenience Fee:</Text>
            <Text style={styles.priceValue}>₹20</Text>
          </View>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total Amount:</Text>
            <Text style={styles.totalValue}>₹{totalAmount + 20}</Text>
          </View>
        </View>
      </View>
      <View style={styles.buttonContainer}>
        <Button
          title={`Pay ₹${totalAmount + 20}`}
          onPress={handlePayment}
          loading={isProcessing || isLoading}
          style={styles.payButton}
        />
      </View>
      <Text style={styles.secureText}>
        Your payment information is secure and encrypted
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    padding: 16,
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
  summaryCard: {
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 16,
  },
  movieTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: Colors.text,
    marginBottom: 16,
  },
  summaryRow: {
    flexDirection: "row",
    marginBottom: 8,
  },
  summaryLabel: {
    width: 100,
    fontSize: 14,
    color: Colors.textSecondary,
  },
  summaryValue: {
    flex: 1,
    fontSize: 14,
    color: Colors.text,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.border,
    marginVertical: 16,
  },
  priceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  priceLabel: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  priceValue: {
    fontSize: 14,
    color: Colors.text,
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.text,
  },
  totalValue: {
    fontSize: 16,
    fontWeight: "bold",
    color: Colors.primary,
  },
  buttonContainer: {
    marginBottom: 24,
  },
  payButton: {
    width: "100%",
  },
  secureText: {
    fontSize: 12,
    color: Colors.textSecondary,
    textAlign: "center",
    marginBottom: 24,
  },
});

