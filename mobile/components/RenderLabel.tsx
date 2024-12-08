import React from "react";
import { Text, StyleSheet } from "react-native";
import theme from "../assets/theme/theme";

interface RenderLabelProps {
  label: string;
  required?: boolean;
}

export const renderLabel = ({ label, required }: RenderLabelProps) => (
  <Text style={styles.label}>
    {label}
    {required && <Text style={styles.required}> *</Text>}
  </Text>
);

const styles = StyleSheet.create({
  label: {
    fontSize: 16,
    marginBottom: 5,
    fontFamily: theme.fonts.semiBold,
  },
  required: {
    color: "red",
    fontFamily: theme.fonts.semiBold,
  },
});
