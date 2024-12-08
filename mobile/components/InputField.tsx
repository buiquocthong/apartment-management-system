import React, { useState } from "react";
import { TextInput, Text, View, StyleSheet } from "react-native";
import { renderLabel } from "./RenderLabel";
import { styles } from "./style";

interface InputFieldProps {
  label: string;
  value: string;
  onChange: (text: string) => void;
  placeholder?: string;
  keyboardType?: "default" | "numeric" | "email-address";
  required?: boolean;
  error?: string;
  multiline?: boolean;
}

export const InputField = ({
  label,
  value,
  onChange,
  placeholder,
  keyboardType = "default",
  required = false,
  error,
  multiline = false,
}: InputFieldProps) => {
  const [touched, setTouched] = useState(false);
  const showError = touched && required && !value;

  return (
    <>
      {renderLabel({ label, required })}
      <TextInput
        style={[styles.input, showError && styles.inputError]}
        value={value}
        onChangeText={onChange}
        placeholder={placeholder}
        keyboardType={keyboardType}
        onBlur={() => setTouched(true)}
        multiline={multiline}
      />
      {showError && (
        <Text style={styles.errorText}>{error || `${label} is required`}</Text>
      )}
    </>
  );
};
