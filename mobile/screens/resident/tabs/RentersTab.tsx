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
import { IRenter } from "../../../utils/type";
import color from "../../../assets/theme/colors";
import theme from "../../../assets/theme/theme";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "../../../navigation/RootStackParamList";
import RenterActionModal from "../../../components/modal/RenterActionModal";

interface RentersTabProps {
  apartments: any[];
  apartmentRenters: Record<string, IRenter[]>;
  isRefreshing: boolean;
  onRefresh: () => void;
}

const RentersTab = memo(
  ({
    apartments,
    apartmentRenters,
    isRefreshing,
    onRefresh,
  }: RentersTabProps) => {
    const [modalVisible, setModalVisible] = React.useState(false);
    const [selectedRenter, setSelectedRenter] = React.useState<IRenter | null>(
      null
    );

    const navigation = useNavigation<NavigationProp<RootStackParamList>>();

    const handleAddRenter = (record_id: string) => {
      navigation.navigate("UpdateRenterForm", { record_id: record_id });
    };

    const renderPersonItem = (renter: IRenter) => (
      <View style={styles.residentContainer}>
        <View style={styles.avatarContainer}>
          <MaterialIcons name="person" size={40} color="#000" />
        </View>
        <View style={styles.infoContainer}>
          <Text style={styles.name}>
            {renter.last_name} {renter.middle_name} {renter.first_name}
          </Text>
          <View style={styles.detailRow}>
            <MaterialIcons name="phone" size={16} color="gray" />
            <Text style={styles.detailText}>{renter.phone_number}</Text>
          </View>
          <View style={styles.detailRow}>
            <MaterialIcons name="email" size={16} color="gray" />
            <Text style={styles.detailText}>{renter.email || "N/A"}</Text>
          </View>
          <View style={styles.detailRow}>
            <MaterialIcons name="location-city" size={16} color="gray" />
            <Text style={styles.detailText}>
              {renter.street}, {renter.ward}, {renter.district}, {renter.city}
            </Text>
          </View>
          <View style={styles.additionalInfoContainer}>
            <View style={styles.badgeContainer}>
              <Text style={styles.badgeText}>
                {renter.gender === "MALE"
                  ? "Male"
                  : renter.gender === "FEMALE"
                  ? "Female"
                  : "Other"}
              </Text>
            </View>
            {renter.household_head && (
              <View style={[styles.badgeContainer, styles.headBadge]}>
                <Text style={styles.badgeText}>Household head</Text>
              </View>
            )}
            {renter.career && (
              <View style={[styles.badgeContainer, styles.careerBadge]}>
                <Text style={styles.badgeText}>{renter.career}</Text>
              </View>
            )}
          </View>
        </View>
        <View style={styles.actionContainer}>
          <TouchableOpacity
            style={styles.callButton}
            onPress={() => {
              if (renter?.phone_number) {
                Linking.openURL(`tel:${renter.phone_number}`);
              } else {
                alert("Phone number not available");
              }
            }}
          >
            <MaterialIcons name="call" size={24} color="white" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              setSelectedRenter(renter);
              setModalVisible(true);
            }}
            style={styles.moreButton}
          >
            <MaterialIcons name="more-vert" size={24} color="gray" />
          </TouchableOpacity>
        </View>
      </View>
    );

    if (apartments.length === 0) {
      return (
        <View style={styles.emptyStateContainer}>
          <MaterialIcons name="person-outline" size={50} color={color.gray} />
          <Text style={styles.emptyStateText}>No renters found</Text>
        </View>
      );
    }

    return (
      <>
        <FlatList
          data={apartments}
          renderItem={({ item: apartment }) => {
            const renters = apartmentRenters[apartment.apartment_id];

            if (!renters || renters.length === 0) {
              return null;
            }

            return (
              <View style={styles.roomContainer}>
                <View style={styles.roomHeader}>
                  <Text style={styles.roomTitle}>{apartment.name}</Text>
                  <TouchableOpacity
                    onPress={() => handleAddRenter(apartment.record.record_id)}
                  >
                    <View style={styles.addButton}>
                      <MaterialIcons name="add" size={24} color="black" />
                      <Text style={styles.addText}>Add</Text>
                    </View>
                  </TouchableOpacity>
                </View>
                {renters.map((renter, index) => (
                  <React.Fragment key={index}>
                    {renderPersonItem(renter)}
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
        {selectedRenter && (
          <RenterActionModal
            isVisible={modalVisible}
            onClose={() => {
              setModalVisible(false);
              setSelectedRenter(null);
            }}
            renter={selectedRenter}
          />
        )}
      </>
    );
  }
);

export default RentersTab;

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
  addButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  addText: {
    marginLeft: 5,
    fontSize: 14,
    fontFamily: theme.fonts.semiBold,
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
    flexWrap: "wrap",
  },
  badgeContainer: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 15,
    marginRight: 8,
    marginBottom: 4,
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
