import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  StyleSheet,
  TextInput,
} from "react-native";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";

import { useAuth } from "../../services/AuthContext";
import LoadingModal from "../../components/modal/LoadingModal";
import CustomHeader from "../../components/CustomHeader";
import { RootStackParamList } from "../../navigation/RootStackParamList";
import {
  IApartment,
  IOwnerRequest,
  IRentalRecordRequest,
} from "../../utils/type";
import { useLocationData } from "../../hooks/useLocationData";
import apartmentApi from "../../services/apartmentApi";
import { DatePickerField } from "../../components/DatePickerField";
import { InputField } from "../../components/InputField";
import { SelectField } from "../../components/SelectField";
import color from "../../assets/theme/colors";
import theme from "../../assets/theme/theme";
import rentalRecordApi from "../../services/rentalRecordApi";

const CreateRenterRecordForm: React.FC = () => {
  const route =
    useRoute<RouteProp<RootStackParamList, "CreateRenterRecordForm">>();
  const navigation = useNavigation();
  const { token, handleLogout } = useAuth();
  const { apartment_id } = route.params;

  const [loading, setLoading] = useState(false);
  const [apartment, setApartment] = useState<IApartment>();
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [activeSection, setActiveSection] = useState<string>("record"); // "record" | "personal" | "contact" | "address"

  const [rentalDates, setRentalDates] = useState({
    startDate: new Date(),
    endDate: new Date(),
  });

  const [renter, setRenter] = useState<IOwnerRequest>({
    birth_day: new Date().toISOString(),
    career: "",
    city: "",
    district: "",
    email: "",
    first_name: "",
    gender: "MALE",
    id_card_number: "",
    last_name: "",
    middle_name: "",
    phone_number: "",
    street: "",
    ward: "",
  });

  useEffect(() => {
    fetchApartment();
  }, [token, apartment_id]);

  const fetchApartment = async () => {
    setLoading(true);
    try {
      if (token) {
        const api = apartmentApi(token, handleLogout);
        const data = await api.getApartmentById(apartment_id);
        setApartment(data);
      }
    } catch (err) {
      Alert.alert("Error", "Failed to fetch apartment details");
    } finally {
      setLoading(false);
    }
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    // Validate rental dates
    if (rentalDates.endDate <= rentalDates.startDate) {
      errors.dates = "End date must be after start date";
    }

    // Validate required personal info
    if (!renter.first_name) errors.first_name = "First name is required";
    if (!renter.last_name) errors.last_name = "Last name is required";
    if (!renter.phone_number) errors.phone_number = "Phone number is required";
    if (!renter.email) errors.email = "Email is required";
    if (!renter.id_card_number)
      errors.id_card_number = "ID card number is required";

    // Validate address
    if (!renter.city) errors.city = "Province is required";
    if (!renter.district) errors.district = "District is required";
    if (!renter.ward) errors.ward = "Ward is required";
    if (!renter.street) errors.street = "Street address is required";

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleCreateRentalRecord = async (
    recordRequest: IRentalRecordRequest
  ) => {
    setLoading(true);
    try {
      if (token) {
        const api = rentalRecordApi(token, handleLogout);
        const data = await api.createRecord(recordRequest);
      }
    } catch (err) {
      Alert.alert("Error", "Failed to fetch apartment details");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateRecord = () => {
    if (!validateForm()) {
      Alert.alert(
        "Validation Error",
        "Please fill in all required fields correctly."
      );
      return;
    }

    const recordRequest: IRentalRecordRequest = {
      start_date: rentalDates.startDate.toISOString(),
      end_date: rentalDates.endDate.toISOString(),
      renter,
      owner_id: apartment?.owner.owner_id,
    };

    handleCreateRentalRecord(recordRequest);
    Alert.alert("Success", "Renter record created successfully", [
      { text: "OK", onPress: () => navigation.goBack() },
    ]);
  };

  const updateRenter = (field: keyof IOwnerRequest, value: string) => {
    setRenter((prev) => ({
      ...prev,
      [field]: value,
    }));
    // Clear error when field is updated
    if (formErrors[field]) {
      setFormErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
    }
  };

  const SectionHeader = ({
    title,
    isActive,
    onPress,
  }: {
    title: string;
    isActive: boolean;
    onPress: () => void;
  }) => (
    <TouchableOpacity
      style={[styles.sectionHeader, isActive && styles.activeSectionHeader]}
      onPress={onPress}
    >
      <Text
        style={[
          styles.sectionHeaderText,
          isActive && styles.activeSectionHeaderText,
        ]}
      >
        {title}
      </Text>
      <MaterialIcons
        name={isActive ? "keyboard-arrow-up" : "keyboard-arrow-down"}
        size={24}
        color={isActive ? color.blue : color.gray}
      />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <CustomHeader
        title="Create Rental Record"
        onBackPress={navigation.goBack}
      />

      <ScrollView
        style={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Rental Period Section */}
        <View style={styles.section}>
          <SectionHeader
            title="Rental Period"
            isActive={activeSection === "record"}
            onPress={() =>
              setActiveSection(activeSection === "record" ? "" : "record")
            }
          />

          {activeSection === "record" && (
            <View style={styles.sectionContent}>
              <DatePickerField
                label="Start Date"
                value={rentalDates.startDate}
                onChange={(date) =>
                  setRentalDates((prev) => ({ ...prev, startDate: date }))
                }
                required
                error={formErrors.dates}
              />
              <DatePickerField
                label="End Date"
                value={rentalDates.endDate}
                onChange={(date) =>
                  setRentalDates((prev) => ({ ...prev, endDate: date }))
                }
                required
                error={formErrors.dates}
              />
            </View>
          )}
        </View>

        {/* Personal Information Section */}
        <View style={styles.section}>
          <SectionHeader
            title="Personal Information"
            isActive={activeSection === "personal"}
            onPress={() =>
              setActiveSection(activeSection === "personal" ? "" : "personal")
            }
          />

          {activeSection === "personal" && (
            <View style={styles.sectionContent}>
              <InputField
                label="First Name"
                value={renter.first_name}
                onChange={(text) => updateRenter("first_name", text)}
                placeholder="Enter first name"
                required
                error={formErrors.first_name}
              />
              <InputField
                label="Middle Name"
                value={renter.middle_name}
                onChange={(text) => updateRenter("middle_name", text)}
                placeholder="Enter middle name"
              />
              <InputField
                label="Last Name"
                value={renter.last_name}
                onChange={(text) => updateRenter("last_name", text)}
                placeholder="Enter last name"
                required
                error={formErrors.last_name}
              />
              <DatePickerField
                label="Birthday"
                value={new Date(renter.birth_day)}
                onChange={(date) =>
                  updateRenter("birth_day", date.toISOString())
                }
                maximumDate={new Date()}
                required
              />
              <SelectField
                label="Gender"
                value={renter.gender}
                onChange={(value) => updateRenter("gender", value)}
                options={[
                  { label: "Male", value: "MALE" },
                  { label: "Female", value: "FEMALE" },
                  { label: "Other", value: "OTHER" },
                ]}
                required
              />
              <InputField
                label="Career"
                value={renter.career}
                onChange={(text) => updateRenter("career", text)}
                placeholder="Enter career"
              />
            </View>
          )}
        </View>

        {/* Contact Information Section */}
        <View style={styles.section}>
          <SectionHeader
            title="Contact Information"
            isActive={activeSection === "contact"}
            onPress={() =>
              setActiveSection(activeSection === "contact" ? "" : "contact")
            }
          />

          {activeSection === "contact" && (
            <View style={styles.sectionContent}>
              <InputField
                label="Phone Number"
                value={renter.phone_number}
                onChange={(text) => updateRenter("phone_number", text)}
                placeholder="Enter phone number"
                keyboardType="numeric"
                required
                error={formErrors.phone_number}
              />
              <InputField
                label="Email"
                value={renter.email}
                onChange={(text) => updateRenter("email", text)}
                placeholder="Enter email"
                keyboardType="email-address"
                required
                error={formErrors.email}
              />
              <InputField
                label="ID Card Number"
                value={renter.id_card_number}
                onChange={(text) => updateRenter("id_card_number", text)}
                placeholder="Enter ID number"
                keyboardType="numeric"
                required
                error={formErrors.id_card_number}
              />
            </View>
          )}
        </View>

        {/* Address Section */}
        <View style={styles.section}>
          <SectionHeader
            title="Address Information"
            isActive={activeSection === "address"}
            onPress={() =>
              setActiveSection(activeSection === "address" ? "" : "address")
            }
          />

          {activeSection === "address" && (
            <View style={styles.sectionContent}>
              <InputField
                label="Province"
                value={renter.city}
                onChange={(text) => updateRenter("city", text)}
                placeholder="Enter province"
                required
                error={formErrors.city}
              />

              <InputField
                label="District"
                value={renter.district}
                onChange={(text) => updateRenter("district", text)}
                placeholder="Enter district"
                required
                error={formErrors.district}
              />

              <InputField
                label="Ward"
                value={renter.ward}
                onChange={(text) => updateRenter("ward", text)}
                placeholder="Enter ward"
                required
                error={formErrors.ward}
              />
              <InputField
                label="Street Address"
                value={renter.street}
                onChange={(text) => updateRenter("street", text)}
                placeholder="Enter street address"
                required
                error={formErrors.street}
              />
            </View>
          )}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.button, styles.cancelButton]}
          onPress={navigation.goBack}
        >
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.createButton]}
          onPress={handleCreateRecord}
        >
          <Text style={styles.createButtonText}>Create Record</Text>
        </TouchableOpacity>
      </View>

      <LoadingModal visible={loading} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  scrollContainer: {
    flex: 1,
    padding: 16,
  },
  section: {
    backgroundColor: color.white,
    borderRadius: 12,
    marginBottom: 16,
    overflow: "hidden",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    backgroundColor: color.white,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  activeSectionHeader: {
    borderBottomWidth: 2,
    borderBottomColor: color.blue,
  },
  sectionHeaderText: {
    fontSize: 16,
    fontFamily: theme.fonts.semiBold,
    color: color.gray,
  },
  activeSectionHeaderText: {
    color: color.blue,
  },
  sectionContent: {
    padding: 16,
  },
  footer: {
    flexDirection: "row",
    padding: 16,
    backgroundColor: color.white,
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
    gap: 12,
  },
  button: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  cancelButton: {
    backgroundColor: "#f5f5f5",
    borderWidth: 1,
    borderColor: "#ddd",
  },
  createButton: {
    backgroundColor: color.blue,
  },
  cancelButtonText: {
    color: color.gray,
    fontSize: 16,
    fontFamily: theme.fonts.semiBold,
  },
  createButtonText: {
    color: color.white,
    fontSize: 16,
    fontFamily: theme.fonts.semiBold,
  },
});

export default CreateRenterRecordForm;
