import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
} from "react-native";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { useAuth } from "../../services/AuthContext";
import { RootStackParamList } from "../../navigation/RootStackParamList";
import CustomHeader from "../../components/CustomHeader";
import theme from "../../assets/theme/theme";
import color from "../../assets/theme/colors";
import { formatDate } from "../../utils/formatDate";
import { formatPrice } from "../../utils/formatPrice";
import { SafeAreaView } from "react-native-safe-area-context";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";
import invoiceApi from "../../services/invoiceApi";

interface UpdateInvoicePayload {
  invoice_id: string;
  payment_deadline: string;
  status: string;
}

const UpdateInvoiceForm: React.FC = () => {
  const route = useRoute<RouteProp<RootStackParamList, "UpdateInvoiceForm">>();
  const { invoice } = route.params;
  const { token, handleLogout } = useAuth();
  const navigation = useNavigation();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [formData, setFormData] = useState<UpdateInvoicePayload>({
    invoice_id: invoice.invoice_id,
    payment_deadline: invoice.payment_deadline,
    status: invoice.status,
  });

  const handleUpdateInvoice = async () => {
    if (!token) return;

    setLoading(true);
    try {
      const api = invoiceApi(token, handleLogout);
      await api.updateInvoice(invoice.invoice_id, formData);
      Alert.alert("Success", "Invoice updated successfully", [
        { text: "OK", onPress: () => navigation.goBack() },
      ]);
    } catch (err) {
      setError("Failed to update invoice");
    } finally {
      setLoading(false);
    }
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setFormData((prev) => ({
        ...prev,
        payment_deadline: selectedDate.toISOString(),
      }));
    }
  };

  const renderServiceDetails = () => {
    return invoice.apartment.service_details.map((service, index) => (
      <View key={index} style={styles.serviceItem}>
        <View style={styles.serviceInfo}>
          <Text style={styles.serviceName}>{service.service.name}</Text>
          <Text style={styles.serviceAmount}>{formatPrice(service.money)}</Text>
        </View>
        {service.service.is_metered_service && (
          <Text style={styles.serviceUsage}>
            Usage: {service.old_value} → {service.new_value}{" "}
            {service.service.unit}
          </Text>
        )}
      </View>
    ));
  };

  const renderExpiryDetails = () => {
    if (invoice.status === "EXPIRED") {
      return (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Expiry Details</Text>
          <View style={styles.expiryItem}>
            <Text style={styles.expiryLabel}>Extra Payment Deadline</Text>
            <Text style={styles.expiryValue}>
              {formatDate(invoice.extra_payment_deadline)}
            </Text>
          </View>
          <View style={styles.expiryItem}>
            <Text style={styles.expiryLabel}>Penalty Fee</Text>
            <Text style={styles.expiryValue}>
              {formatPrice(invoice.penalty_fee)}
            </Text>
          </View>
        </View>
      );
    }
    return null;
  };

  return (
    <SafeAreaView style={styles.container}>
      <CustomHeader
        title="Invoice Details"
        onBackPress={() => navigation.goBack()}
      />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.apartmentName}>
            Apartment {invoice.apartment.name}
          </Text>
          <View style={styles.statusBadge}>
            <Text style={styles.statusText}>{invoice.apartment.status}</Text>
          </View>
        </View>

        <View style={styles.card}>
          <View style={styles.dateContainer}>
            <View style={styles.dateItem}>
              <Text style={styles.dateLabel}>Created</Text>
              <Text style={styles.dateValue}>
                {formatDate(invoice.create_date)}
              </Text>
            </View>
            <View style={styles.dateDivider} />
            <TouchableOpacity
              style={styles.dateItem}
              onPress={() => setShowDatePicker(true)}
            >
              <Text style={styles.dateLabel}>Due Date</Text>
              <Text style={styles.dateValue}>
                {formatDate(formData.payment_deadline)}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Status</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={formData.status}
              onValueChange={(value) =>
                setFormData((prev) => ({ ...prev, status: value }))
              }
              style={styles.picker}
            >
              <Picker.Item label="Unpaid" value="UNPAID" />
              <Picker.Item label="Paid" value="PAID" />
              <Picker.Item label="Expired" value="EXPIRED" />
            </Picker>
          </View>
        </View>

        {renderExpiryDetails()}

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Services</Text>
          {renderServiceDetails()}
          <View style={styles.totalContainer}>
            <Text style={styles.totalLabel}>Total Amount</Text>
            <Text style={styles.totalAmount}>{formatPrice(invoice.total)}</Text>
          </View>
        </View>

        {showDatePicker && (
          <DateTimePicker
            value={new Date(formData.payment_deadline)}
            mode="date"
            display="default"
            onChange={handleDateChange}
            minimumDate={new Date()}
          />
        )}
      </ScrollView>

      <View style={styles.footer}>
        {error && <Text style={styles.errorText}>{error}</Text>}
        <TouchableOpacity
          style={[styles.updateButton, loading && styles.updateButtonDisabled]}
          onPress={handleUpdateInvoice}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color={color.white} />
          ) : (
            <Text style={styles.updateButtonText}>Update Invoice</Text>
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
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  apartmentName: {
    fontSize: 24,
    fontFamily: theme.fonts.semiBold,
    color: color.black,
  },
  statusBadge: {
    backgroundColor: "#E3F2FD",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  statusText: {
    color: color.blue,
    fontFamily: theme.fonts.medium,
    fontSize: 14,
  },
  card: {
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
  cardTitle: {
    fontSize: 18,
    fontFamily: theme.fonts.semiBold,
    color: color.black,
    marginBottom: 16,
  },
  dateContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  dateItem: {
    flex: 1,
    alignItems: "center",
  },
  dateDivider: {
    width: 1,
    height: 40,
    backgroundColor: "#eee",
    marginHorizontal: 16,
  },
  dateLabel: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
  },
  dateValue: {
    fontSize: 16,
    fontFamily: theme.fonts.medium,
    color: color.black,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    overflow: "hidden",
  },
  picker: {
    height: 50,
  },
  serviceItem: {
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    paddingVertical: 12,
  },
  serviceInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  serviceName: {
    fontSize: 16,
    fontFamily: theme.fonts.medium,
    color: color.black,
  },
  serviceAmount: {
    fontSize: 16,
    fontFamily: theme.fonts.semiBold,
    color: color.blue,
  },
  serviceUsage: {
    fontSize: 14,
    color: "#666",
  },
  totalContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  totalLabel: {
    fontSize: 18,
    fontFamily: theme.fonts.semiBold,
    color: color.black,
  },
  totalAmount: {
    fontSize: 24,
    fontFamily: theme.fonts.bold,
    color: color.blue,
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
  updateButton: {
    backgroundColor: color.blue,
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  updateButtonDisabled: {
    opacity: 0.7,
  },
  updateButtonText: {
    color: color.white,
    fontSize: 16,
    fontFamily: theme.fonts.semiBold,
  },
  expiryItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  expiryLabel: {
    fontSize: 16,
    color: "#666",
    fontFamily: theme.fonts.medium,
  },
  expiryValue: {
    fontSize: 16,
    color: color.black,
    fontFamily: theme.fonts.semiBold,
  },
});

export default UpdateInvoiceForm;
