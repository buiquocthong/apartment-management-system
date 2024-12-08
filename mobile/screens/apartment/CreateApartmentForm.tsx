import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Switch,
  Alert,
} from "react-native";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import apartmentApi from "../../services/apartmentApi";
import blockApi from "../../services/blockApi";
import { useAuth } from "../../services/AuthContext";
import { RootStackParamList } from "../../navigation/RootStackParamList";
import CustomHeader from "../../components/CustomHeader";
import theme from "../../assets/theme/theme";
import color from "../../assets/theme/colors";
import FloorSelector from "../../components/FloorSelector";
import { IApartmentRequest, IFloor } from "../../utils/type";
import { SafeAreaView } from "react-native-safe-area-context";
import { renderLabel } from "../../components/RenderLabel";
import { formatPrice } from "../../utils/formatPrice";
import { formatNumber } from "../../utils/formatNumber";
import { InputField } from "../../components/InputField";

const CreateApartmentForm = () => {
  const route =
    useRoute<RouteProp<RootStackParamList, "CreateApartmentForm">>();
  const navigation = useNavigation();
  const { token, handleLogout } = useAuth();
  const { block_id } = route.params;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [floors, setFloors] = useState<IFloor[]>([]);
  const [selectedFloor, setSelectedFloor] = useState<string>("");

  const [formData, setFormData] = useState<IApartmentRequest>({
    furnished: true,
    number_of_bedroom: 0,
    number_of_bathroom: 0,
    area: 0,
    name: "",
    status: "AVAILABLE",
    floor_id: "",
    sale_info: {
      purchase_price: 0,
    },
  });

  useEffect(() => {
    const fetchFloors = async () => {
      try {
        if (block_id && token) {
          const api = blockApi(token, handleLogout);
          const block = await api.getBlockById(block_id);
          setFloors(block.floor);
        }
      } catch (err) {
        setError("Error fetching floors");
      }
    };
    fetchFloors();
  }, [block_id, token]);

  const validateForm = () => {
    if (
      formData.sale_info.purchase_price <= 0 ||
      formData.area <= 0 ||
      formData.number_of_bathroom <= 0 ||
      formData.number_of_bedroom <= 0
    ) {
      Alert.alert("Error", "All numeric values must be greater than 0");
      return false;
    }
    return true;
  };

  const handleSubmit = async (): Promise<void> => {
    if (!validateForm()) return;

    setLoading(true);
    setError(null);

    try {
      if (!token) {
        throw new Error("No authentication token found");
      }

      const api = apartmentApi(token, handleLogout);
      await api.createApartment(formData);
      Alert.alert("Success", "Apartment added successfully", [
        { text: "OK", onPress: () => navigation.goBack() },
      ]);
    } catch (err) {
      console.log(err);
      setError("Error while saving the apartment");
      Alert.alert("Error", "Failed to create apartment");
    } finally {
      setLoading(false);
    }
  };

  const updateFormField = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const updateSaleInfo = (value: number) => {
    setFormData((prev) => ({
      ...prev,
      sale_info: {
        ...prev.sale_info,
        purchase_price: value,
      },
    }));
  };

  const handleSelectFloor = (floor: IFloor) => {
    setSelectedFloor(floor.floor_id);
    updateFormField("floor_id", floor.floor_id);
  };

  const isFormValid =
    formData.area &&
    formData.floor_id &&
    formData.name &&
    formData.number_of_bathroom > 0 &&
    formData.number_of_bedroom > 0;

  return (
    <SafeAreaView style={styles.container}>
      <CustomHeader
        title="Add New Apartment"
        onBackPress={() => navigation.goBack()}
      />

      <ScrollView
        style={styles.formContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Apartment Information</Text>

          <InputField
            label="Apartment Name"
            value={formData.name}
            onChange={(text) => updateFormField("name", text)}
            placeholder="Enter apartment name"
            required
          />

          <View style={styles.inputContainer}>
            {renderLabel({ label: "Floor", required: true })}
            <FloorSelector
              floors={floors}
              selectedFloor={selectedFloor}
              onSelectFloor={handleSelectFloor}
            />
          </View>

          <InputField
            label="Area (m²)"
            value={formData.area.toString()}
            onChange={(text) => updateFormField("area", formatNumber(text))}
            placeholder="Enter area"
            required
            keyboardType="numeric"
          />

          <View style={styles.rowContainer}>
            <View style={styles.halfWidth}>
              <InputField
                label="Bedrooms"
                value={formData.number_of_bedroom.toString()}
                onChange={(text) =>
                  updateFormField("number_of_bedroom", formatNumber(text))
                }
                placeholder="Enter number"
                required
                keyboardType="numeric"
              />
            </View>

            <View style={styles.halfWidth}>
              <InputField
                label="Bathrooms"
                value={formData.number_of_bathroom.toString()}
                onChange={(text) =>
                  updateFormField("number_of_bathroom", formatNumber(text))
                }
                placeholder="Enter number"
                required
                keyboardType="numeric"
              />
            </View>
          </View>

          <View style={styles.switchContainer}>
            {renderLabel({ label: "Furnished", required: true })}
            <Text style={styles.fieldDescription}>
              Toggle on if the apartment includes furniture
            </Text>
            <Switch
              value={formData.furnished}
              onValueChange={(value) => updateFormField("furnished", value)}
              trackColor={{ false: color.gray, true: color.blue }}
              thumbColor={formData.furnished ? color.white : color.lightGray}
              ios_backgroundColor={color.gray}
              style={styles.switch}
            />
          </View>
        </View>

        <View style={[styles.card, styles.saleCard]}>
          <Text style={styles.sectionTitle}>Sale Information</Text>
          <InputField
            label="Purchase Price"
            value={formatPrice(formData.sale_info.purchase_price)}
            onChange={(text) => updateSaleInfo(formatNumber(text))}
            placeholder="Enter price"
            required
            keyboardType="numeric"
          />
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.button, styles.cancelButton]}
          onPress={() => navigation.goBack()}
        >
          <Text style={[styles.buttonText, styles.cancelButtonText]}>
            Cancel
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.button,
            styles.submitButton,
            !isFormValid && styles.disabledButton,
          ]}
          onPress={handleSubmit}
          disabled={!isFormValid || loading}
        >
          <Text style={styles.buttonText}>
            {loading ? "Adding..." : "Add Apartment"}
          </Text>
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
  formContainer: {
    padding: 16,
  },
  card: {
    backgroundColor: color.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  saleCard: {
    borderColor: color.blue,
    borderWidth: 1,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: theme.fonts.bold,
    color: color.black,
    marginBottom: 20,
  },
  inputContainer: {
    marginBottom: 20,
  },
  rowContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  halfWidth: {
    width: "48%",
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
  footer: {
    flexDirection: "row",
    padding: 16,
    backgroundColor: color.white,
    borderTopWidth: 1,
    borderTopColor: color.lightGray,
  },
  button: {
    flex: 1,
    padding: 16,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  submitButton: {
    backgroundColor: color.blue,
    marginLeft: 8,
  },
  cancelButton: {
    backgroundColor: color.white,
    borderWidth: 1,
    borderColor: color.gray,
    marginRight: 8,
  },
  disabledButton: {
    backgroundColor: color.lightGray,
    opacity: 0.7,
  },
  buttonText: {
    fontSize: 16,
    fontFamily: theme.fonts.bold,
    color: color.white,
  },
  cancelButtonText: {
    color: color.gray,
  },
});

export default CreateApartmentForm;
