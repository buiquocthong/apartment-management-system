import React from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Platform,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import theme from "../../assets/theme/theme";
import color from "../../assets/theme/colors";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "../../navigation/RootStackParamList";
import { useAuth } from "../../services/AuthContext";
import { IRentalRecord } from "../../utils/type";
import rentalRecordApi from "../../services/rentalRecordApi";

interface RentalRecordActionModalProps {
  isVisible: boolean;
  onClose: () => void;
  rentalRecord: IRentalRecord;
}

interface Action {
  id: string;
  title: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
}

const ACTIONS: Action[] = [
  {
    id: "view",
    title: "View details",
    icon: "document-text-outline",
    color: color.blue,
  },
  {
    id: "delete",
    title: "Delete record",
    icon: "trash-outline",
    color: color.red,
  },
];

const RentalRecordActionModal: React.FC<RentalRecordActionModalProps> = ({
  isVisible,
  onClose,
  rentalRecord,
}) => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const { token, handleLogout } = useAuth();

  const handleDeleteRentalRecord = async (rental_id: string) => {
    if (!token) {
      return;
    }

    try {
      const api = rentalRecordApi(token, handleLogout);
      await api.deleteRecord(rental_id);
      Alert.alert("Success", "Delete rental record successfully", [
        { text: "OK", onPress: () => navigation.goBack() },
      ]);
    } catch (err) {
      Alert.alert("Error", "Failed to delete rental record");
      console.error(err);
    }
  };

  const handleAction = (actionId: string) => {
    switch (actionId) {
      case "view":
        navigation.navigate("UpdateRentalRecordForm", {
          rentalRecord: rentalRecord,
        });
        break;
      case "delete":
        Alert.alert(
          "Confirm Delete",
          "Are you sure you want to delete this rental record?",
          [
            { text: "Cancel", style: "cancel" },
            {
              text: "Delete",
              style: "destructive",
              onPress: () => handleDeleteRentalRecord(rentalRecord.record_id),
            },
          ]
        );
        break;
    }
    onClose();
  };

  const renderItem = ({ item }: { item: Action }) => (
    <TouchableOpacity
      style={[styles.actionItem, { backgroundColor: `${item.color}10` }]}
      onPress={() => handleAction(item.id)}
      activeOpacity={0.7}
    >
      <View style={[styles.iconContainer, { backgroundColor: item.color }]}>
        <Ionicons name={item.icon} size={24} color="#FFF" />
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.actionTitle}>{item.title}</Text>
      </View>
      <Ionicons name="chevron-forward-outline" size={20} color={item.color} />
    </TouchableOpacity>
  );

  return (
    <Modal
      visible={isVisible}
      animationType="slide"
      transparent={true}
      statusBarTranslucent
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <View style={styles.header}>
            <View>
              <Text style={styles.blockLabel}>APARTMENT NAME</Text>
              <Text style={styles.blockName}>
                {rentalRecord.owner.apartment.name}
              </Text>
            </View>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={onClose}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Ionicons name="close-outline" size={24} color={color.gray} />
            </TouchableOpacity>
          </View>

          <FlatList
            data={ACTIONS}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContainer}
            showsVerticalScrollIndicator={false}
          />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    padding: 20,
    paddingBottom: Platform.OS === "ios" ? 40 : 20,
    maxHeight: "80%",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: color.lightGray,
  },
  blockLabel: {
    fontSize: 12,
    color: color.black,
    fontFamily: theme.fonts.medium,
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  blockName: {
    fontSize: 24,
    fontFamily: theme.fonts.semiBold,
    color: color.black,
  },
  subInfo: {
    fontSize: 14,
    fontFamily: theme.fonts.regular,
    color: color.gray,
    marginTop: 4,
  },
  listContainer: {
    gap: 12,
  },
  actionItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 12,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
    marginRight: 8,
  },
  actionTitle: {
    fontSize: 16,
    fontFamily: theme.fonts.medium,
    color: color.black,
    marginBottom: 4,
  },
  closeButton: {
    padding: 4,
  },
});

export default RentalRecordActionModal;
