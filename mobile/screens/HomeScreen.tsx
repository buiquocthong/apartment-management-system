import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import theme from "../assets/theme/theme";
import color from "../assets/theme/colors";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import Ionicons from "react-native-vector-icons/Ionicons";
import accountApi from "../services/accountApi";
import mailApi from "../services/mailApi"; // Add this import
import { useAuth } from "../services/AuthContext";
import { IAccount } from "../utils/type";
import { SafeAreaView } from "react-native-safe-area-context";
import { RootStackParamList } from "../navigation/RootStackParamList";

const HomeScreen = () => {
  const { token, handleLogout } = useAuth();
  const [account, setAccount] = useState<IAccount>();
  const [notifications, setNotifications] = useState<number>(0);

  const getUsername = async () => {
    if (!token) {
      return;
    }
    const api = accountApi(token, handleLogout);
    setAccount(await api.getMyAccount());
  };

  const fetchNotifications = async () => {
    if (!token) {
      return;
    }
    try {
      const api = mailApi(token, handleLogout);
      const mailList = await api.getAllMails();

      // Count notifications with status that might need attention
      const unreadNotifications = mailList.filter(
        (notification: any) =>
          notification.status === "SCHEDULED" ||
          notification.status === "FAILED"
      ).length;

      setNotifications(unreadNotifications);
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
      setNotifications(0);
    }
  };

  useEffect(() => {
    getUsername();
    fetchNotifications();

    // Optional: Set up interval to periodically check notifications
    const notificationInterval = setInterval(fetchNotifications, 60000); // Check every minute

    return () => clearInterval(notificationInterval);
  }, [token]);

  const getGreeting = () => {
    const currentHour = new Date().getHours();
    if (currentHour < 12) {
      return "Good Morning";
    } else if (currentHour < 18) {
      return "Good Afternoon";
    } else {
      return "Good Evening";
    }
  };

  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const handleCardPress = (id: number) => {
    switch (id) {
      case 1:
        navigation.navigate("Block", {});
        break;
      case 2:
        navigation.navigate("Invoice", {});
        break;
      case 3:
        navigation.navigate("Service", {});
        break;
      case 4:
        navigation.navigate("Contract", {});
        break;
      case 5:
        navigation.navigate("Resident", {});
        break;
      default:
        console.log("No screen");
        break;
    }
  };

  const handleNotificationPress = () => {
    navigation.navigate("NotificationScreen", {});
    // Optional: Reset notification count when viewed
    setNotifications(0);
  };

  const managements = [
    { id: 1, title: "Block Management", icon: "apartment" },
    { id: 2, title: "Invoice Management", icon: "receipt" },
    { id: 3, title: "Service Management", icon: "build" },
    { id: 4, title: "Contract Management", icon: "description" },
    { id: 5, title: "Resident Management", icon: "people" },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View>
            <Text style={styles.greeting}>{getGreeting()},</Text>
            <Text style={styles.title}>{account?.user_info.first}</Text>
          </View>
          <TouchableOpacity
            style={styles.notificationContainer}
            onPress={handleNotificationPress}
          >
            <View style={styles.notificationIconWrapper}>
              <Ionicons name="notifications-outline" size={28} color="#fff" />
              {notifications > 0 && (
                <View style={styles.notificationBadge}>
                  <Text style={styles.notificationText}>
                    {notifications > 9 ? "9+" : notifications}
                  </Text>
                </View>
              )}
            </View>
          </TouchableOpacity>
        </View>
      </View>
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={{ paddingTop: 10, paddingBottom: 30 }}>
          <Text style={styles.menuTitle}>Apartment Management Menu</Text>
          <Text style={styles.menuSubtitle}>
            Manage professional objects in apartments
          </Text>

          <View style={styles.cardContainer}>
            {managements.map((management) => (
              <TouchableOpacity
                key={management.id}
                style={styles.card}
                onPress={() => handleCardPress(management.id)}
              >
                <MaterialIcons
                  name={management.icon}
                  size={40}
                  color={color.blue}
                  style={{ marginBottom: 10 }}
                />
                <Text style={styles.cardTitle}>{management.title}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f8f8",
  },
  header: {
    width: "100%",
    backgroundColor: color.blue,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    paddingHorizontal: 30,
    paddingVertical: 20,
  },
  headerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  greeting: {
    fontSize: theme.fontSizes.large,
    fontFamily: theme.fonts.medium,
    color: "#fff",
  },
  title: {
    fontSize: theme.fontSizes.xLarge,
    fontFamily: theme.fonts.bold,
    color: "#fff",
  },
  notificationContainer: {
    padding: 5,
  },
  notificationIconWrapper: {
    position: "relative",
  },
  notificationBadge: {
    position: "absolute",
    top: -5,
    right: -5,
    backgroundColor: "#FF4D4D",
    borderRadius: 10,
    width: 18,
    height: 18,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: color.blue,
  },
  notificationText: {
    color: "white",
    fontSize: 10,
    fontWeight: "bold",
  },
  scrollContainer: {
    padding: 15,
  },
  menuTitle: {
    fontSize: theme.fontSizes.medium,
    fontFamily: theme.fonts.medium,
    color: color.black,
  },
  menuSubtitle: {
    fontSize: theme.fontSizes.medium,
    fontFamily: theme.fonts.light,
    opacity: 0.7,
    paddingBottom: 20,
    color: color.black,
  },
  cardContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  card: {
    backgroundColor: "#EEF2FF",
    borderRadius: 15,
    padding: 20,
    marginBottom: 15,
    width: "48%",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    alignItems: "center",
  },
  cardTitle: {
    fontSize: theme.fontSizes.medium,
    fontFamily: theme.fonts.medium,
    color: "#0D1829",
    textAlign: "center",
  },
});

export default HomeScreen;
