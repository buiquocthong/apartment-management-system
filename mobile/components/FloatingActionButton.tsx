import React from "react";
import { TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import color from "../assets/theme/colors";

interface FloatingActionButtonProps {
  onPress: () => void;
  iconName: keyof typeof Ionicons.glyphMap;
}

const FloatingActionButton: React.FC<FloatingActionButtonProps> = ({
  onPress,
  iconName,
}) => {
  return (
    <TouchableOpacity style={styles.floatingButton} onPress={onPress}>
      <Ionicons name={iconName} size={30} color="#fff" />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  floatingButton: {
    backgroundColor: color.blue,
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    bottom: 20,
    right: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
});

export default FloatingActionButton;
