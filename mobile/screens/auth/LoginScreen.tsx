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
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../../services/AuthContext";
import ErrorModal from "../../components/modal/ErrorModal";
import LoadingModal from "../../components/modal/LoadingModal";
import { ILogIn } from "../../utils/type";
import theme from "../../assets/theme/theme";
import color from "../../assets/theme/colors";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "../../navigation/RootStackParamList";

const LoginScreen = () => {
  const { handleLogin } = useAuth();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [errorTitleMessage, setErrorTitleMessage] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const onLogin = async () => {
    setLoading(true);
    const loginData: ILogIn = {
      username: username,
      password: password,
    };
    try {
      await handleLogin(loginData);
      setLoading(false);
    } catch (error) {
      setErrorTitleMessage("Login failed");
      setErrorMessage("Account not found!");
      setLoading(false);
      setModalVisible(true);
      console.log("Error", error);
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
              <Text style={styles.title}>Login</Text>
            </View>

            <Text style={styles.subtitle}>Log in to continue</Text>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>
                Username<Text style={styles.required}> *</Text>
              </Text>
              <TextInput
                style={styles.input}
                placeholder="Enter username"
                value={username}
                onChangeText={setUsername}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>
                Password<Text style={styles.required}> *</Text>
              </Text>
              <View style={styles.passwordContainer}>
                <TextInput
                  style={styles.passwordInput}
                  placeholder="Enter password"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                />
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                >
                  <MaterialIcons
                    name={showPassword ? "visibility" : "visibility-off"}
                    size={24}
                    color="gray"
                  />
                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity
              onPress={() => navigation.navigate("ForgetPassword", {})}
            >
              <Text style={styles.forgotPassword}>Forgot password?</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.loginButton,
                {
                  backgroundColor:
                    username && password ? color.blue : "#87CEFA",
                },
              ]}
              onPress={onLogin}
              disabled={!username || !password}
            >
              <Text style={styles.loginButtonText}>LOG IN</Text>
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
    fontSize: 40,
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

export default LoginScreen;
