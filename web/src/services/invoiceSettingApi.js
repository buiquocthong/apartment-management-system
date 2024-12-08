import axios from "axios";
import { API } from "../constant/constant";

const invoiceSettingApi = () => {
  const BASE_URL = API + `/master/api/invoice_setting`;
  const token = localStorage.getItem("token");
  
  return {
    getInvoiceSetting: async () => {
      try {
        const response = await axios.get(`${BASE_URL}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        return response.data;
      } catch (error) {
        if (axios.isAxiosError(error)) {
          console.error("Response data:", error.response?.data);
          console.error("Response status:", error.response?.status);
          console.error("Response headers:", error.response?.headers);
        } else {
          console.error("Error:", error);
        }
        throw new Error(`Error fetching invoices: ${error}`);
      }
    },

    updateInvoice: async (updatedInvoiceSetting) => {
      try {
        const response = await axios.put(`${BASE_URL}`, updatedInvoiceSetting, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        return response.data;
      } catch (error) {
        throw new Error(`Error updating invoice setting: ${error}`);
      }
    },
  };
};

export default invoiceSettingApi;