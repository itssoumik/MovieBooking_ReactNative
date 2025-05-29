import React from "react";
import { StyleSheet, Text, View, ScrollView, Pressable } from "react-native";
import Colors from "@/constants/colors";

interface DateSelectorProps {
  selectedDate: string;
  onSelectDate: (date: string) => void;
}

export default function DateSelector({ 
  selectedDate, 
  onSelectDate 
}: DateSelectorProps) {
  // Generate dates for the next 7 days
  const dates = React.useMemo(() => {
    const result = [];
    const today = new Date();
    
    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      
      const formattedDate = date.toISOString().split("T")[0];
      const day = date.getDate();
      const dayName = new Intl.DateTimeFormat("en-US", { weekday: "short" }).format(date);
      const monthName = new Intl.DateTimeFormat("en-US", { month: "short" }).format(date);
      
      result.push({
        date: formattedDate,
        day,
        dayName,
        monthName,
        isToday: i === 0
      });
    }
    
    return result;
  }, []);
  
  return (
    <ScrollView 
      horizontal 
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {dates.map((date) => (
        <Pressable
          key={date.date}
          style={[
            styles.dateItem,
            selectedDate === date.date && styles.selectedDateItem
          ]}
          onPress={() => onSelectDate(date.date)}
        >
          <Text style={[
            styles.dayName,
            selectedDate === date.date && styles.selectedText
          ]}>
            {date.dayName}
          </Text>
          
          <Text style={[
            styles.day,
            selectedDate === date.date && styles.selectedText
          ]}>
            {date.day}
          </Text>
          
          <Text style={[
            styles.month,
            selectedDate === date.date && styles.selectedText
          ]}>
            {date.monthName}
          </Text>
          
          {date.isToday && (
            <View style={styles.todayIndicator}>
              <Text style={styles.todayText}>Today</Text>
            </View>
          )}
        </Pressable>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 12,
  },
  dateItem: {
    width: 60,
    height: 80,
    borderRadius: 12,
    backgroundColor: Colors.card,
    alignItems: "center",
    justifyContent: "center",
    padding: 8,
  },
  selectedDateItem: {
    backgroundColor: Colors.primary,
  },
  dayName: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  day: {
    fontSize: 18,
    fontWeight: "700",
    color: Colors.text,
  },
  month: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  selectedText: {
    color: Colors.card,
  },
  todayIndicator: {
    position: "absolute",
    bottom: -6,
    backgroundColor: Colors.primaryLight,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
  },
  todayText: {
    fontSize: 10,
    color: Colors.primary,
    fontWeight: "500",
  },
});