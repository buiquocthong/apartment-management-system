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
import { IApartment, IContractRequest } from "../utils/type";
import theme from "../assets/theme/theme";
import color from "../assets/theme/colors";
import { formatPrice } from "../utils/formatPrice";
import ApartmentActionModal from "./modal/ApartmentActionModal";

interface ApartmentItemProps {
  apartment: IApartment;
  block_id: string;
  floor_id: string;
  onDeleteApartment: (apartmentId: string) => void;
  onCreateContract: (contract: IContractRequest) => void;
}

interface InfoRowProps {
  label: string;
  value: string | number;
  isPrice?: boolean;
}

const InfoRow: React.FC<InfoRowProps> = ({ label, value, isPrice = false }) => (
  <View style={styles.infoRow}>
    <Text style={styles.label}>{label}</Text>
    <Text style={styles.value}>
      {isPrice ? `${formatPrice(value as number)} đ` : value}
    </Text>
  </View>
);

const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
  const statusStyleMap: { [key: string]: any } = {
    AVAILABLE: styles.statusAVAILABLE,
    SOLD: styles.statusSOLD,
  };

  const statusStyle = statusStyleMap[status];

  return (
    <View style={[styles.statusBadge, statusStyle]}>
      <Text style={styles.statusText}>{status}</Text>
    </View>
  );
};

const ApartmentItem: React.FC<ApartmentItemProps> = ({
  apartment,
  block_id,
  floor_id,
  onDeleteApartment,
  onCreateContract,
}) => {
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

  const renderApartmentDetails = () => (
    <>
      <InfoRow
        label="Purchase price"
        value={apartment.sale_info.purchase_price}
        isPrice
      />
      <InfoRow label="Area" value={`${apartment.area} m²`} />
      <InfoRow label="Bedrooms" value={apartment.number_of_bedroom} />
      <InfoRow label="Bathrooms" value={apartment.number_of_bathroom} />
      <InfoRow
        label="Furniture"
        value={apartment.furnished ? "Furnished" : "Unfurnished"}
      />
    </>
  );

  return (
    <TouchableOpacity activeOpacity={0.9} onPress={handlePress}>
      <Animated.View
        style={[styles.card, { transform: [{ scale: scaleValue }] }]}
      >
        <View style={styles.header}>
          <View style={styles.iconContainer}>
            <MaterialIcons name="apartment" size={32} color={color.blue} />
          </View>

          <View style={styles.headerContent}>
            <Text style={styles.apartmentName}>{apartment.name}</Text>
            <StatusBadge status={apartment.status} />
          </View>

          <TouchableOpacity
            onPress={() => setModalVisible(true)}
            style={styles.actionButton}
          >
            <MaterialIcons name="more-vert" size={24} color={color.gray} />
          </TouchableOpacity>
        </View>

        <View style={styles.divider} />

        <View style={styles.content}>{renderApartmentDetails()}</View>

        <ApartmentActionModal
          isVisible={modalVisible}
          onClose={() => setModalVisible(false)}
          apartment={apartment}
          block_id={block_id}
          floor_id={floor_id}
          onDeleteApartment={onDeleteApartment}
          onCreateContract={onCreateContract}
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
  apartmentName: {
    fontSize: 18,
    fontFamily: theme.fonts.bold,
    color: color.black,
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
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginRight: 16,
  },
  statusAVAILABLE: {
    backgroundColor: "#e6f4ea",
  },
  statusSOLD: {
    backgroundColor: "#fce8e6",
  },
  statusText: {
    fontSize: 12,
    fontFamily: theme.fonts.semiBold,
    color: color.black,
  },
});

export default ApartmentItem;
