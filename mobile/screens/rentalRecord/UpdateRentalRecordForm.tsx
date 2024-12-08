import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
  Platform,
} from "react-native";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { useAuth } from "../../services/AuthContext";
import { RootStackParamList } from "../../navigation/RootStackParamList";
import CustomHeader from "../../components/CustomHeader";
import theme from "../../assets/theme/theme";
import color from "../../assets/theme/colors";
import { formatDate } from "../../utils/formatDate";
import { SafeAreaView } from "react-native-safe-area-context";
import DateTimePicker from "@react-native-community/datetimepicker";
import rentalRecordApi from "../../services/rentalRecordApi";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";

interface UpdateRentalRecordPayload {
  record_id: string;
  end_date: string;
}

const UpdateRentalRecordForm: React.FC = () => {
  const route =
    useRoute<RouteProp<RootStackParamList, "UpdateRentalRecordForm">>();
  const { rentalRecord } = route.params;
  const { token, handleLogout } = useAuth();
  const navigation = useNavigation();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [formData, setFormData] = useState<UpdateRentalRecordPayload>({
    record_id: rentalRecord.record_id,
    end_date: rentalRecord.end_date,
  });

  const handleUpdateRentalRecord = async () => {
    if (!token) return;

    setLoading(true);
    try {
      const api = rentalRecordApi(token, handleLogout);
      await api.updateRecord(rentalRecord.record_id, formData);
      Alert.alert("Success", "Rental record updated successfully", [
        { text: "OK", onPress: () => navigation.goBack() },
      ]);
    } catch (err) {
      setError("Failed to update rental record");
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      if (selectedDate.getTime() < new Date().getTime()) {
        Alert.alert("Invalid Date", "End date must be after current date");
        return;
      }
      if (
        selectedDate.getTime() < new Date(rentalRecord.start_date).getTime()
      ) {
        Alert.alert("Invalid Date", "End date must be after start date");
        return;
      }
      setFormData((prev) => ({
        ...prev,
        end_date: selectedDate.toISOString(),
      }));
    }
  };

  const renderRenterDetails = () => {
    return rentalRecord.renters.map((renter: any, index: any) => (
      <View key={index} style={styles.renterItem}>
        <View style={styles.renterIconContainer}>
          <Ionicons name="person-circle" size={40} color={color.blue} />
        </View>
        <View style={styles.renterTextContainer}>
          <Text style={styles.renterName}>
            {renter.first_name} {renter.middle_name} {renter.last_name}
          </Text>
          <Text style={styles.renterInfo}>{renter.phone_number}</Text>
          <Text style={styles.renterInfo}>{renter.email}</Text>
        </View>
      </View>
    ));
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={[color.blue, "#4a90e2"]}
        // style={styles.gradientBackground}
      />
      <CustomHeader
        title="Update Rental Record"
        onBackPress={() => navigation.goBack()}
      />

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollViewContent}
      >
        <View style={styles.apartmentHeader}>
          <Ionicons name="home" size={24} color={color.white} />
          <Text style={styles.apartmentName}>
            Apartment {rentalRecord.owner.apartment.name}
          </Text>
        </View>

        <View style={styles.cardContainer}>
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Ionicons name="person" size={20} color={color.blue} />
              <Text style={styles.cardTitle}>Owner Information</Text>
            </View>
            <Text style={styles.ownerName}>
              {rentalRecord.owner.first_name} {rentalRecord.owner.middle_name}{" "}
              {rentalRecord.owner.last_name}
            </Text>
            <Text style={styles.ownerInfo}>
              {rentalRecord.owner.phone_number}
            </Text>
            <Text style={styles.ownerInfo}>{rentalRecord.owner.email}</Text>
          </View>

          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Ionicons name="people" size={20} color={color.blue} />
              <Text style={styles.cardTitle}>Renters</Text>
            </View>
            {renderRenterDetails()}
          </View>

          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Ionicons name="calendar" size={20} color={color.blue} />
              <Text style={styles.cardTitle}>Rental Period</Text>
            </View>
            <View style={styles.dateContainer}>
              <View style={styles.dateItem}>
                <Text style={styles.dateLabel}>Start Date</Text>
                <Text style={styles.dateValue}>
                  {formatDate(rentalRecord.start_date)}
                </Text>
              </View>
              <View style={styles.dateDivider} />
              <TouchableOpacity
                style={styles.dateItem}
                onPress={() => setShowDatePicker(true)}
              >
                <Text style={styles.dateLabel}>End Date</Text>
                <Text style={styles.dateLabel}>(Click to extend)</Text>
                <Text style={styles.dateValue}>
                  {formatDate(formData.end_date)}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {showDatePicker && (
          <DateTimePicker
            value={new Date(formData.end_date)}
            mode="date"
            display="default"
            onChange={handleDateChange}
            minimumDate={new Date()}
          />
        )}
      </ScrollView>

      <View style={styles.footer}>
        {error && <Text style={styles.errorText}>{error}</Text>}
        <TouchableOpacity
          style={[styles.updateButton, loading && styles.updateButtonDisabled]}
          onPress={handleUpdateRentalRecord}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color={color.white} />
          ) : (
            <View style={styles.buttonContent}>
              <Ionicons name="refresh-circle" size={24} color={color.white} />
              <Text style={styles.updateButtonText}>Update Record</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  gradientBackground: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 250,
    opacity: 0.7,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  scrollViewContent: {
    paddingBottom: 100,
  },
  apartmentHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 16,
    marginBottom: 16,
    backgroundColor: "#ADD8E6",
    padding: 12,
    borderRadius: 12,
  },
  apartmentName: {
    fontSize: 20,
    fontFamily: theme.fonts.semiBold,
    color: color.white,
    marginLeft: 10,
  },
  cardContainer: {
    marginTop: 16,
  },
  card: {
    backgroundColor: color.white,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 18,
    fontFamily: theme.fonts.semiBold,
    color: color.black,
    marginLeft: 8,
  },
  renterItem: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    paddingVertical: 12,
  },
  renterIconContainer: {
    marginRight: 12,
  },
  renterTextContainer: {
    flex: 1,
  },
  renterName: {
    fontSize: 16,
    fontFamily: theme.fonts.semiBold,
    color: color.black,
    marginBottom: 4,
  },
  renterInfo: {
    fontSize: 14,
    color: "#666",
    marginBottom: 2,
  },
  ownerName: {
    fontSize: 16,
    fontFamily: theme.fonts.semiBold,
    color: color.black,
    marginBottom: 4,
  },
  ownerInfo: {
    fontSize: 14,
    color: "#666",
    marginBottom: 2,
  },
  dateContainer: {
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center",
  },
  dateItem: {
    flex: 1,
    alignItems: "center",
  },
  dateDivider: {
    width: 1,
    height: 40,
    backgroundColor: "#eee",
    marginHorizontal: 16,
  },
  dateLabel: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
  },
  dateValue: {
    fontSize: 16,
    fontFamily: theme.fonts.medium,
    color: color.black,
  },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: color.white,
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#eee",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: -3 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
      },
      android: {
        elevation: 10,
      },
    }),
  },
  errorText: {
    color: "red",
    textAlign: "center",
    marginBottom: 8,
  },
  updateButton: {
    backgroundColor: color.blue,
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
  },
  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  updateButtonDisabled: {
    opacity: 0.7,
  },
  updateButtonText: {
    color: color.white,
    fontSize: 16,
    fontFamily: theme.fonts.semiBold,
    marginLeft: 8,
  },
});

export default UpdateRentalRecordForm;
