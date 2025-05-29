import React from "react";
import { StyleSheet, Text, View, Pressable } from "react-native";
import Colors from "@/constants/colors";

interface GenreTagProps {
  genre: string;
  selected?: boolean;
  onPress?: () => void;
}

export default function GenreTag({ 
  genre, 
  selected = false,
  onPress
}: GenreTagProps) {
  return (
    <Pressable
      style={[
        styles.container,
        selected && styles.selectedContainer
      ]}
      onPress={onPress}
      disabled={!onPress}
    >
      <Text 
        style={[
          styles.text,
          selected && styles.selectedText
        ]}
      >
        {genre}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: Colors.primaryLight,
    marginRight: 8,
    marginBottom: 8,
  },
  selectedContainer: {
    backgroundColor: Colors.primary,
  },
  text: {
    fontSize: 12,
    fontWeight: "500",
    color: Colors.primary,
  },
  selectedText: {
    color: Colors.card,
  },
});