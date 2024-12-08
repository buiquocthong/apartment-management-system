export const formatNumber = (text: string): number => {
    const cleanedText = text.replace(/\./g, "").replace(/[^0-9]/g, "");
    return Number(cleanedText) || 0; 
  };
  