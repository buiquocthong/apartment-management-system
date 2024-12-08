import React, { useEffect, useState } from "react";
import { ScrollView, Text } from "react-native";
import BlockCard from "../../components/BlockCard";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import blockApi from "../../services/blockApi";
import { IBlock } from "../../utils/type";
import { useAuth } from "../../services/AuthContext";
import { SafeAreaView } from "react-native-safe-area-context";
import LoadingModal from "../../components/modal/LoadingModal";
import CustomHeader from "../../components/CustomHeader";
import FloatingActionButton from "../../components/FloatingActionButton";
import { RootStackParamList } from "../../navigation/RootStackParamList";

type BlockScreenNavigationProp = NavigationProp<RootStackParamList>;

const BlockScreen: React.FC = () => {
  const navigation = useNavigation<BlockScreenNavigationProp>();
  const { token, handleLogout } = useAuth();
  const [blocks, setBlocks] = useState<IBlock[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBlocks = async () => {
      if (!token) {
        setError("No authentication token found");
        setLoading(false);
        return;
      }

      try {
        const api = blockApi(token, handleLogout);
        const fetchedBlocks = await api.getAllBlocks();

        const formattedBlocks: IBlock[] = fetchedBlocks.map((block) => ({
          block_id: block.block_id,
          name: block.name,
          description: block.description,
          total_apartment: block.total_apartment,
          total_floor: block.total_floor,
          floor: block.floor,
          create_date: block.create_date,
          update_date: block.update_date,
        }));

        setBlocks(formattedBlocks);
      } catch (err) {
        console.log(err);
        setError("Error fetching blocks");
      } finally {
        setLoading(false);
      }
    };

    fetchBlocks();
  }, [token]);

  if (error) {
    return <Text>Error: {error}</Text>;
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <CustomHeader
        title={`List Blocks`}
        onBackPress={() => navigation.goBack()}
      />
      <ScrollView
        style={{ padding: 10 }}
        contentContainerStyle={{ paddingBottom: 10 }}
      >
        {blocks.map((block) => {
          return <BlockCard key={block.block_id} {...block} />;
        })}
      </ScrollView>
      <FloatingActionButton
        onPress={() => {
          navigation.navigate("CreateBlockForm", {});
        }}
        iconName="add-outline"
      />

      <LoadingModal visible={loading} />
    </SafeAreaView>
  );
};

export default BlockScreen;
