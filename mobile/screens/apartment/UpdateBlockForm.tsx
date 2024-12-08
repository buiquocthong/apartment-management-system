import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import blockApi from "../../services/blockApi";
import { useAuth } from "../../services/AuthContext";
import { RootStackParamList } from "../../navigation/RootStackParamList";
import CustomHeader from "../../components/CustomHeader";
import theme from "../../assets/theme/theme";
import color from "../../assets/theme/colors";
import { SafeAreaView } from "react-native-safe-area-context";
import { InputField } from "../../components/InputField";

type FormData = {
  block_id: string;
  name: string;
  description: string;
  total_floor: number;
  total_apartment: number;
};

const UpdateBlockForm = () => {
  const route = useRoute<RouteProp<RootStackParamList, "UpdateBlockForm">>();
  const { block_id } = route.params;
  const { token, handleLogout } = useAuth();
  const navigation = useNavigation();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormData>({
    block_id,
    name: "",
    description: "",
    total_floor: 0,
    total_apartment: 0,
  });

  const fetchBlock = async () => {
    if (!token) {
      setError("No authentication token found");
      return;
    }

    try {
      setLoading(true);
      const api = blockApi(token, handleLogout);
      const response = await api.getBlockById(block_id);
      setFormData({
        block_id: response.block_id,
        name: response.name,
        description: response.description,
        total_floor: response.total_floor,
        total_apartment: response.total_apartment,
      });
    } catch (err) {
      setError("Error fetching block data");
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
      const api = blockApi(token, handleLogout);
      await api.updateBlock(block_id, formData);
      navigation.goBack();
    } catch (err) {
      setError("Error while saving the block");
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const updateFormField = (field: keyof FormData, value: string | number) => {
    setFormData((prev) => ({
      ...prev,
      [field]:
        field === "total_floor" || field === "total_apartment"
          ? parseInt(value.toString()) || 0
          : value,
    }));
  };

  useEffect(() => {
    fetchBlock();
  }, []);

  if (loading && !formData.name) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={color.blue} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <CustomHeader title="Update Block" onBackPress={navigation.goBack} />

      <ScrollView
        style={styles.formContainer}
        showsVerticalScrollIndicator={false}
      >
        {error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        <Text style={styles.sectionTitle}>Block Information</Text>

        <View style={styles.formFields}>
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
          />

          <View style={styles.row}>
            <View style={styles.halfWidth}>
              <InputField
                label="Total Floors"
                value={formData.total_floor.toString()}
                onChange={(text) => updateFormField("total_floor", text)}
                placeholder="Enter number"
                required
                keyboardType="numeric"
              />
            </View>

            <View style={styles.halfWidth}>
              <InputField
                label="Total Apartments"
                value={formData.total_apartment.toString()}
                onChange={(text) => updateFormField("total_apartment", text)}
                placeholder="Enter number"
                required
                keyboardType="numeric"
              />
            </View>
          </View>
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
            !formData.name && styles.disabledButton,
          ]}
          onPress={handleSubmit}
          disabled={!formData.name || loading}
        >
          {loading ? (
            <ActivityIndicator size="small" color={color.white} />
          ) : (
            <Text style={styles.buttonText}>Update Block</Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
  },
  formContainer: {
    flex: 1,
    padding: 16,
  },
  formFields: {
    gap: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: theme.fonts.bold,
    color: color.black,
    marginBottom: 20,
  },
  row: {
    flexDirection: "row",
    gap: 12,
  },
  halfWidth: {
    flex: 1,
  },
  errorContainer: {
    backgroundColor: "#ffebee",
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  errorText: {
    color: "#c62828",
    fontFamily: theme.fonts.medium,
    fontSize: 14,
  },
  footer: {
    flexDirection: "row",
    padding: 16,
    gap: 12,
    backgroundColor: "white",
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  button: {
    flex: 1,
    height: 48,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
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
  },
  cancelButtonText: {
    color: color.gray,
  },
  updateButton: {
    backgroundColor: color.blue,
  },
  disabledButton: {
    backgroundColor: color.gray,
    opacity: 0.5,
  },
});

export default UpdateBlockForm;
