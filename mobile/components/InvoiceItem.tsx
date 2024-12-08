import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { formatDate } from "../utils/formatDate";
import { formatPrice } from "../utils/formatPrice";
import InvoiceActionModal from "./modal/InvoiceActionModal";
import theme from "../assets/theme/theme";
import color from "../assets/theme/colors";
import { IInvoice } from "../utils/type";

const InvoiceItem = (invoice: IInvoice) => {
  const [modalVisible, setModalVisible] = useState(false);
  const navigation = useNavigation();

  const getStatusStyles = (status: string) => {
    switch (status) {
      case "UNPAID":
        return {
          color: color.red,
          backgroundColor: "rgba(255, 0, 0, 0.1)",
        };
      case "PAID":
        return {
          color: color.green,
          backgroundColor: "rgba(0, 255, 0, 0.1)",
        };
      case "EXPIRED":
        return {
          color: color.gray,
          backgroundColor: "rgba(128, 128, 128, 0.1)",
        };
      default:
        return {
          color: color.gray,
          backgroundColor: "rgba(128, 128, 128, 0.1)",
        };
    }
  };

  const statusStyles = getStatusStyles(invoice.status);

  const renderExpiryDetails = () => {
    if (invoice.status === "EXPIRED") {
      return (
        <View style={styles.expiryContainer}>
          <View style={styles.expiryDivider} />
          <View style={styles.expiryContent}>
            <View style={styles.infoRow}>
              <View style={styles.labelContainer}>
                <MaterialIcons name="event" size={16} color={color.red} />
                <Text style={[styles.label, styles.expiryLabel]}>
                  Extra deadline
                </Text>
              </View>
              <Text style={[styles.value, styles.expiryValue]}>
                {formatDate(invoice.extra_payment_deadline)}
              </Text>
            </View>
            <View style={styles.infoRow}>
              <View style={styles.labelContainer}>
                <MaterialIcons name="warning" size={16} color={color.red} />
                <Text style={[styles.label, styles.expiryLabel]}>
                  Penalty fee
                </Text>
              </View>
              <Text style={styles.penaltyAmount}>
                {formatPrice(invoice.penalty_fee)}
              </Text>
            </View>
          </View>
        </View>
      );
    }
    return null;
  };

  return (
    <TouchableOpacity activeOpacity={0.7}>
      <View style={[styles.card, { backgroundColor: "#fff" }]}>
        <View style={styles.header}>
          <View style={styles.leftHeader}>
            <MaterialIcons
              name="receipt"
              size={36}
              color={statusStyles.color}
              style={styles.icon}
            />
            <Text numberOfLines={1} style={styles.invoiceName}>
              {invoice.apartment.name}
            </Text>
          </View>
          <View style={styles.statusContainer}>
            <View
              style={[
                styles.statusBadge,
                { backgroundColor: statusStyles.backgroundColor },
              ]}
            >
              <Text style={[styles.statusText, { color: statusStyles.color }]}>
                {invoice.status}
              </Text>
            </View>
          </View>
          <TouchableOpacity
            onPress={() => setModalVisible(true)}
            style={styles.actionButton}
          >
            <MaterialIcons name="more-vert" size={24} color="#666" />
          </TouchableOpacity>
        </View>

        <View style={styles.divider} />
        <View style={styles.content}>
          <View style={styles.infoRow}>
            <View style={styles.labelContainer}>
              <MaterialIcons name="schedule" size={16} color="#666" />
              <Text style={styles.label}>Payment deadline</Text>
            </View>
            <Text style={styles.value}>
              {formatDate(invoice.payment_deadline)}
            </Text>
          </View>

          {renderExpiryDetails()}

          <View style={[styles.infoRow, styles.totalRow]}>
            <View style={styles.labelContainer}>
              <MaterialIcons name="attach-money" size={16} color="#666" />
              <Text style={styles.label}>Total amount</Text>
            </View>
            <Text style={styles.totalAmount}>{formatPrice(invoice.total)}</Text>
          </View>
        </View>

        <InvoiceActionModal
          isVisible={modalVisible}
          onClose={() => setModalVisible(false)}
          invoice={invoice}
        />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  leftHeader: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  divider: {
    height: 1,
    backgroundColor: `${color.gray}30`,
    marginHorizontal: -16,
  },
  icon: {
    marginRight: 12,
  },
  invoiceName: {
    fontSize: 18,
    fontFamily: theme.fonts.semiBold,
    color: color.black,
    flex: 1,
  },
  actionButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: "#f5f5f5",
  },
  content: {
    gap: 12,
    marginTop: 16,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  labelContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  totalRow: {
    marginTop: 8,
    paddingTop: 8,
  },
  label: {
    fontSize: 14,
    color: "#666",
    fontFamily: theme.fonts.medium,
  },
  value: {
    fontSize: 14,
    color: color.black,
    fontFamily: theme.fonts.medium,
  },
  totalAmount: {
    fontSize: 16,
    color: color.black,
    fontFamily: theme.fonts.semiBold,
  },
  penaltyAmount: {
    fontSize: 14,
    color: color.red,
    fontFamily: theme.fonts.semiBold,
  },
  statusContainer: {
    alignItems: "flex-end",
    marginTop: 8,
    marginRight: 10,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  statusText: {
    fontSize: 14,
    fontFamily: theme.fonts.semiBold,
  },
  expiryContainer: {
    marginVertical: 8,
  },
  expiryDivider: {
    height: 1,
    backgroundColor: `${color.red}30`,
    marginHorizontal: -16,
    marginBottom: 12,
  },
  expiryContent: {
    gap: 8,
    backgroundColor: `${color.red}10`,
    padding: 12,
    borderRadius: 8,
  },
  expiryLabel: {
    color: color.red,
  },
  expiryValue: {
    color: color.red,
  },
});

export default InvoiceItem;
