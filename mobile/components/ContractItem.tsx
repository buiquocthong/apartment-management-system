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
import { formatPrice } from "../utils/formatPrice";
import theme from "../assets/theme/theme";
import color from "../assets/theme/colors";
import { IContract } from "../utils/type";
import ContractActionModal from "./modal/ContractActionModal";

interface ContractItemProps {
  contract: IContract;
}

const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
  const statusStyleMap: { [key: string]: any } = {
    ACTIVE: styles.statusACTIVE,
    INACTIVE: styles.statusINACTIVE,
  };

  const statusStyle = statusStyleMap[status] || styles.statusDefault;

  return (
    <View style={[styles.statusBadge, statusStyle]}>
      <Text style={styles.statusText}>{status}</Text>
    </View>
  );
};

const ContractItem: React.FC<ContractItemProps> = ({ contract }) => {
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
            <MaterialIcons name="description" size={32} color={color.blue} />
          </View>

          <View style={styles.headerContent}>
            <Text style={styles.contractName} numberOfLines={1}>
              {contract.apartment.name}
            </Text>
            <StatusBadge status={contract.status} />
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
            <Text style={styles.label}>Apartment Owner</Text>
            <Text style={styles.value}>
              {contract.owner.first_name} {contract.owner.middle_name}{" "}
              {contract.owner.last_name}
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.label}>Payment Deadline</Text>
            <Text style={styles.value}>{formatDate(contract.start_date)}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.label}>Apartment Price</Text>
            <Text style={styles.value}>
              {formatPrice(contract.apartment.sale_info.purchase_price)} đ
            </Text>
          </View>
        </View>

        <ContractActionModal
          isVisible={modalVisible}
          onClose={() => setModalVisible(false)}
          contract={contract}
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
  contractName: {
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
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginRight: 16,
  },
  statusACTIVE: {
    backgroundColor: "#e6f4ea",
  },
  statusINACTIVE: {
    backgroundColor: "#fce8e6",
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

export default ContractItem;
