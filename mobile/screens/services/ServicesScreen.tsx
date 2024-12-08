import React, { useState, useCallback } from "react";
import {
  Text,
  ScrollView,
  TouchableOpacity,
  View,
  StyleSheet,
} from "react-native";
import { useAuth } from "../../services/AuthContext";
import { IService } from "../../utils/type";
import LoadingModal from "../../components/modal/LoadingModal";
import CustomHeader from "../../components/CustomHeader";
import serviceApi from "../../services/serviceApi";
import ServiceItem from "../../components/ServiceItem";
import FloatingActionButton from "../../components/FloatingActionButton";
import {
  useNavigation,
  useFocusEffect,
  NavigationProp,
} from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { RootStackParamList } from "../../navigation/RootStackParamList";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import theme from "../../assets/theme/theme";
import color from "../../assets/theme/colors";

const ServicesScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const { token, handleLogout } = useAuth();
  const [services, setServices] = useState<IService[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchServices = async () => {
    if (!token) {
      setError("No authentication token found");
      setLoading(false);
      return;
    }

    try {
      const api = serviceApi(token, handleLogout);
      const fetchedServices = await api.getAllServices();
      setServices(fetchedServices);
    } catch (err) {
      console.log(err);
      setError("Error fetching services");
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchServices();
    }, [token])
  );

  if (error) {
    return <Text>Error: {error}</Text>;
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <CustomHeader
        title={`List Services`}
        onBackPress={() => navigation.goBack()}
      />
      {services.length > 0 ? (
        <>
          <ScrollView
            style={{ padding: 10 }}
            contentContainerStyle={{ paddingBottom: 15 }}
          >
            {services.map((service) => {
              return (
                <TouchableOpacity
                  key={service.service_id}
                  onPress={() =>
                    navigation.navigate("ServiceForm", { service })
                  }
                >
                  <ServiceItem {...service} />
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </>
      ) : (
        <>
          <View style={styles.emptyStateContainer}>
            <MaterialIcons name="local-offer" size={50} color={color.gray} />
            <Text style={styles.emptyStateText}>No services found</Text>
          </View>
        </>
      )}
      <FloatingActionButton
        onPress={() => navigation.navigate("ServiceForm", {})}
        iconName="add-outline"
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

export default ServicesScreen;
