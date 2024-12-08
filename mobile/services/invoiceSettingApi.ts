import axios from "axios";
import { API } from "../constant/constant";
import handleUnauthorizedError from "../utils/handleUnauthorizedError";

const invoiceSettingApi = (token: string, handleLogout: () => void) => {
  const BASE_URL = API + `/master/api/invoice_setting`;

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
        await handleUnauthorizedError(error, handleLogout);
        throw error;
      }
    },

    updateInvoiceSetting: async (
      updatedInvoiceSetting: any
    ) => {
      try {
        const response = await axios.put(
          `${BASE_URL}`,
          updatedInvoiceSetting,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        return response.data;
      } catch (error) {
        await handleUnauthorizedError(error, handleLogout);
        throw error;
      }
    },
  };
};

export default invoiceSettingApi;
