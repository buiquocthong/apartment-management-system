import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Animated,
  Platform,
} from "react-native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { formatDate } from "../utils/formatDate";
import theme from "../assets/theme/theme";
import color from "../assets/theme/colors";
import { IRenter } from "../utils/type";
import RenterActionModal from "./modal/RenterActionModal";

interface RenterItemProps {
  renter: IRenter;
}

const StatusBadge: React.FC<{ isHouseholdHead: boolean }> = ({
  isHouseholdHead,
}) => {
  return (
    <View
      style={[
        styles.statusBadge,
        isHouseholdHead ? styles.statusHouseholdHead : styles.statusDefault,
      ]}
    >
      <Text style={styles.statusText}>
        {isHouseholdHead ? "Household Head" : "Member"}
      </Text>
    </View>
  );
};

const RenterItem: React.FC<RenterItemProps> = ({ renter }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [scaleValue] = useState(new Animated.Value(1));

  const handlePress = () => {
    Animated.sequence([
      Animated.timing(scaleValue, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleValue, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  };

  return (
    <TouchableOpacity activeOpacity={0.9} onPress={handlePress}>
      <Animated.View
        style={[styles.card, { transform: [{ scale: scaleValue }] }]}
      >
        <View style={styles.header}>
          <View style={styles.iconContainer}>
            <MaterialIcons name="person" size={32} color={color.blue} />
          </View>

          <View style={styles.headerContent}>
            <Text style={styles.renterName} numberOfLines={1}>
              {renter.first_name} {renter.middle_name} {renter.last_name}
            </Text>
            <StatusBadge isHouseholdHead={renter.household_head} />
          </View>

          <TouchableOpacity
            onPress={() => setModalVisible(true)}
            style={styles.actionButton}
          >
            <MaterialIcons name="more-vert" size={24} color={color.gray} />
          </TouchableOpacity>
        </View>

        <View style={styles.divider} />

        <View style={styles.content}>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Gender</Text>
            <Text style={styles.value}>{renter.gender}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.label}>Birth Date</Text>
            <Text style={styles.value}>{formatDate(renter.birth_day)}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.label}>ID Card</Text>
            <Text style={styles.value}>{renter.id_card_number}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.label}>Contact</Text>
            <Text style={styles.value}>{renter.phone_number}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.label}>Career</Text>
            <Text style={styles.value}>{renter.career}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.label}>Address</Text>
            <Text style={styles.value} numberOfLines={2}>
              {renter.street}, {renter.ward}, {renter.district}, {renter.city}
            </Text>
          </View>
        </View>

        <RenterActionModal
          isVisible={modalVisible}
          onClose={() => setModalVisible(false)}
          renter={renter}
        />
      </Animated.View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: color.white,
    borderRadius: 16,
    marginVertical: 8,
    ...Platform.select({
      ios: {
        shadowColor: color.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
  },
  iconContainer: {
    backgroundColor: `${color.blue}15`,
    padding: 8,
    borderRadius: 12,
  },
  headerContent: {
    flex: 1,
    marginLeft: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  renterName: {
    fontSize: 18,
    fontFamily: theme.fonts.bold,
    color: color.black,
    flex: 1,
  },
  actionButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: `${color.gray}15`,
  },
  divider: {
    height: 1,
    backgroundColor: `${color.gray}30`,
    marginHorizontal: 16,
  },
  content: {
    padding: 16,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  label: {
    fontSize: 14,
    fontFamily: theme.fonts.medium,
    color: color.gray,
  },
  value: {
    fontSize: 14,
    fontFamily: theme.fonts.semiBold,
    color: color.black,
    maxWidth: "60%",
    textAlign: "right",
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginRight: 16,
  },
  statusHouseholdHead: {
    backgroundColor: "#e6f4ea",
  },
  statusDefault: {
    backgroundColor: "#f0f0f0",
  },
  statusText: {
    fontSize: 12,
    fontFamily: theme.fonts.semiBold,
    color: color.black,
  },
});

export default RenterItem;
