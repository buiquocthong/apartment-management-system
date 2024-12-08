import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import color from "../assets/theme/colors";
import theme from "../assets/theme/theme";

interface CustomHeaderProps {
  title: string;
  onBackPress: () => void;
}

const CustomHeader: React.FC<CustomHeaderProps> = ({ title, onBackPress }) => {
  return (
    <View style={styles.header}>
      <TouchableOpacity onPress={onBackPress} style={styles.backButton}>
        <MaterialIcons name="arrow-back" size={40} color={color.white} />
      </TouchableOpacity>
      <Text style={styles.title}>{title}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    backgroundColor: color.blue,
    elevation: 3,
  },
  backButton: {
    backgroundColor: color.blue,
    borderRadius: 25,
    height: 50,
    width: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 20,
    fontFamily: theme.fonts.bold,
    marginLeft: 16,
    color: color.white,
  },
});

export default CustomHeader;
