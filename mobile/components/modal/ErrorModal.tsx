import React from "react";
import { Modal, View, Text, TouchableOpacity } from "react-native";
import theme from "../../assets/theme/theme";

interface ErrorModalProps {
  visible: boolean;
  onClose: () => void;
  titleMessage: string;
  message: string;
}

const ErrorModal: React.FC<ErrorModalProps> = ({
  visible,
  onClose,
  titleMessage,
  message,
}) => {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "rgba(0, 0, 0, 0.5)",
        }}
      >
        <View
          style={{
            width: "90%",
            backgroundColor: "white",
            borderRadius: 10,
            padding: 20,
          }}
        >
          <Text
            style={{
              fontSize: 22,
              fontFamily: theme.fonts.bold,
              textAlign: "center",
              marginBottom: 10,
              color: "#FF6347",
            }}
          >
            {titleMessage}
          </Text>
          <Text
            style={{
              fontSize: 16,
              fontFamily: theme.fonts.regular,
              textAlign: "center",
              marginBottom: 20,
            }}
          >
            {message}
          </Text>
          <TouchableOpacity
            onPress={onClose}
            style={{
              backgroundColor: "#1E90FF",
              paddingVertical: 10,
              paddingHorizontal: 20,
              borderRadius: 5,
            }}
          >
            <Text
              style={{
                color: "white",
                textAlign: "center",
                fontSize: 18,
                fontFamily: theme.fonts.semiBold,
              }}
            >
              Close
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default ErrorModal;
