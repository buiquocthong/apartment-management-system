import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { IContractRequest, IOwnerRequest } from "../../utils/type";
import { RootStackParamList } from "../../navigation/RootStackParamList";
import theme from "../../assets/theme/theme";
import color from "../../assets/theme/colors";
import { SafeAreaView } from "react-native-safe-area-context";
import CustomHeader from "../../components/CustomHeader";
import { DatePickerField } from "../../components/DatePickerField";
import { InputField } from "../../components/InputField";
import { SelectField } from "../../components/SelectField";

const CreateContractScreen: React.FC = () => {
  const route = useRoute<RouteProp<RootStackParamList, "CreateContractForm">>();
  const { apartment_id, onCreateContract } = route.params;
  const [startDate, setStartDate] = useState(new Date());
  const [status, setStatus] = useState("ACTIVE");

  const [owner, setOwner] = useState<IOwnerRequest>({
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

  const navigation = useNavigation();

  const handleCreateContract = () => {
    if (
      !owner.first_name ||
      !owner.last_name ||
      !owner.phone_number ||
      !owner.email
    ) {
      Alert.alert("Validation Error", "Please fill in all required fields.");
      return;
    }

    const contractRequest: IContractRequest = {
      start_date: startDate.toISOString(),
      status,
      apartment_id: apartment_id,
      owner,
    };
    onCreateContract(contractRequest);
    Alert.alert("Success", "Contract created successfully", [
      { text: "OK", onPress: () => navigation.goBack() },
    ]);
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <CustomHeader
        title={`Create contract`}
        onBackPress={() => navigation.goBack()}
      />
      <ScrollView
        style={styles.scrollContainer}
        contentContainerStyle={styles.content}
      >
        <View style={styles.infoContainer}>
          <DatePickerField
            label="Start date"
            value={startDate}
            onChange={setStartDate}
            required
          />
        </View>

        <View style={styles.infoContainer}>
          <SelectField
            label={"Status"}
            value={"ACTIVE"}
            onChange={(value: string) => {
              setStatus(value);
            }}
            options={[
              { label: "ACTIVE", value: "ACTIVE" },
              { label: "INACTIVE", value: "INACTIVE" },
            ]}
          />
        </View>

        <View style={styles.infoContainer}>
          <Text style={styles.label}>Owner Information</Text>

          <InputField
            label="First name"
            value={owner.first_name}
            onChange={(text) =>
              setOwner((prev) => ({ ...prev, first_name: text }))
            }
            placeholder="Enter first name"
            required
          />

          <InputField
            label="Middle name"
            value={owner.middle_name}
            onChange={(text) =>
              setOwner((prev) => ({ ...prev, middle_name: text }))
            }
            placeholder="Enter middle name"
            required
          />

          <InputField
            label="Last name"
            value={owner.last_name}
            onChange={(text) =>
              setOwner((prev) => ({ ...prev, last_name: text }))
            }
            placeholder="Enter last name"
            required
          />

          <DatePickerField
            label="Birthday"
            value={owner.birth_day}
            onChange={(date) =>
              setOwner((prev) => ({ ...prev, birth_day: date.toISOString() }))
            }
            maximumDate={new Date()}
            required
          />

          <SelectField
            label="Gender"
            value={owner.gender}
            onChange={(value) =>
              setOwner((prev) => ({
                ...prev,
                gender: value as "MALE" | "FEMALE" | "OTHER",
              }))
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
            value={owner.phone_number}
            onChange={(text) =>
              setOwner((prev) => ({ ...prev, phone_number: text }))
            }
            placeholder="Enter phone number"
            keyboardType="numeric"
            required
          />

          <InputField
            label="Email"
            value={owner.email}
            onChange={(text) => setOwner((prev) => ({ ...prev, email: text }))}
            placeholder="Enter email"
            keyboardType="email-address"
            required
          />

          <InputField
            label="ID card number"
            value={owner.id_card_number}
            onChange={(text) =>
              setOwner((prev) => ({ ...prev, id_card_number: text }))
            }
            placeholder="Enter ID number"
            keyboardType="numeric"
            required
          />

          <Text style={styles.label}>Career:</Text>
          <TextInput
            style={styles.input}
            value={owner.career}
            onChangeText={(text) => setOwner({ ...owner, career: text })}
            placeholder="Enter career"
          />
        </View>
        {/* Location Fields */}
        <View style={styles.infoContainer}>
          <Text style={styles.label}>Address</Text>
          <InputField
            label="Province"
            value={owner.city}
            onChange={(text) => setOwner({ ...owner, city: text })}
            placeholder="Enter province"
            required
          />

          <InputField
            label="District"
            value={owner.district}
            onChange={(text) => setOwner({ ...owner, district: text })}
            placeholder="Enter district"
            required
          />

          <InputField
            label="Ward"
            value={owner.ward}
            onChange={(text) => setOwner({ ...owner, ward: text })}
            placeholder="Enter ward"
            required
          />
          <InputField
            label="Street Address"
            value={owner.street}
            onChange={(text) => setOwner({ ...owner, street: text })}
            placeholder="Enter street address"
            required
          />
        </View>
      </ScrollView>
      <TouchableOpacity style={styles.button} onPress={handleCreateContract}>
        <Text style={styles.buttonText}>Create Contract</Text>
      </TouchableOpacity>
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
});

export default CreateContractScreen;
