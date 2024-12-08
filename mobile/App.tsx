import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "./screens/auth/LoginScreen";
import { AuthProvider, useAuth } from "./services/AuthContext";
import * as SplashScreen from "expo-splash-screen";
import {
  useFonts,
  Inter_100Thin,
  Inter_200ExtraLight,
  Inter_300Light,
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  Inter_800ExtraBold,
  Inter_900Black,
} from "@expo-google-fonts/inter";
import MainTabNavigator from "./navigation/MainTabNavigator";
import ApartmentScreen from "./screens/apartment/ApartmentScreen";
import ForgetPasswordScreen from "./screens/auth/ForgetPasswordScreen";
import ServiceForm from "./screens/services/ServiceForm";
import CreateApartmentForm from "./screens/apartment/CreateApartmentForm";
import UpdateApartmentForm from "./screens/apartment/UpdateApartmentForm";
import UpdateInvoiceForm from "./screens/invoice/UpdateInvoiceForm";
import EditAccountScreen from "./screens/account/EditAccountScreen";
import CreateContractScreen from "./screens/contract/CreateContractForm";
import ChangePasswordScreen from "./screens/account/ChangePassword";
import CreateRenterRecordForm from "./screens/rentalRecord/CreateRenterRecordForm";
import CreateBlockForm from "./screens/apartment/CreateBlockForm";
import UpdateBlockForm from "./screens/apartment/UpdateBlockForm";
import { Provider as PaperProvider } from "react-native-paper";
import ServiceDetailForm from "./screens/serviceDetail/ServiceDetailForm";
import CreateInvoiceForm from "./screens/invoice/CreateInvoiceForm";
import InvoiceSettingForm from "./screens/invoice/InvoiceSettingForm";
import ContractDetailsForm from "./screens/contract/ContractDetailsForm";
import UpdateRentalRecordForm from "./screens/rentalRecord/UpdateRentalRecordForm";
import UpdateOwnerForm from "./screens/resident/UpdateOwnerForm";
import UpdateRenterForm from "./screens/resident/UpdateRenterForm";
import NotificationsScreen from "./screens/notification/NotificationScreen";

SplashScreen.preventAutoHideAsync();

const Stack = createNativeStackNavigator();

const App = () => {
  const [fontsLoaded] = useFonts({
    Inter_100Thin,
    Inter_200ExtraLight,
    Inter_300Light,
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
    Inter_800ExtraBold,
    Inter_900Black,
  });

  const [appIsReady, setAppIsReady] = useState(false);

  useEffect(() => {
    const prepareApp = async () => {
      if (fontsLoaded) {
        await SplashScreen.hideAsync();
        setAppIsReady(true);
      }
    };

    prepareApp();
  }, [fontsLoaded]);

  if (!appIsReady) {
    return null;
  }

  return (
    <AuthProvider>
      <PaperProvider>
        <NavigationContainer>
          <MainStack />
        </NavigationContainer>
      </PaperProvider>
    </AuthProvider>
  );
};

const MainStack = () => {
  const { isAuthenticated } = useAuth();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      setIsReady(true);
    };

    checkAuth();
  }, [isAuthenticated]);

  if (!isReady) {
    return null;
  }

  return (
    <Stack.Navigator
      initialRouteName={isAuthenticated ? "MainTabs" : "Login"}
      screenOptions={{ headerShown: false }}
    >
      {isAuthenticated ? (
        <>
          <Stack.Screen name="MainTabs" component={MainTabNavigator} />
          <Stack.Screen name="Apartment" component={ApartmentScreen} />
          <Stack.Screen
            name="CreateApartmentForm"
            component={CreateApartmentForm}
          />
          <Stack.Screen name="CreateBlockForm" component={CreateBlockForm} />
          <Stack.Screen name="UpdateBlockForm" component={UpdateBlockForm} />
          <Stack.Screen
            name="UpdateApartmentForm"
            component={UpdateApartmentForm}
          />
          <Stack.Screen name="ServiceForm" component={ServiceForm} />
          <Stack.Screen
            name="ServiceDetailForm"
            component={ServiceDetailForm}
          />
          <Stack.Screen
            name="CreateInvoiceForm"
            component={CreateInvoiceForm}
          />
          <Stack.Screen
            name="UpdateInvoiceForm"
            component={UpdateInvoiceForm}
          />
          <Stack.Screen
            name="InvoiceSettingForm"
            component={InvoiceSettingForm}
          />
          <Stack.Screen
            name="EditAccountScreen"
            component={EditAccountScreen}
          />
          <Stack.Screen
            name="CreateContractForm"
            component={CreateContractScreen}
          />
          <Stack.Screen
            name="ContractDetailsForm"
            component={ContractDetailsForm}
          />
          <Stack.Screen
            name="CreateRenterRecordForm"
            component={CreateRenterRecordForm}
          />
          <Stack.Screen
            name="UpdateRentalRecordForm"
            component={UpdateRentalRecordForm}
          />
          <Stack.Screen name="UpdateRenterForm" component={UpdateRenterForm} />
          <Stack.Screen name="UpdateOwnerForm" component={UpdateOwnerForm} />
          <Stack.Screen
            name="ChangePasswordScreen"
            component={ChangePasswordScreen}
          />
          <Stack.Screen
            name="NotificationScreen"
            component={NotificationsScreen}
          />
        </>
      ) : (
        <>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen
            name="ForgetPassword"
            component={ForgetPasswordScreen}
          />
        </>
      )}
    </Stack.Navigator>
  );
};

export default App;
