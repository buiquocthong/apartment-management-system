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
import ownerApi from "../../services/ownerApi";
import theme from "../../assets/theme/theme";
import color from "../../assets/theme/colors";

interface OwnerUpdateData {
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
  occupancy: boolean;
}

const UpdateOwnerForm: React.FC = () => {
  const route = useRoute<RouteProp<RootStackParamList, "UpdateOwnerForm">>();
  const { owner, household_id } = route.params;
  const { token, handleLogout } = useAuth();
  const [loading, setLoading] = useState<boolean>(false);

  // Initialize form data based on whether owner is provided
  const [formData, setFormData] = useState<OwnerUpdateData>(() => {
    const defaultDate = new Date().toISOString();

    return {
      first_name: owner?.first_name || "",
      middle_name: owner?.middle_name || "",
      last_name: owner?.last_name || "",
      birth_day: owner?.birth_day
        ? new Date(owner.birth_day).toISOString()
        : defaultDate,
      gender: owner?.gender || "MALE",
      phone_number: owner?.phone_number || "",
      email: owner?.email || "",
      id_card_number: owner?.id_card_number || "",
      career: owner?.career || "",
      city: owner?.city || "",
      district: owner?.district || "",
      ward: owner?.ward || "",
      street: owner?.street || "",
      household_head: owner?.household_head || false,
      occupancy: owner?.occupancy || false,
    };
  });

  const navigation = useNavigation();

  const handleSubmit = async () => {
    const requiredKeys: (keyof OwnerUpdateData)[] = [
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
      const api = ownerApi(token, handleLogout);
      if (owner) {
        // Update existing owner
        await api.updateOwner(owner.owner_id, formData);
        Alert.alert("Success", "Owner updated successfully", [
          { text: "OK", onPress: () => navigation.goBack() },
        ]);
      } else if (household_id) {
        // Create a new owner
        await api.createOwner({ ...formData, household_id });
        Alert.alert("Success", "Owner created successfully", [
          { text: "OK", onPress: () => navigation.goBack() },
        ]);
      } else {
        Alert.alert("Error", "Invalid operation");
      }
    } catch (err) {
      console.log(err);
      Alert.alert(
        "Error",
        `Failed to ${owner ? "update" : "create"} owner. Please try again.`
      );
    } finally {
      setLoading(false);
    }
  };

  const updateFormData = <K extends keyof OwnerUpdateData>(
    key: K,
    value: OwnerUpdateData[K]
  ) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <CustomHeader
        title={owner ? "Update Owner" : "Create Owner"}
        onBackPress={() => navigation.goBack()}
      />
      <ScrollView
        style={styles.scrollContainer}
        contentContainerStyle={styles.content}
      >
        <View style={styles.infoContainer}>
          <Text style={styles.label}>Owner Information</Text>

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

          {owner && (
            <>
              <View style={styles.readOnlyContainer}>
                <Text style={styles.readOnlyLabel}>Household Head</Text>
                <Text style={styles.readOnlyValue}>
                  {formData.household_head ? "Yes" : "No"}
                </Text>
              </View>

              <View style={styles.readOnlyContainer}>
                <Text style={styles.readOnlyLabel}>Occupancy</Text>
                <Text style={styles.readOnlyValue}>
                  {formData.occupancy ? "Yes" : "No"}
                </Text>
              </View>
            </>
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
              ? owner
                ? "Updating..."
                : "Creating..."
              : owner
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

export default UpdateOwnerForm;
