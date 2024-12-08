import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from "react-native";
import BlockActionModal from "./modal/BlockActionModal";
import theme from "../assets/theme/theme";
import color from "../assets/theme/colors";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "../navigation/RootStackParamList";

interface BlockCardProps {
  block_id: string;
  name: string;
  description: string;
  total_apartment: number;
  total_floor: number;
}

const BlockCard: React.FC<BlockCardProps> = ({
  block_id,
  name,
  description,
  total_apartment,
  total_floor,
}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const handleNavigation = () => {
    navigation.navigate("Apartment", { block_id });
  };

  const InfoItem = ({ label, value }: { label: string; value: number }) => (
    <View style={styles.infoItem}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  );

  return (
    <TouchableOpacity
      onPress={handleNavigation}
      style={styles.cardWrapper}
      activeOpacity={0.7}
    >
      <View style={styles.card}>
        {/* Header Section */}
        <View style={styles.header}>
          <View style={styles.iconContainer}>
            <MaterialIcons name="apartment" size={32} color={color.blue} />
          </View>
          <View style={styles.headerContent}>
            <Text style={styles.blockName}>Block {name}</Text>
          </View>
          <TouchableOpacity
            onPress={() => setModalVisible(true)}
            style={styles.actionButton}
          >
            <MaterialIcons name="more-vert" size={24} color={color.gray} />
          </TouchableOpacity>
        </View>

        {/* Description Section */}
        {description && (
          <Text style={styles.description} numberOfLines={2}>
            {description}
          </Text>
        )}

        {/* Info Section */}
        <View style={styles.infoContainer}>
          <InfoItem label="Total Floors" value={total_floor} />
          <InfoItem label="Total Apartments" value={total_apartment} />
        </View>

        {/* Modal */}
        <BlockActionModal
          isVisible={modalVisible}
          onClose={() => setModalVisible(false)}
          blockName={name}
          block_id={block_id}
        />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  cardWrapper: {
    marginHorizontal: 6,
    marginVertical: 8,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    ...Platform.select({
      ios: {
        shadowColor: color.blue,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    flex: 1,
    marginLeft: 12,
    justifyContent: "space-between",
  },
  headerContent: {
    flex: 1,
    marginLeft: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  iconContainer: {
    backgroundColor: `${color.blue}15`,
    padding: 8,
    borderRadius: 12,
  },
  blockName: {
    flex: 1,
    fontSize: 18,
    fontFamily: theme.fonts.semiBold,
    color: color.black,
    marginLeft: 12,
  },
  actionButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: `${color.lightGray}10`,
  },
  description: {
    color: "#666",
    fontFamily: theme.fonts.semiBold,
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
    paddingLeft: 16,
  },
  infoContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: `${color.blue}05`,
    padding: 12,
    borderRadius: 8,
  },
  infoItem: {
    flex: 1,
    alignItems: "center",
  },
  label: {
    color: "#666",
    fontFamily: theme.fonts.medium,
    fontSize: 12,
    marginBottom: 4,
  },
  value: {
    fontFamily: theme.fonts.semiBold,
    fontSize: 16,
    color: color.blue,
  },
});

export default BlockCard;
