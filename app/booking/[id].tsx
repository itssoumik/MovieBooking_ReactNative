import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  Share,
  Alert,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Calendar, Clock, MapPin, Share2 } from "lucide-react-native";
import { useBookingStore } from "@/store/booking-store";
import Colors from "@/constants/colors";
import Button from "@/components/Button";
import { Booking } from "@/types";

export default function BookingDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { bookings, cancelBooking } = useBookingStore();

  const [booking, setBooking] = useState<Booking | null>(null);

  useEffect(() => {
    if (id) {
      const foundBooking = bookings.find((b) => b.id === id);
      if (foundBooking) setBooking(foundBooking);
    }
  }, [id, bookings]);

  const handleShare = async () => {
    if (!booking) return;

    try {
      await Share.share({
        message: `I'm watching ${booking.movieName} at ${booking.theater}, ${booking.location} on ${booking.day}. Join me!`,
      });
    } catch (error) {
      Alert.alert("Error", "Could not share booking");
    }
  };

  const handleCancel = () => {
    if (!booking) return;

    Alert.alert("Cancel Booking", "Are you sure you want to cancel this booking?", [
      { text: "No", style: "cancel" },
      {
        text: "Yes, Cancel",
        style: "destructive",
        onPress: async () => {
          await cancelBooking(booking.id);
          router.replace("/(tabs)/bookings");
        },
      },
    ]);
  };

  if (!booking) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>Booking not found</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Image
          source={{ uri: booking.backdrop }}
          style={styles.poster}
          resizeMode="cover"
        />

        <View style={styles.ticketContainer}>
          <View style={styles.ticketHeader}>
            <Text style={styles.movieTitle}>{booking.movieName}</Text>

            <View
              style={[
                styles.statusBadge,
                booking.status === "confirmed"
                  ? styles.confirmedBadge
                  : styles.cancelledBadge,
              ]}
            >
              <Text
                style={[
                  styles.statusText,
                  booking.status === "confirmed"
                    ? styles.confirmedText
                    : styles.cancelledText,
                ]}
              >
                {booking.status.toUpperCase()}
              </Text>
            </View>
          </View>

          <View style={styles.ticketBody}>
            <View style={styles.infoRow}>
              <Calendar size={16} color={Colors.textSecondary} />
              <Text style={styles.infoText}>{booking.day}, {booking.date}</Text>
            </View>

            <View style={styles.infoRow}>
              <Clock size={16} color={Colors.textSecondary} />
              <Text style={styles.infoText}>{booking.time}</Text>
            </View>

            <View style={styles.infoRow}>
              <MapPin size={16} color={Colors.textSecondary} />
              <Text style={styles.infoText}>
                {booking.theater}, {booking.location}
              </Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.seatsContainer}>
            <Text style={styles.seatsLabel}>Seats</Text>
            <View style={styles.seatsList}>
              {booking.seats.map((seatId) => {
                const seatCode = seatId.split("-")[1];
                return (
                  <View key={seatId} style={styles.seatBadge}>
                    <Text style={styles.seatText}>{seatId}</Text>
                  </View>
                );
              })}
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.priceContainer}>
            <Text style={styles.priceLabel}>Total Amount</Text>
            <Text style={styles.priceValue}>₹{booking.totalAmount}</Text>
          </View>

          {/* <View style={styles.barcodeContainer}>
            <Text style={styles.barcodeText}>BOOKING ID: {booking.id}</Text>
            <View style={styles.barcode} />
          </View> */}
        </View>
      </View>

      <View style={styles.actionsContainer}>
        {booking.status==="confirmed" &&(
          <Button
          title="Share Ticket"
          variant="outline"
          icon={<Share2 size={16} color={Colors.primary} />}
          onPress={handleShare}
          style={styles.shareButton}
        />)}

        {booking.status === "confirmed" && (
          <Button
            title="Cancel Booking"
            variant="secondary"
            onPress={handleCancel}
            style={styles.cancelButton}
            textStyle={styles.cancelButtonText}
          />
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  emptyText: {
    fontSize: 16,
    color: Colors.textSecondary,
  },
  header: {
    padding: 16,
  },
  poster: {
    width: "100%",
    height: 200,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  ticketContainer: {
    backgroundColor: Colors.card,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    padding: 16,
    elevation: 2,
  },
  ticketHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  movieTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: Colors.text,
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  confirmedBadge: {
    backgroundColor: Colors.success + "20",
  },
  cancelledBadge: {
    backgroundColor: Colors.error + "20",
  },
  statusText: {
    fontSize: 10,
    fontWeight: "600",
  },
  confirmedText: {
    color: Colors.success,
  },
  cancelledText: {
    color: Colors.error,
  },
  ticketBody: {
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  infoText: {
    fontSize: 14,
    color: Colors.text,
    marginLeft: 12,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.border,
    marginVertical: 8,
  },
  seatsContainer: {
    marginBottom: 16,
  },
  seatsLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.text,
    marginBottom: 8,
  },
  seatsList: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  seatBadge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: Colors.primaryLight,
    borderRadius: 4,
  },
  seatText: {
    fontSize: 12,
    fontWeight: "500",
    color: Colors.primary,
  },
  priceContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  priceLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.text,
  },
  priceValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: Colors.primary,
  },
  barcodeContainer: {
    alignItems: "center",
  },
  barcodeText: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginBottom: 8,
  },
  barcode: {
    width: "80%",
    height: 60,
    backgroundColor: "#000",
    borderRadius: 4,
  },
  actionsContainer: {
    padding: 16,
    gap: 16,
  },
  shareButton: {
    width: "100%",
  },
  cancelButton: {
    width: "100%",
    backgroundColor: Colors.error + "20",
  },
  cancelButtonText: {
    color: Colors.error,
  },
});
