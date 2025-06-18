import React from "react";
import { StyleSheet, Text, View, Pressable } from "react-native";
import { Showtime, Theater } from "@/types";
import Colors from "@/constants/colors";

interface ShowtimeCardProps {
  theater: Theater;
  showtimes: Showtime[];
  onSelectShowtime: (showtime: Showtime) => void;
  date: string;
}

export default function ShowtimeCard({ 
  theater, 
  showtimes, 
  onSelectShowtime,
  date
}: ShowtimeCardProps) {
  // Filter showtimes for the selected date
  const filteredShowtimes = showtimes.filter(
    showtime => showtime.theaterId === theater.id && showtime.date === date
  );
  
  if (filteredShowtimes.length === 0) {
    return null;
  }
  
  return (
    <View style={styles.container}>
      <Text style={styles.theaterName}>{theater.name}</Text>
      
      <View style={styles.timesContainer}>
        {filteredShowtimes.map((showtime) => (
          <Pressable
            key={showtime.id}
            style={styles.timeButton}
            onPress={() => onSelectShowtime(showtime)}
          >
            <Text style={styles.timeText}>{showtime.time}</Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  theaterName: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.text,
    marginBottom: 12,
  },
  timesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  timeButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.primaryLight,
  },
  timeText: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: "500",
  },
});