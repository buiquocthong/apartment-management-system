import React from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Alert,
  ViewStyle,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import theme from "../../assets/theme/theme";
import color from "../../assets/theme/colors";
import { IInvoice } from "../../utils/type";
import { useAuth } from "../../services/AuthContext";
import invoiceApi from "../../services/invoiceApi";
import { RootStackParamList } from "../../navigation/RootStackParamList";

interface InvoiceActionModalProps {
  isVisible: boolean;
  invoice: IInvoice;
  onClose: () => void;
}

interface ActionItem {
  id: string;
  title: string;
  icon: keyof typeof Ionicons.glyphMap;
  action: string;
  color?: string;
}

const InvoiceActionModal: React.FC<InvoiceActionModalProps> = ({
  isVisible,
  invoice,
  onClose,
}) => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const { token, handleLogout } = useAuth();

  const handleError = (message: string) => {
    Alert.alert("Error", message);
    onClose();
  };

  const handleSuccess = (message: string) => {
    Alert.alert("Success", message, [{ text: "OK" }]);
    onClose();
  };

  const handleAction = async (action: string) => {
    if (!token) {
      handleError("No authentication token found");
      return;
    }

    try {
      switch (action) {
        case "view":
          navigation.navigate("UpdateInvoiceForm", { invoice });
          onClose();
          break;
        case "approve":
          await invoiceApi(token, handleLogout).approvedInvoice(
            invoice.invoice_id
          );
          handleSuccess("Payment collected successfully");
          break;
        case "delete":
          await invoiceApi(token, handleLogout).deleteInvoice(
            invoice.invoice_id
          );
          handleSuccess("Invoice deleted successfully");
          break;
      }
    } catch (error) {
      handleError(`Failed to ${action} invoice`);
    }
  };

  const baseActions: ActionItem[] = [
    {
      id: "view",
      title: "View Invoice Details",
      icon: "reader",
      action: "view",
      color: color.blue,
    },
  ];

  const collectPaymentAction: ActionItem = {
    id: "approve",
    title: "Collect Payment",
    icon: "card",
    action: "approve",
    color: color.green,
  };

  const deleteAction: ActionItem = {
    id: "delete",
    title: "Delete Invoice",
    icon: "trash",
    action: "delete",
    color: color.red,
  };

  const actions: ActionItem[] = [
    ...baseActions,
    ...(invoice.status !== "PAID" ? [collectPaymentAction] : []),
    deleteAction,
  ];

  const getActionItemStyle = (color?: string): ViewStyle => {
    return {
      ...styles.actionItem,
      ...(color ? { borderLeftColor: color } : {}),
    };
  };

  return (
    <Modal visible={isVisible} animationType="slide" transparent>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.header}>
            <View>
              <Text style={styles.roomName}>{invoice.apartment.name}</Text>
              <Text
                style={[
                  styles.statusBadge,
                  {
                    backgroundColor:
                      invoice.status === "UNPAID"
                        ? color.lightRed
                        : color.lightGreen,
                    color:
                      invoice.status === "UNPAID" ? color.red : color.green,
                  },
                ]}
              >
                {invoice.status}
              </Text>
            </View>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={onClose}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Ionicons name="close" size={24} color={color.black} />
            </TouchableOpacity>
          </View>

          <FlatList
            data={actions}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={getActionItemStyle(item.color)}
                onPress={() => handleAction(item.action)}
              >
                <View style={styles.actionIcon}>
                  <Ionicons
                    name={item.icon}
                    size={24}
                    color={item.color || color.black}
                  />
                </View>
                <Text
                  style={[
                    styles.actionText,
                    item.color ? { color: item.color } : null,
                  ]}
                >
                  {item.title}
                </Text>
                <Ionicons
                  name="chevron-forward"
                  size={20}
                  color={color.black}
                  style={styles.actionArrow}
                />
              </TouchableOpacity>
            )}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
          />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 24,
    paddingBottom: 34,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 24,
  },
  roomName: {
    fontSize: 20,
    fontFamily: theme.fonts.semiBold,
    color: color.black,
    marginBottom: 8,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    fontSize: 14,
    fontFamily: theme.fonts.medium,
    overflow: "hidden",
    alignSelf: "flex-start",
  },
  closeButton: {
    padding: 4,
  },
  actionItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 4,
    borderLeftWidth: 3,
    borderLeftColor: "transparent",
  },
  actionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: color.white,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  actionText: {
    flex: 1,
    fontSize: 16,
    fontFamily: theme.fonts.medium,
    color: color.black,
  },
  actionArrow: {
    marginLeft: 8,
  },
  separator: {
    height: 1,
    backgroundColor: color.white,
    marginLeft: 56,
  },
});

export default InvoiceActionModal;
