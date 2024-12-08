import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Linking,
  ActivityIndicator,
  Switch,
  Alert,
} from "react-native";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import apartmentApi from "../../services/apartmentApi";
import { useAuth } from "../../services/AuthContext";
import { RootStackParamList } from "../../navigation/RootStackParamList";
import CustomHeader from "../../components/CustomHeader";
import theme from "../../assets/theme/theme";
import color from "../../assets/theme/colors";
import { IApartment, IOwner } from "../../utils/type";
import { SafeAreaView } from "react-native-safe-area-context";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { formatPrice } from "../../utils/formatPrice";
import { formatNumber } from "../../utils/formatNumber";
import { InputField } from "../../components/InputField";
import { renderLabel } from "../../components/RenderLabel";

const UpdateApartmentForm = () => {
  const route =
    useRoute<RouteProp<RootStackParamList, "UpdateApartmentForm">>();
  const { apartment_id } = route.params;
  const { token, handleLogout } = useAuth();
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [apartment, setApartment] = useState<IApartment>();
  const [formData, setFormData] = useState({
    name: "",
    area: 0,
    number_of_bedroom: 0,
    number_of_bathroom: 0,
    purchase_price: 0,
    furnished: false,
    status: "",
  });

  useEffect(() => {
    fetchApartment();
  }, [apartment_id, token]);

  const fetchApartment = async () => {
    if (!token) return;

    setLoading(true);
    try {
      const api = apartmentApi(token, handleLogout);
      const data = await api.getApartmentById(apartment_id);
      setApartment(data);
      setFormData({
        name: data.name,
        area: data.area,
        number_of_bedroom: data.number_of_bedroom,
        number_of_bathroom: data.number_of_bathroom,
        purchase_price: data.sale_info?.purchase_price || 0,
        furnished: data.furnished,
        status: data.status,
      });
    } catch (err) {
      setError("Failed to fetch apartment details");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!token || !apartment) return;

    setLoading(true);
    try {
      const api = apartmentApi(token, handleLogout);
      const updatedApartment = {
        ...apartment,
        ...formData,
        sale_info: {
          ...apartment.sale_info,
          purchase_price: formData.purchase_price,
        },
      };

      await api.updateApartment(apartment_id, updatedApartment);
      Alert.alert("Success", "Apartment updated successfully", [
        { text: "OK", onPress: () => navigation.goBack() },
      ]);
    } catch (err) {
      setError("Failed to update apartment");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (
    field: keyof typeof formData,
    value: string | number | boolean
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: typeof value === "string" ? formatNumber(value) : value,
    }));
  };

  if (loading && !apartment) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={color.blue} />
      </View>
    );
  }

  const renderOwnerInfo = (owner?: IOwner) => {
    if (!owner || apartment?.status !== "SOLD") return null;

    return (
      <View style={styles.infoContainer}>
        <Text style={styles.sectionTitle}>Owner Information</Text>
        <View style={styles.ownerInfoContent}>
          <View style={styles.avatarContainer}>
            <MaterialIcons name="person" size={36} color={color.white} />
          </View>
          <View style={styles.ownerTextInfo}>
            <Text style={styles.ownerName}>
              {`${owner.last_name || ""} ${owner.middle_name || ""} ${
                owner.first_name || ""
              }`.trim()}
            </Text>
            <Text style={styles.ownerAddress}>
              {`${owner.street || ""} ${owner.ward || ""} ${
                owner.district || ""
              } ${owner.city || ""}`.trim() || "Address not recorded"}
            </Text>
            <TouchableOpacity
              style={styles.phoneButton}
              onPress={() =>
                owner.phone_number &&
                Linking.openURL(`tel:${owner.phone_number}`)
              }
            >
              <MaterialIcons name="phone" size={20} color={color.blue} />
              <Text style={styles.phoneText}>
                {owner.phone_number || "No phone number"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  const renderServices = () => {
    if (!apartment?.service_details.length) return null;

    return (
      <View style={styles.infoContainer}>
        <Text style={styles.sectionTitle}>Services</Text>
        {apartment.service_details.map((service) => (
          <View key={service.service_detail_id} style={styles.serviceItem}>
            <View>
              <Text style={styles.serviceTitle}>{service.service.name}</Text>
              <Text style={styles.servicePrice}>
                {formatPrice(service.service.price)}/{service.service.unit}
              </Text>
            </View>
            <View style={styles.serviceIndex}>
              <Text style={styles.indexText}>
                {service.service.is_metered_service
                  ? `Current: ${service.new_value}`
                  : `1/${service.service.unit}`}
              </Text>
            </View>
          </View>
        ))}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <CustomHeader
        title="Update Apartment"
        onBackPress={() => navigation.goBack()}
      />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.infoContainer}>
          <Text style={styles.sectionTitle}>Basic Information</Text>
          <InputField
            label="Apartment Name"
            value={formData.name}
            onChange={(value) => handleInputChange("name", value)}
            placeholder="Enter apartment name"
            required
          />
          <InputField
            label="Area (m²)"
            value={formatPrice(formData.area)}
            onChange={(value) => handleInputChange("area", value)}
            keyboardType="numeric"
            required
          />
          <InputField
            label="Bedrooms"
            value={formData.number_of_bedroom.toString()}
            onChange={(value) => handleInputChange("number_of_bedroom", value)}
            keyboardType="numeric"
            required
          />
          <InputField
            label="Bathrooms"
            value={formData.number_of_bathroom.toString()}
            onChange={(value) => handleInputChange("number_of_bathroom", value)}
            keyboardType="numeric"
            required
          />
          <View style={styles.switchContainer}>
            {renderLabel({ label: "Furnished", required: true })}
            <Text style={styles.fieldDescription}>
              Toggle on if the apartment includes furniture
            </Text>
            <Switch
              value={formData.furnished}
              onValueChange={(value) => handleInputChange("furnished", value)}
              trackColor={{ false: color.gray, true: color.blue }}
              thumbColor={formData.furnished ? color.white : color.lightGray}
              ios_backgroundColor={color.gray}
              style={styles.switch}
            />
          </View>
        </View>

        <View style={styles.infoContainer}>
          <Text style={styles.sectionTitle}>Sale Information</Text>
          <InputField
            label="Purchase Price"
            value={formatPrice(formData.purchase_price)}
            onChange={(value) => handleInputChange("purchase_price", value)}
            keyboardType="numeric"
            required
          />
        </View>

        {renderOwnerInfo(apartment?.owner)}
        {renderServices()}
      </ScrollView>

      <View style={styles.footer}>
        {error && <Text style={styles.errorText}>{error}</Text>}
        <TouchableOpacity
          style={[styles.submitButton, loading && styles.submitButtonDisabled]}
          onPress={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color={color.white} />
          ) : (
            <Text style={styles.submitButtonText}>Update Apartment</Text>
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
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    flex: 1,
    padding: 16,
  },
  infoContainer: {
    backgroundColor: color.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  switchContainer: {
    marginBottom: 20,
  },
  fieldDescription: {
    fontSize: 14,
    color: color.gray,
    marginVertical: 8,
    fontFamily: theme.fonts.regular,
  },
  switch: {
    alignSelf: "flex-start",
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: theme.fonts.semiBold,
    color: color.black,
    marginBottom: 16,
  },
  ownerInfoContent: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  avatarContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: color.blue,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },
  ownerTextInfo: {
    flex: 1,
  },
  ownerName: {
    fontSize: 16,
    fontFamily: theme.fonts.semiBold,
    color: color.black,
    marginBottom: 4,
  },
  ownerAddress: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
  },
  phoneButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E3F2FD",
    padding: 8,
    borderRadius: 8,
    alignSelf: "flex-start",
  },
  phoneText: {
    marginLeft: 8,
    color: color.blue,
    fontFamily: theme.fonts.medium,
  },
  serviceItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  serviceTitle: {
    fontSize: 16,
    fontFamily: theme.fonts.medium,
    color: color.black,
    marginBottom: 4,
  },
  servicePrice: {
    fontSize: 14,
    color: "#666",
  },
  serviceIndex: {
    backgroundColor: "#E3F2FD",
    padding: 8,
    borderRadius: 8,
  },
  indexText: {
    color: color.blue,
    fontFamily: theme.fonts.medium,
  },
  footer: {
    backgroundColor: color.white,
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  errorText: {
    color: "red",
    textAlign: "center",
    marginBottom: 8,
  },
  submitButton: {
    backgroundColor: color.blue,
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  submitButtonDisabled: {
    opacity: 0.7,
  },
  submitButtonText: {
    color: color.white,
    fontSize: 16,
    fontFamily: theme.fonts.semiBold,
  },
});

export default UpdateApartmentForm;
