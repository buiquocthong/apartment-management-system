import React, { memo } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Linking,
  RefreshControl,
} from "react-native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { IApartment, IResident } from "../../../utils/type";
import color from "../../../assets/theme/colors";
import theme from "../../../assets/theme/theme";

interface ResidentsTabProps {
  apartments: IApartment[];
  apartmentResidents: Record<string, IResident[]>;
  isRefreshing: boolean;
  onRefresh: () => void;
}

const ResidentsTab = memo(
  ({
    apartments,
    apartmentResidents,
    isRefreshing,
    onRefresh,
  }: ResidentsTabProps) => {
    const renderPersonItem = (resident: IResident) => (
      <View style={styles.residentContainer}>
        <View style={styles.avatarContainer}>
          <MaterialIcons name="person" size={40} color="#000" />
        </View>
        <View style={styles.infoContainer}>
          <Text style={styles.name}>
            {resident.last_name} {resident.middle_name} {resident.first_name}
          </Text>
          <View style={styles.detailRow}>
            <MaterialIcons name="phone" size={16} color="gray" />
            <Text style={styles.detailText}>{resident.phone_number}</Text>
          </View>
          <View style={styles.detailRow}>
            <MaterialIcons name="email" size={16} color="gray" />
            <Text style={styles.detailText}>{resident.email || "N/A"}</Text>
          </View>
          <View style={styles.detailRow}>
            <MaterialIcons name="location-city" size={16} color="gray" />
            <Text style={styles.detailText}>
              {resident.street}, {resident.ward}, {resident.district},{" "}
              {resident.city}
            </Text>
          </View>
          <View style={styles.additionalInfoContainer}>
            <View style={styles.badgeContainer}>
              <Text style={styles.badgeText}>
                {resident.gender === "MALE"
                  ? "Male"
                  : resident.gender === "FEMALE"
                  ? "Female"
                  : "Other"}
              </Text>
            </View>
            {resident.household_head && (
              <View style={[styles.badgeContainer, styles.headBadge]}>
                <Text style={styles.badgeText}>Household head</Text>
              </View>
            )}
            {resident.career && (
              <View style={[styles.badgeContainer, styles.careerBadge]}>
                <Text style={styles.badgeText}>{resident.career}</Text>
              </View>
            )}
          </View>
        </View>
        <View style={styles.actionContainer}>
          <TouchableOpacity
            style={styles.callButton}
            onPress={() => {
              if (resident?.phone_number) {
                Linking.openURL(`tel:${resident.phone_number}`);
              } else {
                alert("Phone number not available");
              }
            }}
          >
            <MaterialIcons name="call" size={24} color="white" />
          </TouchableOpacity>
        </View>
      </View>
    );

    if (apartments.length === 0) {
      return (
        <View style={styles.emptyStateContainer}>
          <MaterialIcons name="people" size={50} color={color.gray} />
          <Text style={styles.emptyStateText}>No residents found</Text>
        </View>
      );
    }

    return (
      <FlatList
        data={apartments}
        renderItem={({ item: apartment }) => {
          const residents = apartmentResidents[apartment.apartment_id];

          if (!residents || residents.length === 0) {
            return null;
          }

          return (
            <View style={styles.roomContainer}>
              <View style={styles.roomHeader}>
                <Text style={styles.roomTitle}>{apartment.name}</Text>
              </View>
              {residents.map((resident, index) => (
                <React.Fragment key={index}>
                  {renderPersonItem(resident)}
                </React.Fragment>
              ))}
            </View>
          );
        }}
        keyExtractor={(item) => item.apartment_id}
        contentContainerStyle={styles.container}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={onRefresh}
            colors={[color.blue]}
          />
        }
      />
    );
  }
);

export default ResidentsTab;

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "#f5f5f5",
  },
  roomContainer: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    elevation: 2,
  },
  roomHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  roomTitle: {
    fontSize: 16,
    fontFamily: theme.fonts.bold,
  },
  residentContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  avatarContainer: {
    width: 50,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#e0e0e0",
    borderRadius: 25,
    marginRight: 10,
  },
  infoContainer: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontFamily: theme.fonts.bold,
  },
  callButton: {
    backgroundColor: "green",
    borderRadius: 20,
    padding: 8,
    marginRight: 10,
  },
  moreButton: {
    padding: 8,
  },
  emptyStateContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 50,
  },
  emptyStateText: {
    marginTop: 10,
    fontFamily: theme.fonts.regular,
    fontSize: 16,
    color: color.gray,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  detailText: {
    marginLeft: 5,
    fontSize: 13,
    color: "gray",
    fontFamily: theme.fonts.regular,
  },
  additionalInfoContainer: {
    flexDirection: "row",
    marginTop: 8,
  },
  badgeContainer: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 15,
    marginRight: 8,
    backgroundColor: "#f0f0f0",
  },
  badgeText: {
    fontSize: 12,
    color: "#666",
    fontFamily: theme.fonts.regular,
  },
  headBadge: {
    backgroundColor: "#e6f2ff",
  },
  careerBadge: {
    backgroundColor: "#e6f3e6",
  },
  actionContainer: {
    alignItems: "center",
  },
});
