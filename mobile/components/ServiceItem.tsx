import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { IService } from "../utils/type";
import serviceApi from "../services/serviceApi";
import { useAuth } from "../services/AuthContext";
import color from "../assets/theme/colors";
import theme from "../assets/theme/theme";
import { formatPrice } from "../utils/formatPrice";

const ServiceItem = (service: IService) => {
  const { token } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const onRemove = async () => {
    if (!token) {
      setError("No authentication token found");
      setLoading(false);
      return;
    }
    try {
      const api = serviceApi(token);
      await api.deleteService(service.service_id);
      alert("Delete service successfully");
    } catch (err) {
      console.log(err);
      setError("Error fetching blocks");
    } finally {
      setLoading(false);
    }
  };
  const iconName =
    service.name === "Electricity"
      ? "electric-bolt"
      : service.name === "Water"
      ? "water-drop"
      : "local-offer";

  const iconColor =
    service.name === "Electricity"
      ? color.yellow
      : service.name === "Water"
      ? color.blue
      : color.black;
  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <MaterialIcons name={iconName} size={36} color={iconColor} />
      </View>
      <View style={styles.infoContainer}>
        <Text style={styles.serviceName}>{service.name}</Text>
        <Text style={styles.price}>
          {formatPrice(service.price)} đ / {service.unit}
        </Text>
        {/* <Text style={styles.status}>
          <Text style={styles.statusDot}>●</Text> {service.statusText}
        </Text> */}
      </View>
      <TouchableOpacity style={styles.removeButton} onPress={onRemove}>
        <MaterialIcons
          name="remove-circle-outline"
          size={36}
          color={color.red}
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    padding: 10,
    marginVertical: 8,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
    elevation: 2,
  },
  iconContainer: {
    marginRight: 12,
  },
  infoContainer: {
    flex: 1,
  },
  serviceName: {
    fontSize: 18,
    fontFamily: theme.fonts.semiBold,
    marginBottom: 4,
  },
  price: {
    fontSize: 16,
    color: "#333",
    marginBottom: 4,
    fontFamily: theme.fonts.regular,
  },
  status: {
    fontSize: 14,
    color: "#4CAF50",
  },
  statusDot: {
    fontSize: 16,
    color: "#4CAF50",
  },
  removeButton: {
    paddingLeft: 10,
  },
});

export default ServiceItem;
