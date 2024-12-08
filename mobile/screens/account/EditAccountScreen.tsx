import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import accountApi from "../../services/accountApi"; // API để update thông tin
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { RootStackParamList } from "../../navigation/RootStackParamList";
import LoadingModal from "../../components/modal/LoadingModal";
import { SafeAreaView } from "react-native-safe-area-context";
import CustomHeader from "../../components/CustomHeader";
import color from "../../assets/theme/colors";
import theme from "../../assets/theme/theme";
import { useAuth } from "../../services/AuthContext";

const EditAccountScreen = () => {
  const route = useRoute<RouteProp<RootStackParamList, "UpdateAccountForm">>();
  const { account } = route.params;
  const navigation = useNavigation();
  const { token, handleLogout } = useAuth();
  const [username, setUsername] = useState(account.username);
  const [status, setStatus] = useState(account.status);
  const [firstName, setFirstName] = useState(account.user_info.first);
  const [middleName, setMiddleName] = useState(account.user_info.middle);
  const [lastName, setLastName] = useState(account.user_info.last);
  const [email, setEmail] = useState(account.user_info.email);
  const [phone, setPhone] = useState(account.user_info.phone || "");
  const [country, setCountry] = useState(account.user_info.country);
  const [prefix, setPrefix] = useState(account.user_info.prefix || "");

  const [isLoading, setIsLoading] = useState(false);

  const renderLabel = (text: string) => (
    <Text style={styles.label}>
      {text}
      <Text style={styles.required}> *</Text>
    </Text>
  );

  const handleSave = async () => {
    setIsLoading(true);
    const updatedAccount = {
      username,
      status,
      user_info: {
        first: firstName,
        middle: middleName,
        last: lastName,
        email,
        phone,
        prefix,
        country,
      },
    };

    try {
      if (!token) {
        return;
      }
      await accountApi(token, handleLogout).updateAccount(
        account.user_id,
        updatedAccount
      );
      Alert.alert("Success", "Account updated successfully", [
        {
          text: "OK",
          onPress: () => navigation.goBack(),
        },
      ]);
    } catch (error) {
      Alert.alert("Error", "Failed to update account");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {isLoading ? (
        <LoadingModal visible={true} />
      ) : (
        <>
          <SafeAreaView style={styles.container}>
            <CustomHeader
              title="Account Information"
              onBackPress={() => navigation.goBack()}
            />
            <ScrollView
              style={styles.form}
              showsVerticalScrollIndicator={false}
            >
              {renderLabel("Username")}
              <TextInput
                style={styles.input}
                placeholder="Enter username"
                value={username}
                onChangeText={setUsername}
              />

              {renderLabel("Status")}
              <TextInput
                style={styles.input}
                placeholder="Enter status"
                value={status}
                editable={false}
              />

              {renderLabel("Role")}
              <TextInput
                style={styles.input}
                value={account.role.label}
                editable={false}
              />

              {renderLabel("First Name")}
              <TextInput
                style={styles.input}
                placeholder="Enter first name"
                value={firstName}
                onChangeText={setFirstName}
              />

              {renderLabel("Middle Name")}
              <TextInput
                style={styles.input}
                placeholder="Enter middle name"
                value={middleName}
                onChangeText={setMiddleName}
              />

              {renderLabel("Last Name")}
              <TextInput
                style={styles.input}
                placeholder="Enter last name"
                value={lastName}
                onChangeText={setLastName}
              />

              {renderLabel("Email")}
              <TextInput
                style={styles.input}
                placeholder="Enter email"
                keyboardType="email-address"
                value={email}
                onChangeText={setEmail}
              />

              {renderLabel("Phone Number")}
              <TextInput
                style={styles.input}
                placeholder="Enter phone number"
                keyboardType="phone-pad"
                value={phone}
                onChangeText={setPhone}
              />

              {renderLabel("Country")}
              <TextInput
                style={styles.input}
                placeholder="Enter country"
                value={country}
                onChangeText={setCountry}
              />
            </ScrollView>

            <TouchableOpacity style={styles.button} onPress={handleSave}>
              <Text style={styles.buttonText}>SAVE</Text>
            </TouchableOpacity>
          </SafeAreaView>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: color.white,
  },
  form: {
    borderRadius: 10,
    flex: 1,
    margin: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    fontFamily: theme.fonts.bold,
  },
  required: {
    color: "red",
    fontFamily: theme.fonts.bold,
  },
  input: {
    height: 50,
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 15,
    paddingHorizontal: 15,
    backgroundColor: "#f9f9f9",
    fontFamily: theme.fonts.regular,
  },
  button: {
    margin: 15,
    backgroundColor: color.blue,
    paddingVertical: 15,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    color: color.white,
    fontSize: 16,
    fontFamily: theme.fonts.bold,
  },
});

export default EditAccountScreen;
