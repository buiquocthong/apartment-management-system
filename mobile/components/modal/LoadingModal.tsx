import React from "react";
import { Modal, ActivityIndicator, View } from "react-native";

interface LoadingModalProps {
  visible: boolean;
}

const LoadingModal: React.FC<LoadingModalProps> = ({ visible }) => {
  return (
    <Modal transparent={true} animationType="none" visible={visible}>
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "rgba(0, 0, 0, 0.5)",
        }}
      >
        <ActivityIndicator size="large" color="#fff" />
      </View>
    </Modal>
  );
};

export default LoadingModal;
