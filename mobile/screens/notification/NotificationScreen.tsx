import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
} from "react-native";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "../../navigation/RootStackParamList";
import color from "../../assets/theme/colors";
import theme from "../../assets/theme/theme";
import CustomHeader from "../../components/CustomHeader";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../../services/AuthContext";
import mailApi from "../../services/mailApi";

interface Notification {
  id: string;
  to: string[];
  cc?: string[];
  bcc?: string[];
  priority: "HIGHEST" | "HIGH" | "MEDIUM" | "LOW";
  subject: string;
  status: "SCHEDULED" | "SENT" | "FAILED";
  retry_times: number;
  error?: string;
  updated_on: string;
  sent_date: string;
  templateId: string;
  parameters?: Record<string, any>;
}

const NotificationsScreen = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const { token, handleLogout } = useAuth();

  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchNotifications = async () => {
    if (!token) return;

    try {
      setIsLoading(true);
      const api = mailApi(token, handleLogout);
      const fetchedNotifications = await api.getAllMails();
      setNotifications(fetchedNotifications);
      setError(null);
    } catch (err) {
      console.error("Failed to fetch notifications:", err);
      setError("Failed to load notifications. Please try again.");
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, [token]);

  const onRefresh = () => {
    setIsRefreshing(true);
    fetchNotifications();
  };

  const getPriorityColor = (priority: Notification["priority"]) => {
    switch (priority) {
      case "HIGHEST":
        return "#FF4D4D";
      case "HIGH":
        return "#FFA500";
      case "MEDIUM":
        return "#4CAF50";
      case "LOW":
        return "#2196F3";
    }
  };

  const renderNotificationItem = ({ item }: { item: Notification }) => (
    <TouchableOpacity style={styles.notificationItem}>
      <View style={styles.notificationHeader}>
        <View
          style={[
            styles.priorityIndicator,
            { backgroundColor: getPriorityColor(item.priority || "LOW") },
          ]}
        />
        <Text style={styles.notificationSubject} numberOfLines={1}>
          {item.subject}
        </Text>
        <Text style={styles.notificationStatus}>{item.status}</Text>
      </View>
      <View style={styles.notificationDetails}>
        <Text style={styles.notificationTo}>
          To: {item.to?.join(", ") || "N/A"}
        </Text>
        <Text style={styles.notificationDate}>
          {item.sent_date
            ? new Date(item.sent_date).toLocaleString()
            : "Date not available"}
        </Text>
      </View>
    </TouchableOpacity>
  );

  const renderContent = () => {
    if (isLoading) {
      return (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Loading notifications...</Text>
        </View>
      );
    }

    if (error) {
      return (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>{error}</Text>
        </View>
      );
    }

    if (notifications.length === 0) {
      return (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No notifications</Text>
        </View>
      );
    }

    return (
      <FlatList
        data={notifications}
        renderItem={renderNotificationItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={onRefresh}
            colors={[color.blue]}
          />
        }
      />
    );
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <CustomHeader
        title="Notifications"
        onBackPress={() => navigation.goBack()}
      />
      {renderContent()}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f8f8",
  },
  listContainer: {
    padding: 15,
  },
  notificationItem: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  notificationHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  priorityIndicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 10,
  },
  notificationSubject: {
    flex: 1,
    fontSize: theme.fontSizes.medium,
    fontFamily: theme.fonts.medium,
  },
  notificationStatus: {
    fontSize: theme.fontSizes.small,
    color: "#666",
  },
  notificationDetails: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  notificationTo: {
    fontSize: theme.fontSizes.small,
    color: "#333",
  },
  notificationDate: {
    fontSize: theme.fontSizes.small,
    color: "#666",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 50,
  },
  emptyText: {
    fontSize: theme.fontSizes.medium,
    color: "#666",
  },
});

export default NotificationsScreen;
