import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Platform,
  ActivityIndicator,
  KeyboardAvoidingView,
  Switch,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import blockApi from "../../services/blockApi";
import { useAuth } from "../../services/AuthContext";
import CustomHeader from "../../components/CustomHeader";
import theme from "../../assets/theme/theme";
import color from "../../assets/theme/colors";
import { InputField } from "../../components/InputField";
import { SafeAreaView } from "react-native-safe-area-context";
import { formatNumber } from "../../utils/formatNumber";
import { renderLabel } from "../../components/RenderLabel";

interface FormData {
  furnished: boolean;
  name: string;
  description: string;
  total_floor: number | null;
  apartment_per_floor: number | null;
  area: number | null;
  number_of_bedroom: number | null;
  number_of_bathroom: number | null;
  purchase_price: number | null;
}

const CreateBlockForm = () => {
  const [loading, setLoading] = useState(false);
  const { token, handleLogout } = useAuth();
  const navigation = useNavigation();

  const [formData, setFormData] = useState<FormData>({
    furnished: false,
    name: "",
    description: "",
    total_floor: null,
    apartment_per_floor: null,
    area: null,
    number_of_bedroom: null,
    number_of_bathroom: null,
    purchase_price: null,
  });

  const isFormValid = () => {
    return (
      formData.name.trim() !== "" &&
      formData.total_floor !== null &&
      formData.total_floor > 0 &&
      formData.apartment_per_floor !== null &&
      formData.apartment_per_floor > 0
    );
  };

  const parseFormattedNumber = (value: string): number => {
    return Number(value.replace(/\./g, ""));
  };

  const formatDisplayNumber = (value: number | null): string => {
    if (value === null) return "";
    return value.toLocaleString("vi-VN");
  };

  const updateFormField = (
    field: keyof FormData,
    value: string | number | boolean
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]:
        field === "furnished"
          ? value
          : field === "name" || field === "description"
          ? value
          : value === ""
          ? null
          : typeof value === "string"
          ? parseFormattedNumber(value)
          : value,
    }));
  };

  const handleSubmit = async () => {
    setLoading(true);

    try {
      if (!token) {
        throw new Error("No authentication token found");
      }

      const submitData = {
        ...formData,
        total_floor: formData.total_floor || 0,
        apartment_per_floor: formData.apartment_per_floor || 0,
        area: formData.area || 0,
        number_of_bedroom: formData.number_of_bedroom || 0,
        number_of_bathroom: formData.number_of_bathroom || 0,
        purchase_price: formData.purchase_price || 0,
      };

      const api = blockApi(token, handleLogout);
      await api.createBlock(submitData);

      alert("Block added successfully");
      navigation.goBack();
    } catch (err) {
      alert(
        err instanceof Error ? err.message : "Error while saving the block"
      );
    } finally {
      setLoading(false);
    }
  };

  const renderFooterButtons = () => (
    <View style={styles.footer}>
      <TouchableOpacity
        style={[styles.button, styles.cancelButton]}
        onPress={() => navigation.goBack()}
      >
        <Text style={[styles.buttonText, styles.cancelButtonText]}>Cancel</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.button,
          styles.submitButton,
          !isFormValid() && styles.disabledButton,
        ]}
        onPress={handleSubmit}
        disabled={!isFormValid() || loading}
      >
        {loading ? (
          <ActivityIndicator color={color.white} />
        ) : (
          <Text style={styles.buttonText}>Add Block</Text>
        )}
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <CustomHeader
        title="Add New Block"
        onBackPress={() => navigation.goBack()}
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardView}
      >
        <ScrollView
          style={styles.formContainer}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Block Information</Text>

            <InputField
              label="Block Name"
              value={formData.name}
              onChange={(text) => updateFormField("name", text)}
              placeholder="Enter block name"
              required
            />

            <InputField
              label="Description"
              value={formData.description}
              onChange={(text) => updateFormField("description", text)}
              placeholder="Enter description"
              multiline
            />
          </View>

          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Apartment Details</Text>

            <View style={styles.switchContainer}>
              {renderLabel({ label: "Furnished", required: true })}
              <Switch
                value={formData.furnished}
                onValueChange={(value) => updateFormField("furnished", value)}
                trackColor={{ false: color.gray, true: color.blue }}
                thumbColor={formData.furnished ? color.white : color.lightGray}
                ios_backgroundColor={color.gray}
                style={styles.switch}
              />
            </View>

            <View style={styles.row}>
              <View style={styles.halfWidth}>
                <InputField
                  label="Total Floors"
                  value={formatDisplayNumber(formData.total_floor)}
                  onChange={(text) => updateFormField("total_floor", text)}
                  placeholder="Enter number"
                  required
                  keyboardType="numeric"
                />
              </View>

              <View style={styles.halfWidth}>
                <InputField
                  label="Apartments / Floor"
                  value={formatDisplayNumber(formData.apartment_per_floor)}
                  onChange={(text) =>
                    updateFormField("apartment_per_floor", text)
                  }
                  placeholder="Enter number"
                  required
                  keyboardType="numeric"
                />
              </View>
            </View>

            <View style={styles.row}>
              <View style={styles.halfWidth}>
                <InputField
                  label="Area (sq ft)"
                  value={formatDisplayNumber(formData.area)}
                  onChange={(text) => updateFormField("area", text)}
                  placeholder="Enter area"
                  keyboardType="numeric"
                  required
                />
              </View>

              <View style={styles.halfWidth}>
                <InputField
                  label="Purchase Price"
                  value={formatDisplayNumber(formData.purchase_price)}
                  onChange={(text) => updateFormField("purchase_price", text)}
                  placeholder="Enter price"
                  keyboardType="numeric"
                  required
                />
              </View>
            </View>

            <View style={styles.row}>
              <View style={styles.halfWidth}>
                <InputField
                  label="Bedrooms"
                  value={formatDisplayNumber(formData.number_of_bedroom)}
                  onChange={(text) =>
                    updateFormField("number_of_bedroom", text)
                  }
                  placeholder="Enter number"
                  keyboardType="numeric"
                  required
                />
              </View>

              <View style={styles.halfWidth}>
                <InputField
                  label="Bathrooms"
                  value={formatDisplayNumber(formData.number_of_bathroom)}
                  onChange={(text) =>
                    updateFormField("number_of_bathroom", text)
                  }
                  placeholder="Enter number"
                  keyboardType="numeric"
                  required
                />
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {renderFooterButtons()}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  formContainer: {
    padding: 16,
  },
  keyboardView: {
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
  sectionTitle: {
    fontSize: 18,
    fontFamily: theme.fonts.bold,
    color: color.black,
    marginBottom: 16,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: -8,
  },
  halfWidth: {
    flex: 1,
    marginHorizontal: 8,
  },
  switch: {
    alignSelf: "flex-start",
  },
  footer: {
    flexDirection: "row",
    padding: 16,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  button: {
    flex: 1,
    marginHorizontal: 8,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  submitButton: {
    backgroundColor: color.blue,
  },
  cancelButton: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: color.gray,
  },
  disabledButton: {
    backgroundColor: "#87CEFA",
  },
  buttonText: {
    fontSize: 16,
    fontFamily: theme.fonts.semiBold,
    color: color.white,
  },
  cancelButtonText: {
    color: color.gray,
  },
  switchContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontFamily: theme.fonts.medium,
    color: color.black,
  },
});

export default CreateBlockForm;
