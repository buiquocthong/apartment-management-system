import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from "react-native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import color from "../../assets/theme/colors";
import { useAuth } from "../../services/AuthContext";
import accountApi from "../../services/accountApi";
import { IAccount } from "../../utils/type";
import theme from "../../assets/theme/theme";
import { SafeAreaView } from "react-native-safe-area-context";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "../../navigation/RootStackParamList";

const AccountScreen = () => {
  const { token, handleLogout } = useAuth();
  const [account, setAccount] = useState<IAccount>();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const getAccount = async () => {
    if (!token) {
      return;
    }
    const api = accountApi(token, handleLogout);
    setAccount(await api.getMyAccount());
  };
  getAccount();

  const handleEdit = () => {
    if (account) {
      navigation.navigate("EditAccountScreen", { account: account });
    }
  };

  const handleChangePassword = () => {
    if (account) {
      navigation.navigate("ChangePasswordScreen", { account: account });
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.userInfo}>
          <Image
            // source={require("./path_to_avatar.png")}
            style={styles.avatar}
          />
          <View>
            <Text style={styles.userName}>
              {account?.user_info.first} {account?.user_info.middle}{" "}
              {account?.user_info.last}{" "}
            </Text>
            <Text style={styles.userEmail}>{account?.user_info.email}</Text>
          </View>
        </View>
        <TouchableOpacity onPress={handleEdit}>
          <MaterialIcons name="edit" size={24} color={color.white} />
        </TouchableOpacity>
      </View>
      <ScrollView style={styles.container}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Management</Text>
          {renderOption("User Management", "people", handleLogout)}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Utilities</Text>
          {renderOption("Change Password", "lock", handleChangePassword)}
        </View>

        {/* Logout */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <MaterialIcons name="logout" size={24} color="red" />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const renderOption = (label: string, iconName: string, actions: any) => {
  return (
    <TouchableOpacity style={styles.option} onPress={actions}>
      <MaterialIcons name={iconName} size={24} color={color.blue} />
      <Text style={styles.optionText}>{label}</Text>
      <MaterialIcons name="chevron-right" size={24} color={color.blue} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // padding: 20,
    // paddingBottom: 40,
    margin: 15,
    backgroundColor: "#f5f5f5",
  },
  header: {
    backgroundColor: color.blue,
    padding: 20,
    paddingTop: 30,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  userName: {
    fontSize: 20,
    color: color.white,
    fontFamily: theme.fonts.bold,
  },
  userEmail: {
    fontSize: 16,
    color: color.white,
    fontFamily: theme.fonts.medium,
  },
  section: {
    backgroundColor: color.white,
    marginVertical: 10,
    paddingHorizontal: 10,
    paddingVertical: 15,
    borderRadius: 15,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: theme.fonts.bold,
    marginBottom: 10,
    color: color.blue,
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 10,
    borderBottomColor: "#ddd",
    borderBottomWidth: 1,
  },
  optionText: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
    fontFamily: theme.fonts.regular,
    color: color.gray,
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 10,
    padding: 15,
    backgroundColor: color.white,
    borderRadius: 10,
    alignSelf: "center",
    width: "90%",
  },
  logoutText: {
    color: "red",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 10,
  },
});

export default AccountScreen;
