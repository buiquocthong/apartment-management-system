import { useState, useCallback } from 'react';

type DialogType = 'success' | 'error' | 'info' | 'warning';

interface DialogOptions {
  type?: DialogType;
  title?: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  showCancelButton?: boolean;
  onConfirm?: () => void;
}

export const useDialog = () => {
  const [visible, setVisible] = useState(false);
  const [dialogConfig, setDialogConfig] = useState<DialogOptions>({
    message: '',
  });

  const showDialog = useCallback((options: DialogOptions) => {
    setDialogConfig(options);
    setVisible(true);
  }, []);

  const hideDialog = useCallback(() => {
    setVisible(false);
  }, []);

  return {
    visible,
    dialogConfig,
    showDialog,
    hideDialog,
  };
};