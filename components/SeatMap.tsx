import React from "react";
import { StyleSheet, Text, View, Pressable, ScrollView } from "react-native";
import { Seat } from "@/types";
import Colors from "@/constants/colors";

interface SeatMapProps {
  seats: Seat[];
  selectedSeats: Seat[];
  onToggleSeat: (seat: Seat) => void;
}

export default function SeatMap({ 
  seats, 
  selectedSeats, 
  onToggleSeat 
}: SeatMapProps) {
  // Group seats by row
  const seatsByRow = seats.reduce((acc, seat) => {
    if (!acc[seat.row]) {
      acc[seat.row] = [];
    }
    acc[seat.row].push(seat);
    return acc;
  }, {} as Record<string, Seat[]>);
  
  // Sort rows
  const rows = Object.keys(seatsByRow).sort();
  
  return (
    <View style={styles.container}>
      <View style={styles.screen}>
        <Text style={styles.screenText}>SCREEN</Text>
      </View>
      
      <ScrollView horizontal>
  <ScrollView contentContainerStyle={styles.seatsContainer}>
    {rows.map((row) => (
      <View key={row} style={styles.row}>
        <Text style={styles.rowLabel}>{row}</Text>

        <View style={styles.seats}>
          {seatsByRow[row].map((seat) => {
            const isSelected = selectedSeats.some(s => s.id === seat.id);

            return (
              <Pressable
                key={seat.id}
                style={[
                  styles.seat,
                  styles[`${seat.type}Seat`],
                  !seat.isAvailable && styles.unavailableSeat,
                  isSelected && styles.selectedSeat
                ]}
                onPress={() => onToggleSeat(seat)}
                disabled={!seat.isAvailable}
              >
                <Text 
                  style={[
                    styles.seatNumber,
                    !seat.isAvailable && styles.unavailableSeatText,
                    isSelected && styles.selectedSeatText
                  ]}
                >
                  {seat.number}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>
    ))}
  </ScrollView>
</ScrollView>

      
      <View style={styles.legend}>
        <View style={styles.legendItem}>
          <View style={[styles.legendSeat, styles.availableLegendSeat]} />
          <Text style={styles.legendText}>Available</Text>
        </View>
        
        <View style={styles.legendItem}>
          <View style={[styles.legendSeat, styles.selectedLegendSeat]} />
          <Text style={styles.legendText}>Selected</Text>
        </View>
        
        <View style={styles.legendItem}>
          <View style={[styles.legendSeat, styles.unavailableLegendSeat]} />
          <Text style={styles.legendText}>Unavailable</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  screen: {
    height: 24,
    backgroundColor: Colors.border,
    borderRadius: 4,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 32,
  },
  screenText: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
    seatsContainer: {
    paddingBottom: 16,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  seats: {
    flexDirection: "row",
    gap: 8,
    // REMOVE: flexWrap, justifyContent to keep seats in one row
  },

  rowLabel: {
    width: 20,
    fontSize: 14,
    fontWeight: "600",
    color: Colors.text,
  },
  // seats: {
  //   flex: 1,
  //   flexDirection: "row",
  //   flexWrap: "wrap",
  //   gap: 8,
  //   justifyContent: "center",
  // },
  seat: {
    width: 24,
    height: 24,
    borderRadius: 4,
    alignItems: "center",
    justifyContent: "center",
    margin: 2,
  },
  standardSeat: {
    backgroundColor: Colors.primaryLight,
  },
  premiumSeat: {
    backgroundColor: "#E6F7FF",
  },
  // -
  unavailableSeat: {
    backgroundColor: Colors.inactive,
  },
  selectedSeat: {
    backgroundColor: Colors.primary,
  },
  seatNumber: {
    fontSize: 10,
    fontWeight: "500",
    color: Colors.text,
  },
  unavailableSeatText: {
    color: Colors.card,
  },
  selectedSeatText: {
    color: Colors.card,
  },
  legend: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 24,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  legendSeat: {
    width: 16,
    height: 16,
    borderRadius: 4,
  },
  availableLegendSeat: {
    backgroundColor: Colors.primaryLight,
  },
  selectedLegendSeat: {
    backgroundColor: Colors.primary,
  },
  unavailableLegendSeat: {
    backgroundColor: Colors.inactive,
  },
  legendText: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
});