import React, { useCallback, useState } from "react";
import { useAuth } from "../../../services/AuthContext";
import { IRentalRecord } from "../../../utils/type";
import rentalRecordApi from "../../../services/rentalRecordApi";
import {
  View,
  Text,
  ActivityIndicator,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
} from "react-native";
import RentalRecordItem from "../../../components/RentalRecordItem";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import theme from "../../../assets/theme/theme";
import color from "../../../assets/theme/colors";

const InActiveRecordsTab: React.FC = () => {
  const { token, handleLogout } = useAuth();
  const [rentalRecords, setRentalRecords] = useState<IRentalRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchInactiveRecords = async () => {
    if (!token) {
      setError("No authentication token found");
      setLoading(false);
      return;
    }

    try {
      const api = rentalRecordApi(token, handleLogout);
      const fetchedInactiveRecords = await api.getAllInactiveRecords();
      setRentalRecords(fetchedInactiveRecords);
      setError(null);
    } catch (err) {
      console.error(err);
      setError("Error fetching inactive records");
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchInactiveRecords();
    setRefreshing(false);
  }, [token]);

  React.useEffect(() => {
    fetchInactiveRecords();
  }, [token]);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color={color.gray} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text style={{ color: color.gray, fontFamily: theme.fonts.regular }}>
          Error: {error}
        </Text>
      </View>
    );
  }

  return (
    <ScrollView
      contentContainerStyle={{ flexGrow: 1, padding: 16 }}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {rentalRecords.length > 0 ? (
        rentalRecords.map((record) => (
          <TouchableOpacity key={record.record_id}>
            <RentalRecordItem record={record} />
          </TouchableOpacity>
        ))
      ) : (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <MaterialIcons name="receipt-long" size={50} color={color.gray} />
          <Text
            style={{
              marginTop: 10,
              fontFamily: theme.fonts.regular,
              fontSize: 16,
              color: color.gray,
            }}
          >
            No inactive records found
          </Text>
        </View>
      )}
    </ScrollView>
  );
};

export default InActiveRecordsTab;
