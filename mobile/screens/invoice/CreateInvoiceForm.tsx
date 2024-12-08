import React, { useEffect, useState } from "react";
import {
  View,
  ScrollView,
  StyleSheet,
  Alert,
  TouchableOpacity,
} from "react-native";
import { TextInput, Card, Text, Surface } from "react-native-paper";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import dayjs from "dayjs";
import { RootStackParamList } from "../../navigation/RootStackParamList";
import apartmentApi from "../../services/apartmentApi";
import invoiceApi from "../../services/invoiceApi";
import { useAuth } from "../../services/AuthContext";
import { SafeAreaView } from "react-native-safe-area-context";
import CustomHeader from "../../components/CustomHeader";
import LoadingModal from "../../components/modal/LoadingModal";
import color from "../../assets/theme/colors";
import theme from "../../assets/theme/theme";

interface ServiceDetail {
  service_id: string;
  service: {
    service_id: string;
    name: string;
    price: number;
    unit?: string;
    metered_service: boolean;
  };
  old_value: number;
  new_value: number;
  amount_of_using: number;
}

const CreateInvoiceForm = () => {
  const route = useRoute<RouteProp<RootStackParamList, "CreateInvoiceForm">>();
  const { apartment_id } = route.params;
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { token, handleLogout } = useAuth();

  const [loading, setLoading] = useState(false);
  const [serviceDetails, setServiceDetails] = useState<ServiceDetail[]>([]);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [formData, setFormData] = useState({
    payment_deadline: new Date(),
    status: "UNPAID",
    total: 0,
  });

  useEffect(() => {
    fetchServiceDetails();
  }, []);

  const fetchServiceDetails = async () => {
    try {
      if (!token) return;
      setLoading(true);
      const api = apartmentApi(token, handleLogout);
      const response = await api.getApartmentById(apartment_id);

      const formattedServiceDetails = response.service_details.map(
        (detail: any) => ({
          service_id: detail.service.service_id,
          service: detail.service,
          old_value: detail.old_value || 0,
          new_value: detail.new_value || 0,
          amount_of_using: detail.amount_of_using,
        })
      );

      setServiceDetails(formattedServiceDetails);
      calculateTotal(formattedServiceDetails);
    } catch (error) {
      Alert.alert("Error", "Failed to fetch service details");
    } finally {
      setLoading(false);
    }
  };

  const calculateTotal = (details: ServiceDetail[]) => {
    const total = details.reduce((sum, detail) => {
      const usage = detail.new_value - detail.old_value;
      const price = detail.service.price || 0;
      return (
        sum +
        (detail.service.metered_service
          ? usage * price
          : price * detail.amount_of_using)
      );
    }, 0);

    setFormData((prev) => ({ ...prev, total }));
  };

  const handleServiceDetailChange = (
    index: number,
    field: string,
    value: number
  ) => {
    const updatedDetails = [...serviceDetails];
    updatedDetails[index] = {
      ...updatedDetails[index],
      [field]: value,
    };

    setServiceDetails(updatedDetails);
    calculateTotal(updatedDetails);
  };

  const handleCreateInvoice = async () => {
    try {
      if (!token) return;
      setLoading(true);

      const newInvoice = {
        apartment_id,
        payment_deadline: formData.payment_deadline.toISOString(),
        status: formData.status,
      };

      await invoiceApi(token, handleLogout).createInvoice(newInvoice);
      Alert.alert("Success", "Invoice created successfully", [
        { text: "OK", onPress: () => navigation.goBack() },
      ]);
    } catch (error) {
      Alert.alert("Error", "Failed to create invoice");
    } finally {
      setLoading(false);
    }
  };

  const ServiceDetailItem = ({
    detail,
    index,
  }: {
    detail: ServiceDetail;
    index: number;
  }) => (
    <Surface style={styles.serviceCard}>
      <View style={styles.serviceHeader}>
        <View style={styles.serviceInfo}>
          <Text style={styles.serviceName}>{detail.service.name}</Text>
          <Text style={styles.servicePrice}>
            {detail.service.price?.toLocaleString()} đ
            {detail.service.unit
              ? ` / ${detail.amount_of_using} ${detail.service.unit}`
              : ""}
          </Text>
        </View>
      </View>

      {detail.service.metered_service && (
        <View style={styles.meterInputContainer}>
          <View style={styles.inputWrapper}>
            <TextInput
              mode="outlined"
              label="Old Value"
              keyboardType="numeric"
              value={detail.old_value.toString()}
              onChangeText={(value) =>
                handleServiceDetailChange(index, "old_value", Number(value))
              }
              style={styles.input}
              outlineStyle={styles.inputOutline}
            />
          </View>
          <View style={styles.inputWrapper}>
            <TextInput
              mode="outlined"
              label="New Value"
              keyboardType="numeric"
              value={detail.new_value.toString()}
              onChangeText={(value) =>
                handleServiceDetailChange(index, "new_value", Number(value))
              }
              style={styles.input}
              outlineStyle={styles.inputOutline}
            />
          </View>
        </View>
      )}

      {detail.new_value - detail.old_value > 0 && (
        <View style={styles.subtotalContainer}>
          <Text style={styles.subtotalLabel}>Subtotal:</Text>
          <Text style={styles.subtotalValue}>
            {`${detail.new_value - detail.old_value} ${
              detail.service.unit
            } × ${detail.service.price?.toLocaleString()} đ = ${(
              (detail.new_value - detail.old_value) *
              detail.service.price
            ).toLocaleString()} đ`}
          </Text>
        </View>
      )}
    </Surface>
  );

  return (
    <SafeAreaView style={styles.container}>
      <CustomHeader
        title="Create new invoice"
        onBackPress={() => navigation.goBack()}
      />

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        <Card style={styles.formCard}>
          <Card.Content style={styles.cardContent}>
            <TouchableOpacity
              onPress={() => setShowDatePicker(true)}
              style={styles.datePickerButton}
            >
              <TextInput
                mode="outlined"
                label="Payment Deadline"
                value={dayjs(formData.payment_deadline).format("DD/MM/YYYY")}
                editable={false}
                right={<TextInput.Icon icon="calendar" />}
                outlineStyle={styles.inputOutline}
              />
            </TouchableOpacity>

            {showDatePicker && (
              <DateTimePicker
                value={formData.payment_deadline}
                mode="date"
                display="default"
                onChange={(event, selectedDate) => {
                  setShowDatePicker(false);
                  if (selectedDate) {
                    setFormData((prev) => ({
                      ...prev,
                      payment_deadline: selectedDate,
                    }));
                  }
                }}
              />
            )}

            <View style={styles.pickerContainer}>
              <Text style={styles.pickerLabel}>Status</Text>
              <View style={styles.pickerWrapper}>
                <Picker
                  selectedValue={formData.status}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, status: value }))
                  }
                  style={styles.picker}
                >
                  <Picker.Item label="Unpaid" value="UNPAID" />
                  <Picker.Item label="Paid" value="PAID" />
                </Picker>
              </View>
            </View>

            <TextInput
              mode="outlined"
              label="Total Amount"
              value={`${formData.total.toLocaleString()} đ`}
              editable={false}
              right={<TextInput.Icon icon="currency-usd" />}
              style={styles.totalInput}
              outlineStyle={styles.inputOutline}
            />
          </Card.Content>
        </Card>

        <Card style={styles.servicesCard}>
          <Card.Title title="Service Details" titleStyle={styles.cardTitle} />
          <Card.Content style={styles.servicesList}>
            {serviceDetails.map((detail, index) => (
              <ServiceDetailItem
                key={detail.service_id}
                detail={detail}
                index={index}
              />
            ))}
          </Card.Content>
        </Card>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.button, styles.cancelButton]}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.createButton]}
          onPress={handleCreateInvoice}
        >
          <Text style={styles.buttonText}>Create Invoice</Text>
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
  scrollView: {
    flex: 1,
  },
  formCard: {
    margin: 16,
    borderRadius: 12,
    elevation: 2,
    backgroundColor: color.white,
  },
  cardContent: {
    padding: 16,
  },
  servicesCard: {
    margin: 16,
    borderRadius: 12,
    elevation: 2,
    backgroundColor: color.white,
  },
  cardTitle: {
    fontSize: 18,
    fontFamily: theme.fonts.bold,
    color: color.blue,
  },
  servicesList: {
    padding: 8,
  },
  serviceCard: {
    padding: 16,
    marginBottom: 12,
    borderRadius: 12,
    elevation: 1,
    backgroundColor: color.white,
    borderWidth: 1,
    borderColor: "#eee",
  },
  serviceHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  serviceInfo: {
    flex: 1,
  },
  serviceName: {
    fontSize: 16,
    fontFamily: theme.fonts.bold,
    color: "#333",
    marginBottom: 4,
  },
  servicePrice: {
    fontSize: 14,
    color: color.blue,
    fontFamily: theme.fonts.bold,
  },
  meterInputContainer: {
    flexDirection: "row",
    gap: 12,
    marginTop: 8,
  },
  inputWrapper: {
    flex: 1,
  },
  input: {
    backgroundColor: color.white,
  },
  inputOutline: {
    borderRadius: 8,
  },
  subtotalContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  subtotalLabel: {
    fontSize: 14,
    color: "#666",
    fontFamily: theme.fonts.bold,
  },
  subtotalValue: {
    fontSize: 14,
    color: color.blue,
    fontFamily: theme.fonts.bold,
  },
  datePickerButton: {
    marginBottom: 16,
  },
  pickerContainer: {
    marginVertical: 16,
  },
  pickerLabel: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
    fontFamily: theme.fonts.bold,
  },
  pickerWrapper: {
    backgroundColor: "#f8f8f8",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
    overflow: "hidden",
  },
  picker: {
    height: 50,
  },
  totalInput: {
    backgroundColor: color.white,
    marginTop: 8,
  },
  footer: {
    flexDirection: "row",
    padding: 16,
    backgroundColor: color.white,
    elevation: 8,
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
  cancelButtonText: {
    fontSize: 16,
    fontFamily: theme.fonts.bold,
    color: color.gray,
  },
  createButton: {
    backgroundColor: color.blue,
  },
  buttonText: {
    fontSize: 16,
    fontFamily: theme.fonts.bold,
    color: color.white,
  },
});

export default CreateInvoiceForm;
