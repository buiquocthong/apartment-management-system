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
import accountApi from "../../services/accountApi";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { RootStackParamList } from "../../navigation/RootStackParamList";
import LoadingModal from "../../components/modal/LoadingModal";
import { SafeAreaView } from "react-native-safe-area-context";
import CustomHeader from "../../components/CustomHeader";
import color from "../../assets/theme/colors";
import theme from "../../assets/theme/theme";
import { useAuth } from "../../services/AuthContext";
import { IChangePassword } from "../../utils/type";

const ChangePasswordScreen = () => {
  const route = useRoute<RouteProp<RootStackParamList, "ChangePasswordForm">>();
  const { account } = route.params;
  const navigation = useNavigation();
  const { token, handleLogout } = useAuth();
  const [old_password, setOldPassword] = useState("");
  const [new_password, setNewPassword] = useState("");
  const [confirm_password, setConfirmPassword] = useState("");

  const [isLoading, setIsLoading] = useState(false);

  const renderLabel = (text: string) => (
    <Text style={styles.label}>
      {text}
      <Text style={styles.required}> *</Text>
    </Text>
  );

  const handleChangePassword = async () => {
    setIsLoading(true);

    try {
      if (!token) {
        return;
      }

      if (new_password !== confirm_password) {
        Alert.alert("Error", "New password and confirm password do not match.");
        return;
      }

      const changePassword: IChangePassword = {
        user_id: account.user_id,
        old_password: old_password,
        new_password: new_password,
        confirm_password: confirm_password,
      };

      await accountApi(token, handleLogout).changePassword(changePassword);
      Alert.alert("Success", "Account updated successfully", [
        {
          text: "OK",
          onPress: () => navigation.goBack(),
        },
      ]);
    } catch (error) {
      Alert.alert("Error", "Failed to update account");
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
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
              title="Change password"
              onBackPress={() => navigation.goBack()}
            />
            <ScrollView
              style={styles.form}
              showsVerticalScrollIndicator={false}
            >
              {renderLabel("Current password")}
              <TextInput
                style={styles.input}
                placeholder="Enter current password"
                onChangeText={setOldPassword}
              />

              {renderLabel("New password")}
              <TextInput
                style={styles.input}
                placeholder="Enter new password"
                onChangeText={setNewPassword}
              />

              {renderLabel("Confirm new password")}
              <TextInput
                style={styles.input}
                placeholder="Enter confirm password"
                onChangeText={setConfirmPassword}
              />
            </ScrollView>

            <TouchableOpacity
              style={styles.button}
              onPress={handleChangePassword}
              disabled={!old_password || !new_password || !confirm_password}
            >
              <Text style={styles.buttonText}>CHANGE PASSWORD</Text>
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

export default ChangePasswordScreen;
