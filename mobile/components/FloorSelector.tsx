import { Picker } from "@react-native-picker/picker";
import React from "react";
import { View, StyleSheet } from "react-native";
import { IFloor } from "../utils/type";
import theme from "../assets/theme/theme";

interface FloorSelectorProps {
  floors: IFloor[];
  selectedFloor: string;
  onSelectFloor: (floor: IFloor) => void;
}

const FloorSelector: React.FC<FloorSelectorProps> = ({
  floors,
  selectedFloor,
  onSelectFloor,
}) => {
  return (
    <View style={styles.dropdownContainer}>
      <Picker
        selectedValue={selectedFloor}
        style={styles.dropdown}
        onValueChange={(itemValue: string) => {
          const selectedFloorObj = floors.find(
            (floor) => floor.floor_id === itemValue
          );
          if (selectedFloorObj) {
            onSelectFloor(selectedFloorObj);
          }
        }}
      >
        <Picker.Item label="Select floor" value="" style={styles.item} />
        {floors.map((floor) => (
          <Picker.Item
            style={styles.item}
            key={floor.floor_id}
            label={`Floor ${floor.floor_number}`}
            value={floor.floor_id}
          />
        ))}
      </Picker>
    </View>
  );
};

const styles = StyleSheet.create({
  dropdownContainer: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    backgroundColor: "#fff",
    height: 50,
    justifyContent: "center",
  },
  dropdown: {
    height: 50,
    color: "#000",
  },
  item: {
    fontSize: 16,
    fontFamily: theme.fonts.semiBold,
  },
});

export default FloorSelector;
