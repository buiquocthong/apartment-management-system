import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
} from "react-native";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { useAuth } from "../../services/AuthContext";
import { RootStackParamList } from "../../navigation/RootStackParamList";
import CustomHeader from "../../components/CustomHeader";
import theme from "../../assets/theme/theme";
import color from "../../assets/theme/colors";
import { SafeAreaView } from "react-native-safe-area-context";
import { InputField } from "../../components/InputField";
import invoiceSettingApi from "../../services/invoiceSettingApi";
import LoadingModal from "../../components/modal/LoadingModal";

type FormData = {
  invoice_setting_id: string;
  max_expired_time: 0;
  penalty_fee_percentage: 0;
};

const InvoiceSettingForm = () => {
  const { token, handleLogout } = useAuth();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormData>({
    invoice_setting_id: "",
    max_expired_time: 0,
    penalty_fee_percentage: 0,
  });

  const fetchInvoiceSetting = async () => {
    if (!token) {
      setError("No authentication token found");
      return;
    }

    try {
      setLoading(true);
      const api = invoiceSettingApi(token, handleLogout);
      const response = await api.getInvoiceSetting();
      setFormData({
        invoice_setting_id: response.invoice_setting_id,
        max_expired_time: response.max_expired_time,
        penalty_fee_percentage: response.penalty_fee_percentage,
      });
    } catch (err) {
      setError("Error fetching invoice setting data");
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!token) {
      setError("No authentication token found");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const api = invoiceSettingApi(token, handleLogout);
      await api.updateInvoiceSetting(formData);
      Alert.alert("Success", "Invoice setting updated successfully", [
        { text: "OK", onPress: () => navigation.goBack() },
      ]);
    } catch (err) {
      setError("Error while saving");
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const updateFormField = (field: keyof FormData, value: string | number) => {
    setFormData((prev) => ({
      ...prev,
      [field]:
        field === "max_expired_time" || field === "penalty_fee_percentage"
          ? parseInt(value.toString()) || 0
          : value,
    }));
  };

  useEffect(() => {
    fetchInvoiceSetting();
  }, []);

  if (loading && !formData) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={color.blue} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <CustomHeader title="Set up invoice" onBackPress={navigation.goBack} />

      <ScrollView
        style={styles.formContainer}
        showsVerticalScrollIndicator={false}
      >
        {error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        <Text style={styles.sectionTitle}>Invoice setting information</Text>

        <View style={styles.formFields}>
          <InputField
            label="Maximum Expiry Time (Days)"
            value={formData.max_expired_time.toString()}
            onChange={(text) => updateFormField("max_expired_time", text)}
            placeholder="Enter number"
            required
            keyboardType="numeric"
          />

          <InputField
            label="Late Payment Penalty (%)"
            value={formData.penalty_fee_percentage.toString()}
            onChange={(text) => updateFormField("penalty_fee_percentage", text)}
            placeholder="Enter number"
            required
            keyboardType="numeric"
          />
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.button, styles.cancelButton]}
          onPress={navigation.goBack}
        >
          <Text style={[styles.buttonText, styles.cancelButtonText]}>
            Cancel
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.button,
            styles.updateButton,
            !formData.max_expired_time &&
              !formData.penalty_fee_percentage &&
              styles.disabledButton,
          ]}
          onPress={handleSubmit}
          disabled={
            !formData.max_expired_time ||
            !formData.penalty_fee_percentage ||
            loading
          }
        >
          {loading ? (
            <ActivityIndicator size="small" color={color.white} />
          ) : (
            <Text style={styles.buttonText}>Update setting</Text>
          )}
        </TouchableOpacity>
      </View>
      <LoadingModal visible={loading} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f1f3f4",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f1f3f4",
  },
  formContainer: {
    flex: 1,
    padding: 24,
  },
  formFields: {
    gap: 20,
  },
  sectionTitle: {
    fontSize: 22,
    fontFamily: theme.fonts.bold,
    color: color.black,
    marginBottom: 24,
  },
  inputField: {
    marginBottom: 16,
  },
  errorContainer: {
    backgroundColor: "#ffebee",
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
  },
  errorText: {
    color: "#d32f2f",
    fontFamily: theme.fonts.medium,
    fontSize: 14,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 20,
    backgroundColor: "white",
    borderTopWidth: 1,
    borderTopColor: "#ddd",
  },
  button: {
    flex: 1,
    height: 50,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  buttonText: {
    fontSize: 16,
    fontFamily: theme.fonts.semiBold,
    color: color.white,
  },
  cancelButton: {
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: color.gray,
    marginRight: 16,
  },
  cancelButtonText: {
    color: color.gray,
  },
  updateButton: {
    backgroundColor: color.blue,
  },
  disabledButton: {
    backgroundColor: color.gray,
    opacity: 0.6,
  },
});

export default InvoiceSettingForm;
