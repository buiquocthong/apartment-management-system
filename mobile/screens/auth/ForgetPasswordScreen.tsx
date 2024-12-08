import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import ErrorModal from "../../components/modal/ErrorModal";
import LoadingModal from "../../components/modal/LoadingModal";
import theme from "../../assets/theme/theme";
import color from "../../assets/theme/colors";
import { forgetPassword } from "../../services/authApi";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "../../navigation/RootStackParamList";

const ForgetPasswordScreen = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [email, setEmail] = useState<string>("");
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [errorTitleMessage, setErrorTitleMessage] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const handleForgetPassword = async () => {
    if (!email) {
      Alert.alert("Error", "Please enter your email");
      return;
    }

    setLoading(true);

    try {
      const response = await forgetPassword(email);

      Alert.alert("Success", "Check your email for further instructions");
      setLoading(false);
      navigation.navigate("Login", {});
    } catch (error: any) {
      if (error.response && error.response.status === 404) {
        const errorMessage = error.response.data.error_desc;
        Alert.alert("Error", errorMessage);
      } else {
        Alert.alert("Error", "Failed to reset password. Please try again.");
      }
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.keyboardAvoiding}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          contentContainerStyle={styles.scrollView}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.loginBox}>
            <View style={styles.header}>
              <Text style={styles.nameApp}>AMS</Text>
              <Text style={styles.title}>Forget password?</Text>
            </View>

            <Text style={styles.subtitle}>
              Enter your email to retrieve your password
            </Text>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>
                Email<Text style={styles.required}> *</Text>
              </Text>
              <TextInput
                style={styles.input}
                placeholder="Enter email"
                value={email}
                onChangeText={setEmail}
              />
            </View>

            <TouchableOpacity
              style={[
                styles.loginButton,
                {
                  backgroundColor: email ? color.blue : "#87CEFA",
                },
              ]}
              onPress={handleForgetPassword}
              disabled={!email}
            >
              <Text style={styles.loginButtonText}>RECOVERY</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <LoadingModal visible={loading} />

      <ErrorModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        titleMessage={errorTitleMessage}
        message={errorMessage}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: color.blue,
  },
  keyboardAvoiding: {
    flex: 1,
    width: "100%",
  },
  scrollView: {
    flexGrow: 1,
    justifyContent: "flex-end",
  },
  loginBox: {
    height: "85%",
    width: "100%",
    backgroundColor: color.white,
    borderTopLeftRadius: 150,
    borderTopRightRadius: 400,
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 80,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  header: {
    marginBottom: 20,
  },
  nameApp: {
    fontSize: 40,
    color: color.blue,
    marginBottom: 10,
    fontFamily: theme.fonts.black,
  },
  title: {
    fontSize: 30,
    color: color.blue,
    marginBottom: 10,
    fontFamily: theme.fonts.bold,
  },
  subtitle: {
    fontSize: 18,
    fontFamily: theme.fonts.semiBold,
    marginBottom: 15,
  },
  inputContainer: {
    marginBottom: 15,
  },
  label: {
    marginBottom: 5,
    fontSize: 14,
    fontFamily: theme.fonts.semiBold,
    color: "#4B5563",
  },
  required: {
    fontFamily: theme.fonts.semiBold,
    color: "red",
  },
  input: {
    height: 45,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 10,
    paddingHorizontal: 10,
    fontFamily: theme.fonts.medium,
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 10,
    paddingHorizontal: 10,
  },
  passwordInput: {
    height: 45,
    flex: 1,
    fontFamily: theme.fonts.medium,
  },
  forgotPassword: {
    textAlign: "right",
    color: color.blue,
    fontSize: 14,
    marginBottom: 15,
    fontFamily: theme.fonts.medium,
  },
  loginButton: {
    paddingVertical: 12,
    borderRadius: 10,
    marginTop: 15,
  },
  loginButtonText: {
    color: "#FFFFFF",
    textAlign: "center",
    fontSize: 18,
    fontFamily: theme.fonts.bold,
  },
});

export default ForgetPasswordScreen;
