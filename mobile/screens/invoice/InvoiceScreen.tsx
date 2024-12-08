import {
  NavigationProp,
  useFocusEffect,
  useNavigation,
} from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { Text, ScrollView, View, StyleSheet } from "react-native";
import { useAuth } from "../../services/AuthContext";
import { IInvoice } from "../../utils/type";
import invoiceApi from "../../services/invoiceApi";
import InvoiceItem from "../../components/InvoiceItem";
import LoadingModal from "../../components/modal/LoadingModal";
import CustomHeader from "../../components/CustomHeader";
import { SafeAreaView } from "react-native-safe-area-context";
import FloatingActionButton from "../../components/FloatingActionButton";
import { RootStackParamList } from "../../navigation/RootStackParamList";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import theme from "../../assets/theme/theme";
import color from "../../assets/theme/colors";

const InvoiceScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const { token, handleLogout } = useAuth();
  const [invoices, setInvoices] = useState<IInvoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchInvoices = async () => {
    if (!token) {
      setError("No authentication token found");
      setLoading(false);
      return;
    }

    try {
      const api = invoiceApi(token, handleLogout);
      const fetchedInvoices = await api.getAllInvoice();
      setInvoices(fetchedInvoices);
    } catch (err) {
      console.log(err);
      setError("Error fetching blocks");
    } finally {
      setLoading(false);
    }
  };
  useFocusEffect(() => {
    fetchInvoices();
  });

  useEffect(() => {
    fetchInvoices();
  }, [token]);

  if (error) {
    return <Text>Error: {error}</Text>;
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <CustomHeader
        title={`List Invoices`}
        onBackPress={() => navigation.goBack()}
      />
      {invoices.length > 0 ? (
        <>
          <ScrollView
            style={{ padding: 16 }}
            contentContainerStyle={{ paddingBottom: 16 }}
          >
            {invoices.map((invoice) => {
              return <InvoiceItem key={invoice.invoice_id} {...invoice} />;
            })}
          </ScrollView>
        </>
      ) : (
        <>
          <View style={styles.emptyStateContainer}>
            <MaterialIcons name="receipt" size={50} color={color.gray} />
            <Text style={styles.emptyStateText}>No invoices found</Text>
          </View>
        </>
      )}
      <FloatingActionButton
        onPress={() => {
          navigation.navigate("InvoiceSettingForm", {});
        }}
        iconName="settings-outline"
      />

      <LoadingModal visible={loading} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
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
});

export default InvoiceScreen;
