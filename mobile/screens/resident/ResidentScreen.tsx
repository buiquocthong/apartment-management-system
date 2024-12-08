import React, { useState, useCallback, useMemo } from "react";
import { Dimensions, StyleSheet } from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { TabView, TabBar } from "react-native-tab-view";

import LoadingModal from "../../components/modal/LoadingModal";
import CustomHeader from "../../components/CustomHeader";
import ResidentsTab from "./tabs/ResidentsTab";
import OwnersTab from "./tabs/OwnersTab";
import RentersTab from "./tabs/RentersTab";
import ErrorModal from "../../components/modal/ErrorModal";

import color from "../../assets/theme/colors";
import theme from "../../assets/theme/theme";
import { useApiServices } from "../../hooks/useApiServices";
import { useResidentData } from "../../hooks/useResidentData";

const ResidentScreen = () => {
  const navigation = useNavigation();
  const apis = useApiServices();

  // Tab state
  const [index, setIndex] = useState(0);
  const routes = useMemo(
    () => [
      { key: "residents", title: "Residents" },
      { key: "owners", title: "Owners" },
      { key: "renters", title: "Renters" },
    ],
    []
  );

  // Data hooks
  const {
    residentsData,
    ownersData,
    rentersData,
    loading,
    error,
    fetchResidentsData,
    fetchOwnersData,
    fetchRentersData,
    clearError,
  } = useResidentData(apis);

  // Refresh handler
  const handleRefresh = useCallback(() => {
    const refreshFunctions = {
      residents: () => fetchResidentsData(true),
      owners: () => fetchOwnersData(true),
      renters: () => fetchRentersData(true),
    };

    refreshFunctions[routes[index].key as keyof typeof refreshFunctions]?.();
  }, [index, routes, fetchResidentsData, fetchOwnersData, fetchRentersData]);

  // Initial data load
  useFocusEffect(
    useCallback(() => {
      if (!apis) return;

      const loadData = async () => {
        try {
          await Promise.all([
            fetchResidentsData(),
            fetchOwnersData(),
            fetchRentersData(),
          ]);
        } catch (err) {
          console.log("Error loading initial data:", err);
        }
      };

      loadData();
    }, [apis, fetchResidentsData, fetchOwnersData, fetchRentersData])
  );

  // Tab rendering
  const renderScene = useMemo(() => {
    const scenes = {
      residents: <ResidentsTab {...residentsData} onRefresh={handleRefresh} />,
      owners: <OwnersTab {...ownersData} onRefresh={handleRefresh} />,
      renters: <RentersTab {...rentersData} onRefresh={handleRefresh} />,
    };

    return ({ route }: { route: { key: string } }) =>
      scenes[route.key as keyof typeof scenes] || null;
  }, [residentsData, ownersData, rentersData, handleRefresh]);

  // Tab bar rendering
  const renderTabBar = useMemo(() => {
    return (props: any) => (
      <TabBar
        {...props}
        indicatorStyle={styles.tabIndicator}
        style={styles.tabBar}
        labelStyle={styles.tabLabel}
        activeColor={color.blue}
        inactiveColor={color.gray}
      />
    );
  }, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      <CustomHeader
        title="Resident Management"
        onBackPress={navigation.goBack}
      />
      <TabView
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={{ width: Dimensions.get("window").width }}
        renderTabBar={renderTabBar}
        lazy
      />
      <LoadingModal visible={loading} />
      <ErrorModal
        visible={!!error}
        message={error || ""}
        onClose={clearError}
        titleMessage={""}
      />
    </SafeAreaView>
  );
};

export default ResidentScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  tabBar: {
    backgroundColor: "white",
    elevation: 4,
  },
  tabLabel: {
    fontFamily: theme.fonts.bold,
    textTransform: "capitalize",
  },
  tabIndicator: {
    backgroundColor: color.blue,
    height: 3,
  },
});
