import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Switch,
  StyleSheet,
  Alert,
  ActivityIndicator,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import serviceApi from "../../services/serviceApi";
import { useAuth } from "../../services/AuthContext";
import { RootStackParamList } from "../../navigation/RootStackParamList";
import CustomHeader from "../../components/CustomHeader";
import theme from "../../assets/theme/theme";
import color from "../../assets/theme/colors";
import { SafeAreaView } from "react-native-safe-area-context";
import { InputField } from "../../components/InputField";
import { formatNumber } from "../../utils/formatNumber";
import { formatPrice } from "../../utils/formatPrice";

interface ServiceFormData {
  name: string;
  price: number;
  unit: string;
  metered_service: boolean;
  service_id?: string;
}

const ServiceForm = () => {
  const route = useRoute<RouteProp<RootStackParamList, "ServiceForm">>();
  const navigation = useNavigation();
  const { token, handleLogout } = useAuth();
  const { service } = route.params || {};

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<ServiceFormData>({
    name: service?.name || "",
    price: service?.price || 0,
    unit: service?.unit || "Month",
    metered_service: service?.metered_service || false,
    service_id: service?.service_id,
  });

  const isFormValid = () => {
    return (
      formData.name.trim() !== "" &&
      formData.price > 0 &&
      formData.unit.trim() !== ""
    );
  };

  const updateFormField = <K extends keyof ServiceFormData>(
    field: K,
    value: ServiceFormData[K]
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async () => {
    if (!isFormValid()) {
      Alert.alert("Validation Error", "Please fill in all required fields");
      return;
    }

    setLoading(true);
    try {
      if (!token) {
        throw new Error("No authentication token found");
      }

      const api = serviceApi(token, handleLogout);
      const isUpdate = !!service;

      if (isUpdate) {
        await api.updateService(service.service_id, formData);
      } else {
        await api.createService(formData);
      }

      Alert.alert(
        "Success",
        `Service ${isUpdate ? "updated" : "added"} successfully`,
        [{ text: "OK", onPress: () => navigation.goBack() }]
      );
    } catch (err) {
      Alert.alert(
        "Error",
        err instanceof Error ? err.message : "Error while saving the service"
      );
    } finally {
      setLoading(false);
    }
  };

  const renderMeterSwitch = () => (
    <View style={styles.switchContainer}>
      <View style={styles.switchIconWrapper}>
        <Ionicons name="speedometer" size={24} color={color.blue} />
      </View>
      <View style={styles.switchInfo}>
        <Text style={styles.switchLabel}>Meter-based Calculation</Text>
        <Text style={styles.switchDescription}>
          Calculate according to electricity and water meter readings
        </Text>
      </View>
      <Switch
        value={formData.metered_service}
        onValueChange={(value) => updateFormField("metered_service", value)}
        trackColor={{ false: "#D1D5DB", true: `${color.blue}80` }}
        thumbColor={formData.metered_service ? color.blue : "#9CA3AF"}
      />
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <CustomHeader
        title={service ? "Update Service" : "Add New Service"}
        onBackPress={() => navigation.goBack()}
      />

      <View style={styles.content}>
        <View style={styles.card}>
          <InputField
            label="Service Name"
            value={formData.name}
            onChange={(text) => updateFormField("name", text)}
            placeholder="Enter service name"
            required
          />

          {renderMeterSwitch()}

          <InputField
            label="Service Price"
            placeholder="Enter price"
            value={formatPrice(formData.price)}
            onChange={(text) => updateFormField("price", formatNumber(text))}
            keyboardType="numeric"
            required
          />

          <InputField
            label="Unit"
            placeholder="e.g., Month, kWh, m³"
            value={formData.unit}
            onChange={(text) => updateFormField("unit", text)}
            required
          />
        </View>

        <TouchableOpacity
          style={[
            styles.submitButton,
            !isFormValid() && styles.disabledButton,
            loading && styles.loadingButton,
          ]}
          onPress={handleSubmit}
          disabled={!isFormValid() || loading}
        >
          {loading ? (
            <ActivityIndicator color={color.white} />
          ) : (
            <Text style={styles.submitButtonText}>
              {service ? "Update Service" : "Add Service"}
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  content: {
    padding: 16,
    flex: 1,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  switchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: `${color.blue}08`,
    padding: 12,
    borderRadius: 8,
    marginVertical: 16,
  },
  switchIconWrapper: {
    backgroundColor: `${color.blue}15`,
    padding: 8,
    borderRadius: 8,
  },
  switchInfo: {
    flex: 1,
    marginLeft: 12,
    marginRight: 8,
  },
  switchLabel: {
    fontSize: 16,
    fontFamily: theme.fonts.semiBold,
    color: color.black,
    marginBottom: 4,
  },
  switchDescription: {
    fontSize: 13,
    fontFamily: theme.fonts.regular,
    color: color.gray,
  },
  submitButton: {
    backgroundColor: color.blue,
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    height: 56,
  },
  submitButtonText: {
    color: color.white,
    fontSize: 16,
    fontFamily: theme.fonts.semiBold,
  },
  disabledButton: {
    backgroundColor: `${color.blue}80`,
  },
  loadingButton: {
    backgroundColor: `${color.blue}e6`,
  },
});

export default ServiceForm;
