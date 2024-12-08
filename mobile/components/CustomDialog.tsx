// CustomDialog.tsx
import React from "react";
import { StyleSheet, View, Text, Platform } from "react-native";
import { Dialog, Portal, Button } from "react-native-paper";
import { Check, Info, AlertTriangle, X } from "lucide-react-native";

type DialogType = "success" | "error" | "info" | "warning";

interface CustomDialogProps {
  visible: boolean;
  type?: DialogType;
  title?: string;
  message: string;
  onDismiss: () => void;
  onConfirm?: () => void;
  confirmText?: string;
  cancelText?: string;
  showCancelButton?: boolean;
}

interface DialogConfig {
  icon: React.ReactNode;
  color: string;
  backgroundColor: string;
}

const DialogConfigs: Record<DialogType, DialogConfig> = {
  success: {
    icon: <Check size={24} color="#fff" />,
    color: "#10B981",
    backgroundColor: "#D1FAE5",
  },
  error: {
    icon: <X size={24} color="#fff" />,
    color: "#EF4444",
    backgroundColor: "#FEE2E2",
  },
  info: {
    icon: <Info size={24} color="#fff" />,
    color: "#3B82F6",
    backgroundColor: "#DBEAFE",
  },
  warning: {
    icon: <AlertTriangle size={24} color="#fff" />,
    color: "#F59E0B",
    backgroundColor: "#FEF3C7",
  },
};

const CustomDialog: React.FC<CustomDialogProps> = ({
  visible,
  type = "info",
  title,
  message,
  onDismiss,
  onConfirm,
  confirmText = "OK",
  cancelText = "Cancel",
  showCancelButton = false,
}) => {
  const config = DialogConfigs[type];

  return (
    <Portal>
      <Dialog visible={visible} onDismiss={onDismiss} style={styles.dialog}>
        <View style={styles.contentContainer}>
          <View
            style={[styles.iconContainer, { backgroundColor: config.color }]}
          >
            {config.icon}
          </View>

          {title && <Text style={styles.title}>{title}</Text>}

          <Text style={styles.message}>{message}</Text>

          <View style={styles.buttonContainer}>
            {showCancelButton && (
              <Button
                mode="outlined"
                onPress={onDismiss}
                style={[styles.button, styles.cancelButton]}
                labelStyle={styles.cancelButtonText}
              >
                {cancelText}
              </Button>
            )}
            <Button
              mode="contained"
              onPress={() => {
                onConfirm ? onConfirm() : onDismiss();
              }}
              style={[
                styles.button,
                { backgroundColor: config.color },
                !showCancelButton && styles.singleButton,
              ]}
              labelStyle={styles.confirmButtonText}
            >
              {confirmText}
            </Button>
          </View>
        </View>
      </Dialog>
    </Portal>
  );
};

const styles = StyleSheet.create({
  dialog: {
    borderRadius: 16,
    backgroundColor: "#fff",
    marginHorizontal: 24,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  contentContainer: {
    alignItems: "center",
    padding: 24,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1F2937",
    marginBottom: 8,
    textAlign: "center",
  },
  message: {
    fontSize: 16,
    color: "#6B7280",
    textAlign: "center",
    marginBottom: 24,
    lineHeight: 24,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "center",
    width: "100%",
    gap: 12,
  },
  button: {
    flex: 1,
    borderRadius: 8,
  },
  singleButton: {
    minWidth: 120,
    flex: 0,
  },
  cancelButton: {
    borderColor: "#D1D5DB",
  },
  cancelButtonText: {
    color: "#6B7280",
  },
  confirmButtonText: {
    color: "#fff",
  },
});

export default CustomDialog;
