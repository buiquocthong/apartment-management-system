import React, { useCallback, useState } from "react";
import { useAuth } from "../../../services/AuthContext";
import { IContract } from "../../../utils/type";
import contractApi from "../../../services/contractApi";
import { useFocusEffect } from "@react-navigation/native";
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  View,
  Text,
  TouchableOpacity,
} from "react-native";
import ContractItem from "../../../components/ContractItem";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import theme from "../../../assets/theme/theme";
import color from "../../../assets/theme/colors";

const ContractsTab: React.FC = () => {
  const { token, handleLogout } = useAuth();
  const [contracts, setContracts] = useState<IContract[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchContracts = async () => {
    if (!token) {
      setError("No authentication token found");
      setLoading(false);
      return;
    }

    try {
      const api = contractApi(token, handleLogout);
      const fetchedContracts = await api.getAllContract();
      setContracts(fetchedContracts);
      setError(null);
    } catch (err) {
      console.log(err);
      setError("Error fetching contracts");
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchContracts();
    setRefreshing(false);
  }, [token]);

  useFocusEffect(
    useCallback(() => {
      fetchContracts();
    }, [token])
  );

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color={color.gray} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text style={{ color: color.gray, fontFamily: theme.fonts.regular }}>
          Error: {error}
        </Text>
      </View>
    );
  }

  return (
    <ScrollView
      contentContainerStyle={{ flexGrow: 1, padding: 16 }}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {contracts.length > 0 ? (
        contracts.map((contract) => (
          <TouchableOpacity key={contract.contract_id}>
            <ContractItem key={contract.contract_id} contract={contract} />
          </TouchableOpacity>
        ))
      ) : (
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <MaterialIcons name="receipt-long" size={50} color={color.gray} />
          <Text
            style={{
              marginTop: 10,
              fontFamily: theme.fonts.regular,
              fontSize: 16,
              color: color.gray,
            }}
          >
            No contracts found
          </Text>
        </View>
      )}
    </ScrollView>
  );
};

export default ContractsTab;
