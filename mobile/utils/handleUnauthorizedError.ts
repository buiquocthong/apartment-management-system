import { Alert } from "react-native";

const handleUnauthorizedError = async (error: any, handleLogout: () => void) => {
  if (error.response?.status === 401) {
    Alert.alert("Login session expired, Logging out");
    try {
      await handleLogout();
    } catch (err) {
      console.log("Error during logout", err);
    }
  }
};

export default handleUnauthorizedError;
