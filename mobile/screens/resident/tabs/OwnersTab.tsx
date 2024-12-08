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
import { IOwner } from "../../../utils/type";
import ResidentActionModal from "../../../components/modal/ResidentActionModal";
import color from "../../../assets/theme/colors";
import theme from "../../../assets/theme/theme";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "../../../navigation/RootStackParamList";

interface OwnersTabProps {
  apartments: any[];
  apartmentOwners: Record<string, IOwner[]>;
  isRefreshing: boolean;
  onRefresh: () => void;
}

const OwnersTab = memo(
  ({
    apartments,
    apartmentOwners,
    isRefreshing,
    onRefresh,
  }: OwnersTabProps) => {
    const [modalVisible, setModalVisible] = React.useState(false);
    const [selectedOwner, setSelectedOwner] = React.useState<IOwner | null>(
      null
    );
    const navigation = useNavigation<NavigationProp<RootStackParamList>>();

    const handleAddOwner = (id: string) => {
      navigation.navigate("UpdateOwnerForm", { household_id: id });
    };
    const renderPersonItem = (owner: IOwner) => (
      <View style={styles.residentContainer}>
        <View style={styles.avatarContainer}>
          <MaterialIcons name="home" size={40} color="#000" />
        </View>
        <View style={styles.infoContainer}>
          <Text style={styles.name}>
            {owner.last_name} {owner.middle_name} {owner.first_name}
          </Text>
          <View style={styles.detailRow}>
            <MaterialIcons name="phone" size={16} color="gray" />
            <Text style={styles.detailText}>{owner.phone_number}</Text>
          </View>
          <View style={styles.detailRow}>
            <MaterialIcons name="email" size={16} color="gray" />
            <Text style={styles.detailText}>{owner.email || "N/A"}</Text>
          </View>
          <View style={styles.detailRow}>
            <MaterialIcons name="location-city" size={16} color="gray" />
            <Text style={styles.detailText}>
              {owner.street}, {owner.ward}, {owner.district}, {owner.city}
            </Text>
          </View>
          <View style={styles.additionalInfoContainer}>
            <View style={styles.badgeContainer}>
              <Text style={styles.badgeText}>
                {owner.gender === "MALE"
                  ? "Male"
                  : owner.gender === "FEMALE"
                  ? "Female"
                  : "Other"}
              </Text>
            </View>
            {owner.household_head && (
              <View style={[styles.badgeContainer, styles.headBadge]}>
                <Text style={styles.badgeText}>Household head</Text>
              </View>
            )}
            <View style={styles.badgeContainer}>
              <Text style={styles.badgeText}>
                {owner.occupancy === true ? "Occupied" : "Unoccupied"}
              </Text>
            </View>
            {owner.career && (
              <View style={[styles.badgeContainer, styles.careerBadge]}>
                <Text style={styles.badgeText}>{owner.career}</Text>
              </View>
            )}
          </View>
        </View>
        <View style={styles.actionContainer}>
          <TouchableOpacity
            style={styles.callButton}
            onPress={() => {
              if (owner?.phone_number) {
                Linking.openURL(`tel:${owner.phone_number}`);
              } else {
                alert("Phone number not available");
              }
            }}
          >
            <MaterialIcons name="call" size={24} color="white" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              setSelectedOwner(owner);
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
          <MaterialIcons name="home" size={50} color={color.gray} />
          <Text style={styles.emptyStateText}>No owners found</Text>
        </View>
      );
    }

    return (
      <>
        <FlatList
          data={apartments}
          renderItem={({ item: apartment }) => {
            const owners = apartmentOwners[apartment.apartment_id];

            if (!owners || owners.length === 0) {
              return null;
            }

            return (
              <View style={styles.roomContainer}>
                <View style={styles.roomHeader}>
                  <Text style={styles.roomTitle}>{apartment.name}</Text>
                  <TouchableOpacity
                    onPress={() => handleAddOwner(apartment.household_id)}
                  >
                    <View style={styles.addButton}>
                      <MaterialIcons name="add" size={24} color="black" />
                      <Text style={styles.addText}>Add</Text>
                    </View>
                  </TouchableOpacity>
                </View>
                {owners.map((owner, index) => (
                  <React.Fragment key={index}>
                    {renderPersonItem(owner)}
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
        {selectedOwner && (
          <ResidentActionModal
            isVisible={modalVisible}
            onClose={() => {
              setModalVisible(false);
              setSelectedOwner(null);
            }}
            person={selectedOwner}
          />
        )}
      </>
    );
  }
);

export default OwnersTab;

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
