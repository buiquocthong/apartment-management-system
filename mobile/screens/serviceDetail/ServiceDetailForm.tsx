import React, { useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import { Checkbox, Button, IconButton } from "react-native-paper";
import apartmentApi from "../../services/apartmentApi";
import { useAuth } from "../../services/AuthContext";
import serviceApi from "../../services/serviceApi";
import serviceDetailApi from "../../services/serviceDetailApi";
import {
  NavigationProp,
  RouteProp,
  useNavigation,
  useRoute,
} from "@react-navigation/native";
import { RootStackParamList } from "../../navigation/RootStackParamList";
import { SafeAreaView } from "react-native-safe-area-context";
import CustomHeader from "../../components/CustomHeader";
import theme from "../../assets/theme/theme";
import color from "../../assets/theme/colors";

interface Service {
  service_id: string;
  name: string;
  price: number;
  unit: string;
  metered_service: boolean;
}

interface ServiceDetail {
  service_id: string;
  service?: Service;
  old_value: number;
  new_value: number;
  service_detail_id?: string;
  amount_of_using: number;
}

const ServiceDetailForm = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const route = useRoute<RouteProp<RootStackParamList, "ServiceDetailForm">>();
  const { apartmentId } = route.params;
  const { token, handleLogout } = useAuth();
  const [apartment, setApartment] = useState<any>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [selectedServices, setSelectedServices] = useState<Set<string>>(
    new Set()
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serviceDetails, setServiceDetails] = useState<ServiceDetail[]>([]);

  useEffect(() => {
    if (apartmentId) {
      const fetchApartmentData = async () => {
        if (!token) {
          return;
        }
        try {
          const api = apartmentApi(token, handleLogout);
          const apartmentData = await api.getApartmentById(apartmentId);
          setApartment(apartmentData);

          if (apartmentData?.service_details) {
            const selectedServiceIds = new Set<string>(
              apartmentData.service_details.map(
                (detail: any) => detail.service.service_id as string
              )
            );
            setSelectedServices(selectedServiceIds);

            const initialServiceDetails = apartmentData.service_details.map(
              (detail: any) => ({
                service_id: detail.service.service_id,
                service: detail.service,
                amount_of_using: detail.amount_of_using,
                old_value: detail.old_value,
                new_value: detail.new_value,
                service_detail_id: detail.service_detail_id,
              })
            );
            setServiceDetails(initialServiceDetails);
          }
        } catch (error) {}
      };

      const fetchAllServices = async () => {
        if (!token) {
          return;
        }
        try {
          const api = serviceApi(token, handleLogout);
          const allServices = await api.getAllServices();
          setServices(allServices);
        } catch (error) {}
      };

      fetchApartmentData();
      fetchAllServices();
    }
  }, [apartmentId]);

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      if (!token) {
        return;
      }
      const api = serviceDetailApi(token, handleLogout);

      const operations = [];

      if (apartment?.service_details) {
        for (const currentDetail of apartment.service_details) {
          if (
            !serviceDetails.some(
              (detail) => detail.service_id === currentDetail.service.service_id
            )
          ) {
            operations.push(
              api.deleteServiceDetail(currentDetail.service_detail_id)
            );
          }
        }
      }

      for (const newDetail of serviceDetails) {
        const currentDetail = apartment?.service_details?.find(
          (d: any) => d.service.service_id === newDetail.service_id
        );

        if (currentDetail) {
          if (
            currentDetail.old_value !== newDetail.old_value ||
            currentDetail.new_value !== newDetail.new_value
          ) {
            operations.push(
              api.updateServiceDetail(currentDetail.service_detail_id, {
                service_detail_id: currentDetail.service_detail_id,
                new_value: newDetail.new_value,
                old_value: newDetail.old_value,
                amount_of_using: newDetail.amount_of_using,
              })
            );
          }
        } else {
          operations.push(
            api.createServiceDetail({
              new_value: newDetail.new_value,
              old_value: newDetail.old_value,
              apartment_id: apartmentId,
              service_id: newDetail.service_id,
              amount_of_using: newDetail.amount_of_using,
            })
          );
        }
      }

      await Promise.all(operations);
      Alert.alert("Success", "Service detail added successfully", [
        { text: "OK", onPress: () => navigation.goBack() },
      ]);
    } catch (error) {
    } finally {
      setIsSubmitting(false);
    }
  };

  const calculateTotal = (
    serviceDetails: ServiceDetail[],
    services: Service[]
  ) => {
    return useMemo(() => {
      return serviceDetails.reduce((total, detail) => {
        if (
          !detail ||
          typeof detail.old_value !== "number" ||
          typeof detail.new_value !== "number"
        ) {
          return total;
        }

        const service = services.find(
          (s) => s.service_id === detail.service_id
        );
        if (!service) return total;

        if (service.metered_service) {
          const amountOfUsing = detail.new_value - detail.old_value;
          return total + amountOfUsing * service.price;
        } else {
          if (detail.amount_of_using) {
            return total + service.price * detail.amount_of_using;
          }
        }

        return total;
      }, 0);
    }, [serviceDetails, services]);
  };

  const onCheckboxChange = (checked: boolean, service: Service) => {
    const newSelectedServices = new Set(selectedServices);
    let newServiceDetails = [...serviceDetails];

    if (checked) {
      newSelectedServices.add(service.service_id);
      const existingDetail = newServiceDetails.find(
        (detail) => detail.service_id === service.service_id
      );

      if (!existingDetail) {
        newServiceDetails.push({
          service_id: service.service_id,
          service: service,
          old_value: 0,
          new_value: 0,
          amount_of_using: 1,
        });
      }
    } else {
      newSelectedServices.delete(service.service_id);
      newServiceDetails = newServiceDetails.filter(
        (detail) => detail.service_id !== service.service_id
      );
    }

    setSelectedServices(newSelectedServices);
    setServiceDetails(newServiceDetails);
  };

  const handleValueChange = (
    serviceId: string,
    field: string,
    value: number
  ) => {
    const newServiceDetails = serviceDetails.map((detail) =>
      detail.service_id === serviceId
        ? { ...detail, [field]: value >= 0 ? value : 0 }
        : detail
    );
    setServiceDetails(newServiceDetails);
  };

  const handleAmountChange = (serviceId: string, amount: number) => {
    const newServiceDetails = serviceDetails.map((detail) =>
      detail.service_id === serviceId
        ? { ...detail, amount_of_using: amount >= 1 ? amount : 1 }
        : detail
    );
    setServiceDetails(newServiceDetails);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <CustomHeader
        title="Setup Service Details"
        onBackPress={() => navigation.goBack()}
      />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardView}
      >
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
        >
          <View style={styles.card}>
            {services.map((service) => {
              const isSelected = selectedServices.has(service.service_id);
              const serviceDetail = serviceDetails.find(
                (detail) => detail.service_id === service.service_id
              );

              return (
                <View key={service.service_id} style={styles.serviceItem}>
                  <View style={styles.serviceHeader}>
                    <Checkbox.Item
                      label={service.name}
                      status={isSelected ? "checked" : "unchecked"}
                      onPress={() => onCheckboxChange(!isSelected, service)}
                      labelStyle={styles.checkboxLabel}
                      style={styles.checkbox}
                      position="leading"
                    />
                    <Text style={styles.price}>
                      {service.price.toLocaleString()} đ / {service.unit}
                    </Text>
                  </View>

                  {isSelected && !service.metered_service && (
                    <View style={styles.inputContainer}>
                      <View style={styles.inputWrapper}>
                        <Text style={styles.label}>Amount of using value</Text>
                        <View style={styles.amountInput}>
                          <IconButton
                            icon="minus"
                            size={24}
                            onPress={() =>
                              handleAmountChange(
                                service.service_id,
                                (serviceDetail?.amount_of_using || 1) - 1
                              )
                            }
                          />
                          <TextInput
                            style={[styles.input, { flex: 1 }]}
                            value={(
                              serviceDetail?.amount_of_using || 1
                            ).toString()}
                            onChangeText={(text) =>
                              handleAmountChange(
                                service.service_id,
                                parseFloat(text) || 1
                              )
                            }
                            keyboardType="numeric"
                            placeholder="Enter Amount of using value"
                            placeholderTextColor="#999"
                          />
                          <IconButton
                            icon="plus"
                            size={24}
                            onPress={() =>
                              handleAmountChange(
                                service.service_id,
                                (serviceDetail?.amount_of_using || 1) + 1
                              )
                            }
                          />
                        </View>
                      </View>
                    </View>
                  )}

                  {isSelected && service.metered_service && (
                    <View style={styles.inputContainer}>
                      <View style={styles.inputWrapper}>
                        <Text style={styles.label}>Old Value</Text>
                        <TextInput
                          style={styles.input}
                          value={serviceDetail?.old_value?.toString()}
                          onChangeText={(text) =>
                            handleValueChange(
                              service.service_id,
                              "old_value",
                              parseFloat(text) || 0
                            )
                          }
                          keyboardType="numeric"
                          placeholder="Enter old value"
                          placeholderTextColor="#999"
                        />
                      </View>

                      <View style={styles.inputWrapper}>
                        <Text style={styles.label}>New Value</Text>
                        <TextInput
                          style={styles.input}
                          value={serviceDetail?.new_value?.toString()}
                          onChangeText={(text) =>
                            handleValueChange(
                              service.service_id,
                              "new_value",
                              parseFloat(text) || 0
                            )
                          }
                          keyboardType="numeric"
                          placeholder="Enter new value"
                          placeholderTextColor="#999"
                        />
                      </View>
                    </View>
                  )}
                  <View style={styles.divider} />
                </View>
              );
            })}
          </View>

          {/* <Text style={styles.totalScroll}>
            Total: {calculateTotal(serviceDetails).toLocaleString()} đ
          </Text> */}
        </ScrollView>

        <View style={styles.footer}>
          <View style={styles.totalContainer}>
            <Text style={styles.totalLabel}>Total Amount</Text>
            <Text style={styles.totalValue}>
              {calculateTotal(serviceDetails, services).toLocaleString()} đ
            </Text>
          </View>
          <View style={styles.buttonContainer}>
            <Button
              mode="outlined"
              onPress={() => navigation.goBack()}
              style={styles.cancelButton}
              labelStyle={styles.cancelButtonText}
            >
              Cancel
            </Button>
            <Button
              mode="contained"
              onPress={handleSubmit}
              loading={isSubmitting}
              style={styles.updateButton}
              labelStyle={styles.updateButtonText}
            >
              Update
            </Button>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },
  keyboardView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  scrollContent: {
    padding: 16,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  serviceItem: {
    marginBottom: 16,
  },
  serviceHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    // marginBottom: 8,
  },
  checkbox: {
    flex: 1,
    paddingVertical: 1,
  },
  checkboxLabel: {
    fontFamily: theme.fonts.medium,
    fontSize: 16,
  },
  price: {
    color: "#666",
    fontFamily: theme.fonts.semiBold,
    fontSize: 14,
    marginLeft: 8,
  },
  inputContainer: {
    marginLeft: 24,
    flexDirection: "row",
    gap: 16,
  },
  inputWrapper: {
    flex: 1,
  },
  label: {
    marginBottom: 6,
    fontFamily: theme.fonts.semiBold,
    color: "#444",
    fontSize: 14,
  },
  amountInput: {},
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    fontFamily: theme.fonts.regular,
    fontSize: 14,
    backgroundColor: "#fafafa",
  },
  divider: {
    height: 1,
    backgroundColor: "#eee",
    marginVertical: 16,
  },
  totalScroll: {
    fontSize: 18,
    fontFamily: theme.fonts.semiBold,
    color: "#333",
    textAlign: "right",
    marginBottom: 80, // Add space for fixed footer
  },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#eee",
    paddingHorizontal: 16,
    paddingVertical: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 8,
  },
  totalContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  totalLabel: {
    fontSize: 16,
    fontFamily: theme.fonts.medium,
    color: "#666",
  },
  totalValue: {
    fontSize: 18,
    fontFamily: theme.fonts.semiBold,
    color: color.black,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    borderColor: "#ddd",
    borderRadius: 8,
  },
  updateButton: {
    flex: 1,
    borderRadius: 8,
    backgroundColor: color.blue,
  },
  cancelButtonText: {
    fontFamily: theme.fonts.semiBold,
    fontSize: 16,
    color: color.black,
  },
  updateButtonText: {
    fontFamily: theme.fonts.semiBold,
    fontSize: 16,
    color: "#fff",
  },
});

export default ServiceDetailForm;
