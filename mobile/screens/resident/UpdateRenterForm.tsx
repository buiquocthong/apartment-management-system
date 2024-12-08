import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { RootStackParamList } from "../../navigation/RootStackParamList";
import { SafeAreaView } from "react-native-safe-area-context";
import CustomHeader from "../../components/CustomHeader";
import { DatePickerField } from "../../components/DatePickerField";
import { InputField } from "../../components/InputField";
import { SelectField } from "../../components/SelectField";
import { useAuth } from "../../services/AuthContext";
import renterApi from "../../services/renterApi";
import theme from "../../assets/theme/theme";
import color from "../../assets/theme/colors";

interface RenterUpdateData {
  first_name: string;
  middle_name?: string;
  last_name: string;
  birth_day: string;
  gender: string;
  phone_number: string;
  email: string;
  id_card_number: string;
  career?: string;
  city: string;
  district: string;
  ward: string;
  street: string;
  household_head: boolean;
}

const UpdateRenterForm: React.FC = () => {
  const route = useRoute<RouteProp<RootStackParamList, "UpdateRenterForm">>();
  const { renter, record_id } = route.params; // Destructure renter and record_id
  const { token, handleLogout } = useAuth();
  const [loading, setLoading] = useState<boolean>(false);

  // Initialize form data based on whether renter is provided
  const [formData, setFormData] = useState<RenterUpdateData>(() => {
    const defaultDate = new Date().toISOString();

    return {
      first_name: renter?.first_name || "",
      middle_name: renter?.middle_name || "",
      last_name: renter?.last_name || "",
      birth_day: renter?.birth_day
        ? new Date(renter.birth_day).toISOString()
        : defaultDate,
      gender: renter?.gender || "MALE",
      phone_number: renter?.phone_number || "",
      email: renter?.email || "",
      id_card_number: renter?.id_card_number || "",
      career: renter?.career || "",
      city: renter?.city || "",
      district: renter?.district || "",
      ward: renter?.ward || "",
      street: renter?.street || "",
      household_head: renter?.household_head || false,
    };
  });

  const navigation = useNavigation();

  const handleSubmit = async () => {
    const requiredKeys: (keyof RenterUpdateData)[] = [
      "first_name",
      "last_name",
      "birth_day",
      "gender",
      "phone_number",
      "email",
      "id_card_number",
      "city",
      "district",
      "ward",
      "street",
    ];

    const missingFields = requiredKeys.filter((key) => !formData[key]);

    if (missingFields.length > 0) {
      Alert.alert(
        "Validation Error",
        `Please fill in the following fields: ${missingFields.join(", ")}`
      );
      return;
    }

    if (!token) {
      Alert.alert("Error", "Authentication token is missing");
      return;
    }

    setLoading(true);

    try {
      const api = renterApi(token, handleLogout);

      if (renter) {
        // Update existing renter
        await api.updateRenter(renter.renter_id, formData);
        Alert.alert("Success", "Renter updated successfully", [
          { text: "OK", onPress: () => navigation.goBack() },
        ]);
      } else if (record_id) {
        // Create a new renter
        await api.createRenter({ ...formData, record_id });
        Alert.alert("Success", "Renter created successfully", [
          { text: "OK", onPress: () => navigation.goBack() },
        ]);
      } else {
        Alert.alert("Error", "Invalid operation");
      }
    } catch (err) {
      console.log(err);
      Alert.alert(
        "Error",
        `Failed to ${renter ? "update" : "create"} renter. Please try again.`
      );
    } finally {
      setLoading(false);
    }
  };

  const updateFormData = <K extends keyof RenterUpdateData>(
    key: K,
    value: RenterUpdateData[K]
  ) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <CustomHeader
        title={renter ? "Update Renter" : "Create Renter"}
        onBackPress={() => navigation.goBack()}
      />
      <ScrollView
        style={styles.scrollContainer}
        contentContainerStyle={styles.content}
      >
        <View style={styles.infoContainer}>
          <Text style={styles.label}>Renter Information</Text>

          <InputField
            label="First name"
            value={formData.first_name}
            onChange={(text) => updateFormData("first_name", text)}
            placeholder="Enter first name"
            required
          />

          <InputField
            label="Middle name"
            value={formData.middle_name || ""}
            onChange={(text) => updateFormData("middle_name", text)}
            placeholder="Enter middle name"
          />

          <InputField
            label="Last name"
            value={formData.last_name}
            onChange={(text) => updateFormData("last_name", text)}
            placeholder="Enter last name"
            required
          />

          <DatePickerField
            label="Birthday"
            value={formData.birth_day}
            onChange={(date) => updateFormData("birth_day", date.toISOString())}
            maximumDate={new Date()}
            required
          />

          <SelectField
            label="Gender"
            value={formData.gender}
            onChange={(value) =>
              updateFormData("gender", value as "MALE" | "FEMALE" | "OTHER")
            }
            options={[
              { label: "Male", value: "MALE" },
              { label: "Female", value: "FEMALE" },
              { label: "Other", value: "OTHER" },
            ]}
            required
          />

          <InputField
            label="Phone number"
            value={formData.phone_number}
            onChange={(text) => updateFormData("phone_number", text)}
            placeholder="Enter phone number"
            keyboardType="numeric"
          />

          <InputField
            label="Email"
            value={formData.email}
            onChange={(text) => updateFormData("email", text)}
            placeholder="Enter email"
            keyboardType="email-address"
          />

          <InputField
            label="ID card number"
            value={formData.id_card_number}
            onChange={(text) => updateFormData("id_card_number", text)}
            placeholder="Enter ID number"
            keyboardType="numeric"
            required
          />

          <InputField
            label="Career"
            value={formData.career || ""}
            onChange={(text) => updateFormData("career", text)}
            placeholder="Enter career"
          />

          {renter && (
            <View style={styles.readOnlyContainer}>
              <Text style={styles.readOnlyLabel}>Household Head</Text>
              <Text style={styles.readOnlyValue}>
                {formData.household_head ? "Yes" : "No"}
              </Text>
            </View>
          )}
        </View>

        <View style={styles.infoContainer}>
          <Text style={styles.label}>Address</Text>
          <InputField
            label="Province"
            value={formData.city}
            onChange={(text) => updateFormData("city", text)}
            placeholder="Enter province"
            required
          />

          <InputField
            label="District"
            value={formData.district}
            onChange={(text) => updateFormData("district", text)}
            placeholder="Enter district"
            required
          />

          <InputField
            label="Ward"
            value={formData.ward}
            onChange={(text) => updateFormData("ward", text)}
            placeholder="Enter ward"
            required
          />

          <InputField
            label="Street Address"
            value={formData.street}
            onChange={(text) => updateFormData("street", text)}
            placeholder="Enter street address"
            required
          />
        </View>
      </ScrollView>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, styles.cancelButton]}
          onPress={() => navigation.goBack()}
          disabled={loading}
        >
          <Text style={styles.buttonText}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.updateButton]}
          onPress={handleSubmit}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading
              ? renter
                ? "Updating..."
                : "Creating..."
              : renter
              ? "Update"
              : "Create"}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  infoContainer: {
    backgroundColor: color.white,
    borderRadius: 8,
    padding: 16,
    marginTop: 15,
    marginBottom: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  scrollContainer: {
    flex: 1,
  },
  content: {
    paddingBottom: 5,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    fontFamily: theme.fonts.semiBold,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
    fontFamily: theme.fonts.regular,
  },
  picker: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    marginBottom: 15,
  },
  button: {
    backgroundColor: color.blue,
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
    margin: 15,
  },
  buttonText: {
    color: color.white,
    fontSize: 18,
    fontFamily: theme.fonts.bold,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 15,
    marginBottom: 15,
  },
  cancelButton: {
    backgroundColor: color.gray,
  },
  updateButton: {
    backgroundColor: color.blue,
  },
  readOnlyContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  readOnlyLabel: {
    fontSize: 16,
    fontFamily: theme.fonts.semiBold,
    color: "#333",
  },
  readOnlyValue: {
    fontSize: 16,
    fontFamily: theme.fonts.regular,
    color: "#666",
  },
});

export default UpdateRenterForm;
