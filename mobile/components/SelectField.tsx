import React, { useState } from "react";
import { View, Text } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { renderLabel } from "./RenderLabel";
import { styles } from "./style";

interface SelectFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: Array<{ label: string; value: string }>;
  required?: boolean;
  error?: string;
}

export const SelectField = ({
  label,
  value,
  onChange,
  options,
  required = false,
  error,
}: SelectFieldProps) => {
  const [touched, setTouched] = useState(false);
  const showError = touched && required && !value;

  return (
    <>
      {renderLabel({ label, required })}
      <View style={[styles.picker, showError && styles.inputError]}>
        <Picker
          selectedValue={value}
          onValueChange={(itemValue) => {
            onChange(itemValue);
            setTouched(true);
          }}
        >
          <Picker.Item label={`Select ${label}`} value="" />
          {options.map(({ label, value }) => (
            <Picker.Item key={value} label={label} value={value} />
          ))}
        </Picker>
      </View>
      {showError && (
        <Text style={styles.errorText}>{error || `${label} is required`}</Text>
      )}
    </>
  );
};
