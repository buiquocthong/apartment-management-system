import React, { useEffect, useState, useCallback, useMemo } from "react";
import { Text, FlatList, StyleSheet, Dimensions } from "react-native";
import {
  NavigationProp,
  RouteProp,
  useFocusEffect,
  useNavigation,
  useRoute,
} from "@react-navigation/native";
import { IApartment, IBlock, IContractRequest, IFloor } from "../../utils/type";
import { useAuth } from "../../services/AuthContext";
import blockApi from "../../services/blockApi";
import { TabView, TabBar } from "react-native-tab-view";
import theme from "../../assets/theme/theme";
import color from "../../assets/theme/colors";
import ApartmentItem from "../../components/ApartmentItem";
import LoadingModal from "../../components/modal/LoadingModal";
import CustomHeader from "../../components/CustomHeader";
import FloatingActionButton from "../../components/FloatingActionButton";
import { SafeAreaView } from "react-native-safe-area-context";
import apartmentApi from "../../services/apartmentApi";
import contractApi from "../../services/contractApi";
import rentalRecordApi from "../../services/rentalRecordApi";
import { RootStackParamList } from "../../navigation/RootStackParamList";

interface ApartmentScreenRouteParams {
  block_id: string;
}
interface RouteScene {
  key: string;
  title: string;
}

const ApartmentScreen: React.FC = () => {
  const route =
    useRoute<RouteProp<{ params: ApartmentScreenRouteParams }, "params">>();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const { token, handleLogout } = useAuth();

  // States
  const [block, setBlock] = useState<IBlock>();
  const [floors, setFloors] = useState<IFloor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [index, setIndex] = useState(0);
  const [routes, setRoutes] = useState<{ key: string; title: string }[]>([]);

  const { block_id } = route.params;

  // Memoized API instances
  const apis = useMemo(() => {
    if (!token) return null;

    return {
      apartment: apartmentApi(token, handleLogout),
      contract: contractApi(token, handleLogout),
      rentalRecord: rentalRecordApi(token, handleLogout),
      block: blockApi(token, handleLogout),
    };
  }, [token, handleLogout]);

  const fetchApartments = useCallback(async () => {
    if (!apis?.block) {
      setError("No authentication token found");
      setLoading(false);
      return;
    }

    try {
      const fetchedBlock = await apis.block.getBlockById(block_id);
      setBlock(fetchedBlock);
      setFloors(fetchedBlock.floor);

      const floorRoutes = fetchedBlock.floor.map((floor, idx) => ({
        key: String(idx),
        title: `Floor ${floor.floor_number}`,
      }));
      setRoutes(floorRoutes);
    } catch (err) {
      console.log(err);
      setError("Error fetching blocks");
    } finally {
      setLoading(false);
    }
  }, [block_id, apis]);

  const handleDeleteApartment = useCallback(
    async (apartmentId: string) => {
      if (!apis?.apartment) {
        setError("No authentication token found");
        return;
      }

      try {
        await apis.apartment.deleteApartment(apartmentId);
        alert("Delete apartment successfully");
        fetchApartments();
      } catch (error) {
        setError("Error deleting apartment");
      }
    },
    [apis, fetchApartments]
  );

  const handleCreateContract = useCallback(
    async (contract: IContractRequest) => {
      if (!apis?.contract) {
        setError("No authentication token found");
        return;
      }

      try {
        await apis.contract.createContract(contract);
        alert("Create contract successfully");
        fetchApartments();
      } catch (error) {
        setError("Error creating contract");
      }
    },
    [apis, fetchApartments]
  );

  const keyExtractor = useCallback((item: any) => item.apartment_id, []);

  const getItemLayout = useCallback(
    (data: any, index: number) => ({
      length: 280,
      offset: 280 * index,
      index,
    }),
    []
  );

  const renderItem = useCallback(
    ({ item }: { item: IApartment }) => (
      <ApartmentItem
        apartment={item}
        block_id={block_id}
        floor_id={floors[index]?.floor_id}
        onDeleteApartment={handleDeleteApartment}
        onCreateContract={handleCreateContract}
      />
    ),
    [block_id, floors, index, handleDeleteApartment, handleCreateContract]
  );

  const renderScene = useCallback(
    ({ route }: { route: RouteScene }) => {
      const floorIndex = parseInt(route.key, 10);
      const apartments = floors[floorIndex]?.apartments || [];

      return (
        <FlatList
          removeClippedSubviews={true}
          windowSize={5}
          maxToRenderPerBatch={5}
          updateCellsBatchingPeriod={30}
          initialNumToRender={7}
          data={apartments}
          keyExtractor={keyExtractor}
          renderItem={renderItem}
          getItemLayout={getItemLayout}
          contentContainerStyle={styles.listContainer}
        />
      );
    },
    [floors, keyExtractor, renderItem, getItemLayout]
  );

  const renderTabBar = useCallback(
    (props: any) => (
      <TabBar
        {...props}
        indicatorStyle={styles.indicator}
        style={styles.tabBar}
        labelStyle={styles.tabLabel}
        activeColor={color.blue}
        inactiveColor={color.gray}
        scrollEnabled={true}
        tabStyle={styles.tabStyle}
      />
    ),
    []
  );

  useEffect(() => {
    fetchApartments();
  }, [fetchApartments]);

  useFocusEffect(
    useCallback(() => {
      fetchApartments();
    }, [fetchApartments])
  );

  if (error) {
    return <Text style={styles.errorText}>Error: {error}</Text>;
  }

  return (
    <SafeAreaView style={styles.container}>
      <CustomHeader
        title={`List Apartments of ${block?.name}`}
        onBackPress={() => navigation.goBack()}
      />

      <TabView
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={{ width: Dimensions.get("window").width }}
        renderTabBar={renderTabBar}
      />

      <FloatingActionButton
        onPress={() => {
          navigation.navigate("CreateApartmentForm", { block_id });
        }}
        iconName="add-outline"
      />

      <LoadingModal visible={loading} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    paddingBottom: 20,
  },
  listContainer: {
    margin: 15,
  },
  errorText: {
    color: "red",
    textAlign: "center",
    marginTop: 20,
  },
  tabBar: {
    backgroundColor: color.white,
    height: 50,
  },
  indicator: {
    backgroundColor: color.blue,
    height: 4,
  },
  tabLabel: {
    color: color.black,
    fontSize: 14,
    fontFamily: theme.fonts.bold,
  },
  tabStyle: {
    width: Dimensions.get("window").width / 3,
  },
});

export default React.memo(ApartmentScreen);
