import React, { useState } from "react";
import { TouchableOpacity, Text } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { renderLabel } from "./RenderLabel";
import { styles } from "./style";

interface DatePickerFieldProps {
  label: string;
  value: Date | string;
  onChange: (date: Date) => void;
  required?: boolean;
  maximumDate?: Date;
  error?: string;
}

export const DatePickerField = ({
  label,
  value,
  onChange,
  required = false,
  maximumDate,
  error,
}: DatePickerFieldProps) => {
  const [show, setShow] = React.useState(false);
  const [touched, setTouched] = useState(false);
  const dateValue = typeof value === "string" ? new Date(value) : value;

  const showError = touched && required && !value;

  return (
    <>
      {renderLabel({ label, required })}
      <TouchableOpacity
        onPress={() => {
          setShow(true);
          setTouched(true);
        }}
        style={[styles.input, showError && styles.inputError]}
      >
        <Text>{dateValue.toISOString().split("T")[0]}</Text>
      </TouchableOpacity>
      {show && (
        <DateTimePicker
          value={dateValue}
          mode="date"
          display="default"
          onChange={(_, selectedDate) => {
            setShow(false);
            if (selectedDate) onChange(selectedDate);
          }}
          maximumDate={maximumDate}
        />
      )}
      {showError && (
        <Text style={styles.errorText}>{error || `${label} is required`}</Text>
      )}
    </>
  );
};
