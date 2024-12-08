import React, { useCallback } from "react";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { RefreshControl, ScrollView } from "react-native";
import CustomHeader from "../../components/CustomHeader";
import RentalRecordsTab from "./tabs/RentalRecordsTab";
import ContractsTab from "./tabs/ContractsTab";
import InActiveRecordsTab from "./tabs/InActiveRecordsTab";

const Tab = createMaterialTopTabNavigator();

const createTabScreen = (
  WrappedComponent: React.ComponentType<any>,
  name: string
) => {
  return ({ navigation }: any) => {
    const [refreshing, setRefreshing] = React.useState(false);

    const onRefresh = useCallback(async () => {
      setRefreshing(true);
      try {
        if (typeof WrappedComponent.prototype?.onRefresh === "function") {
          await WrappedComponent.prototype.onRefresh();
        }
      } finally {
        setRefreshing(false);
      }
    }, []);

    return (
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <WrappedComponent navigation={navigation} />
      </ScrollView>
    );
  };
};

const ContractScreen: React.FC = () => {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <CustomHeader title="Documents" onBackPress={() => navigation.goBack()} />
      <Tab.Navigator
        screenOptions={{
          tabBarStyle: { elevation: 0, shadowOpacity: 0 },
          tabBarIndicatorStyle: { backgroundColor: "#2196F3" },
        }}
      >
        <Tab.Screen
          name="Contracts"
          component={createTabScreen(ContractsTab, "Contracts")}
        />
        <Tab.Screen
          name="Rental Records"
          component={createTabScreen(RentalRecordsTab, "Rental Records")}
        />
        <Tab.Screen
          name="Inactive Records"
          component={createTabScreen(InActiveRecordsTab, "Inactive Records")}
        />
      </Tab.Navigator>
    </SafeAreaView>
  );
};

export default ContractScreen;
