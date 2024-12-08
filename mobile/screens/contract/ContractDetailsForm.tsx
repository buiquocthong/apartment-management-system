import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { RootStackParamList } from "../../navigation/RootStackParamList";
import CustomHeader from "../../components/CustomHeader";
import theme from "../../assets/theme/theme";
import color from "../../assets/theme/colors";
import { formatDate } from "../../utils/formatDate";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

const ContractDetailsForm: React.FC = () => {
  const route =
    useRoute<RouteProp<RootStackParamList, "ContractDetailsForm">>();
  const { contract } = route.params;
  const navigation = useNavigation();

  const StatusBadge = ({ status }: { status: string }) => {
    const getStatusColor = () => {
      switch (status) {
        case "ACTIVE":
          return { bg: "#E8F5E9", text: "#2E7D32" };
        case "INACTIVE":
          return { bg: "#FFEBEE", text: "#C62828" };
        case "EXPIRED":
          return { bg: "#FFF3E0", text: "#EF6C00" };
        default:
          return { bg: "#E0E0E0", text: "#616161" };
      }
    };

    const colors = getStatusColor();
    return (
      <View style={[styles.statusBadge, { backgroundColor: colors.bg }]}>
        <Text style={[styles.statusText, { color: colors.text }]}>
          {status}
        </Text>
      </View>
    );
  };

  const renderOwnerInfo = () => {
    const owner = contract.owner;
    return (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Ionicons name="person-outline" size={24} color={color.blue} />
          <Text style={styles.cardTitle}>Owner Information</Text>
        </View>
        <View style={styles.cardContent}>
          <InfoRow
            icon="person"
            label="Name"
            value={`${owner.first_name} ${owner.middle_name} ${owner.last_name}`}
          />
          <InfoRow icon="mail" label="Email" value={owner.email} />
          <InfoRow icon="call" label="Phone" value={owner.phone_number} />
          <InfoRow
            icon="location"
            label="Address"
            value={`${owner.street}, ${owner.ward}, ${owner.district}, ${owner.city}`}
          />
        </View>
      </View>
    );
  };

  const renderApartmentInfo = () => {
    const apartment = contract.apartment;
    return (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Ionicons name="home-outline" size={24} color={color.blue} />
          <Text style={styles.cardTitle}>Apartment Information</Text>
        </View>
        <View style={styles.cardContent}>
          <InfoRow icon="home" label="Name" value={apartment.name} />
          <InfoRow icon="resize" label="Area" value={`${apartment.area} m²`} />
          <InfoRow
            icon="bed"
            label="Bedrooms"
            value={apartment.number_of_bedroom.toString()}
          />
          <InfoRow
            icon="water"
            label="Bathrooms"
            value={apartment.number_of_bathroom.toString()}
          />
          <InfoRow
            icon="checkmark-circle"
            label="Furnished"
            value={apartment.furnished ? "Yes" : "No"}
          />
        </View>
      </View>
    );
  };

  const renderContractDetailsForm = () => {
    return (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Ionicons name="document-text-outline" size={24} color={color.blue} />
          <Text style={styles.cardTitle}>Contract Details</Text>
        </View>
        <View style={styles.cardContent}>
          <View style={styles.dateContainer}>
            <View style={styles.dateBlock}>
              <Text style={styles.dateLabel}>Start Date</Text>
              <Text style={styles.dateValue}>
                {formatDate(contract.start_date)}
              </Text>
            </View>
            <View style={styles.dateDivider} />
            <View style={styles.dateBlock}>
              <Text style={styles.dateLabel}>End Date</Text>
              <Text style={styles.dateValue}>
                {formatDate(contract.end_date)}
              </Text>
            </View>
          </View>
          <View style={styles.statusContainer}>
            <Text style={styles.statusLabel}>Status</Text>
            <StatusBadge status={contract.status} />
          </View>
        </View>
      </View>
    );
  };

  const InfoRow = ({
    icon,
    label,
    value,
  }: {
    icon: keyof typeof Ionicons.glyphMap;
    label: string;
    value: string;
  }) => (
    <View style={styles.infoRow}>
      <View style={styles.labelContainer}>
        <Ionicons
          name={icon}
          size={18}
          color={color.gray}
          style={styles.infoIcon}
        />
        <Text style={styles.label}>{label}</Text>
      </View>
      <Text style={styles.value}>{value}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <CustomHeader
        title="Contract Details"
        onBackPress={() => navigation.goBack()}
      />
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {renderContractDetailsForm()}
        {renderApartmentInfo()}
        {renderOwnerInfo()}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  content: {
    padding: 16,
  },
  card: {
    backgroundColor: color.white,
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    overflow: "hidden",
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
    backgroundColor: "#FAFAFA",
  },
  cardContent: {
    padding: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontFamily: theme.fonts.semiBold,
    color: color.black,
    marginLeft: 12,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  labelContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  infoIcon: {
    marginRight: 8,
  },
  label: {
    fontSize: 14,
    color: color.gray,
    fontFamily: theme.fonts.medium,
  },
  value: {
    flex: 2,
    fontSize: 14,
    fontFamily: theme.fonts.medium,
    color: color.black,
    textAlign: "right",
  },
  dateContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  dateBlock: {
    flex: 1,
    alignItems: "center",
  },
  dateDivider: {
    width: 1,
    height: 40,
    backgroundColor: "#F0F0F0",
    marginHorizontal: 16,
  },
  dateLabel: {
    fontSize: 12,
    color: color.gray,
    marginBottom: 4,
    fontFamily: theme.fonts.regular,
  },
  dateValue: {
    fontSize: 16,
    color: color.black,
    fontFamily: theme.fonts.semiBold,
  },
  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
  },
  statusLabel: {
    fontSize: 14,
    color: color.gray,
    fontFamily: theme.fonts.medium,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  statusText: {
    fontSize: 12,
    fontFamily: theme.fonts.semiBold,
  },
});

export default ContractDetailsForm;
