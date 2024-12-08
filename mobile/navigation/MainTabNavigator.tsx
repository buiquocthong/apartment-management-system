import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import Ionicons from "react-native-vector-icons/Ionicons";
import HomeScreen from "../screens/HomeScreen";
import InvoiceScreen from "../screens/invoice/InvoiceScreen";
import ServiceScreen from "../screens/services/ServicesScreen";
import ContractScreen from "../screens/contract/ContractScreen";
import ResidentScreen from "../screens/resident/ResidentScreen";
import AccountScreen from "../screens/account/AccountScreen";
import BlockScreen from "../screens/apartment/BlockScreen";
import color from "../assets/theme/colors";
import theme from "../assets/theme/theme";

const Tab = createBottomTabNavigator();

const MainTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          backgroundColor: "#fff",
          borderTopColor: "#ccc",
          borderTopWidth: 1,
        },
        tabBarActiveTintColor: color.blue,
        tabBarInactiveTintColor: color.gray,
        tabBarLabelStyle: {
          fontSize: 12,
          fontFamily: theme.fonts.semiBold,
        },
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          switch (route.name) {
            case "Home":
              iconName = focused ? "home" : "home";
              return <Ionicons name={iconName} size={size} color={color} />;
            case "Block":
              iconName = focused ? "apartment" : "apartment";
              return (
                <MaterialIcons name={iconName} size={size} color={color} />
              );
            case "Invoice":
              iconName = focused ? "receipt" : "receipt";
              return (
                <MaterialIcons name={iconName} size={size} color={color} />
              );
            case "Service":
              iconName = focused ? "local-offer" : "local-offer";
              return (
                <MaterialIcons name={iconName} size={size} color={color} />
              );
            case "Contract":
              iconName = focused ? "assignment" : "assignment";
              return (
                <MaterialIcons name={iconName} size={size} color={color} />
              );
            case "Resident":
              iconName = focused ? "people" : "people";
              return (
                <MaterialIcons name={iconName} size={size} color={color} />
              );
            case "Account":
              iconName = focused ? "account-circle" : "account-circle";
              return (
                <MaterialIcons name={iconName} size={size} color={color} />
              );
            default:
              return null;
          }
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Block" component={BlockScreen} />
      <Tab.Screen name="Invoice" component={InvoiceScreen} />
      <Tab.Screen name="Service" component={ServiceScreen} />
      <Tab.Screen name="Contract" component={ContractScreen} />
      <Tab.Screen name="Resident" component={ResidentScreen} />
      <Tab.Screen name="Account" component={AccountScreen} />
    </Tab.Navigator>
  );
};

export default MainTabNavigator;
