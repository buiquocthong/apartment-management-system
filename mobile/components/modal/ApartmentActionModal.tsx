import React, { useEffect, useState } from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Platform,
} from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import theme from "../../assets/theme/theme";
import color from "../../assets/theme/colors";
import { IApartment, IContractRequest } from "../../utils/type";
import { RootStackParamList } from "../../navigation/RootStackParamList";
import { useAuth } from "../../services/AuthContext";
import apartmentApi from "../../services/apartmentApi";

interface ApartmentActionModalProps {
  isVisible: boolean;
  apartment: IApartment;
  block_id: string;
  floor_id: string;
  onClose: () => void;
  onDeleteApartment: (apartmentId: string) => void;
  onCreateContract: (contract: IContractRequest) => void;
}

const ApartmentActionModal: React.FC<ApartmentActionModalProps> = ({
  isVisible,
  apartment,
  block_id,
  floor_id,
  onClose,
  onDeleteApartment,
  onCreateContract,
}) => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const { token, handleLogout } = useAuth();
  const [apartmentData, setApartmentData] = useState<IApartment | null>(null);

  const fetchData = async () => {
    if (!token) return;
    try {
      const apt = await apartmentApi(token, handleLogout).getApartmentById(
        apartment.apartment_id
      );
      setApartmentData(apt);
    } catch (error) {
      console.log("Error fetching apartment data:", error);
    }
  };

  useEffect(() => {
    if (isVisible) {
      fetchData();
    }
  }, [isVisible, token]);

  const getActions = () => {
    const baseActions = [
      {
        title: "View apartment details",
        icon: "apartment",
        action: "view",
        color: color.blue,
      },
    ];

    if (!apartmentData) return baseActions;

    if (apartmentData.status === "AVAILABLE") {
      return [
        ...baseActions,
        {
          title: "Create contract",
          icon: "assignment",
          action: "create-contract",
          color: color.green,
        },
        {
          title: "Delete apartment",
          icon: "close",
          action: "delete-apartment",
          color: color.red,
        },
      ];
    } else {
      const occupiedActions = [
        {
          title: "Create invoice",
          icon: "receipt-long",
          action: "create-invoice",
          color: color.green,
        },
        {
          title: "Setup services",
          icon: "settings",
          action: "setup-services",
          color: color.blue,
        },
      ];

      if (apartmentData.owner?.occupancy === true) {
        occupiedActions.push({
          title: "Create rental record",
          icon: "receipt",
          action: "create-record",
          color: color.orange,
        });
      }

      return [...baseActions, ...occupiedActions];
    }
  };

  const handleAction = (action: string) => {
    switch (action) {
      case "view":
        navigation.navigate("UpdateApartmentForm", {
          apartment_id: apartment.apartment_id,
          block_id,
          floor_id,
        });
        break;
      case "create-invoice":
        navigation.navigate("CreateInvoiceForm", {
          apartment_id: apartment.apartment_id,
        });
        break;
      case "delete-apartment":
        onDeleteApartment(apartment.apartment_id);
        break;
      case "create-contract":
        navigation.navigate("CreateContractForm", {
          apartment_id: apartment.apartment_id,
          onCreateContract,
        });
        break;
      case "create-record":
        navigation.navigate("CreateRenterRecordForm", {
          apartment_id: apartment.apartment_id,
        });
        break;
      case "setup-services":
        navigation.navigate("ServiceDetailForm", {
          apartmentId: apartment.apartment_id,
        });
        break;
    }
    onClose();
  };

  const renderItem = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={[styles.actionItem, { backgroundColor: `${item.color}10` }]}
      onPress={() => handleAction(item.action)}
      activeOpacity={0.7}
    >
      <View style={[styles.iconContainer, { backgroundColor: item.color }]}>
        <MaterialIcons name={item.icon} size={24} color="#fff" />
      </View>
      <View style={styles.actionTextContainer}>
        <Text style={styles.actionText}>{item.title}</Text>
      </View>
      <MaterialIcons name="chevron-right" size={24} color={item.color} />
    </TouchableOpacity>
  );

  return (
    <Modal visible={isVisible} animationType="slide" transparent={true}>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <View style={styles.header}>
            <View>
              <Text style={styles.roomName}>{apartment.name}</Text>
              <Text
                style={[
                  styles.roomStatus,
                  {
                    color:
                      apartment.status === "AVAILABLE"
                        ? color.red
                        : color.green,
                  },
                ]}
              >
                {apartment.status}
              </Text>
            </View>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={onClose}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Ionicons name="close" size={24} color={color.gray} />
            </TouchableOpacity>
          </View>

          <FlatList
            data={getActions()}
            renderItem={renderItem}
            keyExtractor={(item) => item.title}
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
  roomName: {
    fontSize: 24,
    fontFamily: theme.fonts.semiBold,
    color: color.black,
    marginBottom: 4,
  },
  roomStatus: {
    fontSize: 14,
    fontFamily: theme.fonts.medium,
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
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  actionTextContainer: {
    flex: 1,
  },
  actionText: {
    fontSize: 16,
    fontFamily: theme.fonts.medium,
    color: color.black,
  },
  closeButton: {
    padding: 4,
  },
});

export default ApartmentActionModal;
