import React from "react";
import { StyleSheet, Text, View, Pressable, Image } from "react-native";
import { useRouter } from "expo-router";
import { Calendar, Clock, MapPin } from "lucide-react-native";
import { Booking } from "@/types";
import Colors from "@/constants/colors";
import Button from "./Button";

interface BookingCardProps {
  booking: Booking;
  onCancel?: () => void;
}

export default function BookingCard({ booking, onCancel }: BookingCardProps) {
  const router = useRouter();

  const handleViewDetails = () => {
    router.push(`/booking/${booking.id}`);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <Pressable style={styles.container} onPress={handleViewDetails}>
      <View style={styles.header}>
        <Image
          source={{ uri: booking.poster }}
          style={styles.poster}
          resizeMode="cover"
        />

        <View style={styles.infoContainer}>
          <Text style={styles.title}>{booking.movieName}</Text>

          <View style={styles.detailRow}>
            <Calendar size={14} color={Colors.textSecondary} />
            <Text style={styles.detailText}>{booking.date}</Text>
          </View>

          <View style={styles.detailRow}>
            <MapPin size={14} color={Colors.textSecondary} />
            <Text style={styles.detailText}>
              {booking.theater}, {booking.location}
            </Text>
          </View>

          <View style={styles.detailRow}>
            <Clock size={14} color={Colors.textSecondary} />
            <Text style={styles.detailText}>
              {booking.seats.length} seats • ₹{booking.totalAmount}
            </Text>
          </View>

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
              {booking.status}
            </Text>
          </View>
        </View>
      </View>

      {booking.status === "confirmed" && onCancel && (
        <View style={styles.footer}>
          <Button
            title="Cancel Booking"
            variant="outline"
            size="small"
            onPress={onCancel}
            style={styles.cancelButton}
          />
          <Button title="View Details" size="small" onPress={handleViewDetails} />
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  header: {
    flexDirection: "row",
  },
  poster: {
    width: 80,
    height: 120,
    borderRadius: 8,
  },
  infoContainer: {
    flex: 1,
    marginLeft: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.text,
    marginBottom: 8,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  detailText: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginLeft: 8,
  },
  statusBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginTop: 4,
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
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  cancelButton: {
    flex: 1,
    marginRight: 12,
  },
});
