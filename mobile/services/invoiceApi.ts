import axios from "axios";
import { ICreateInvoice, IInvoice } from "../utils/type";
import { API } from "../constant/constant";
import handleUnauthorizedError from "../utils/handleUnauthorizedError";

const invoiceApi = (token: string, handleLogout: () => void) => {
  const BASE_URL = API + `/master/api/invoices`;

  return {
    getAllInvoice: async () => {
      try {
        const response = await axios.get(`${BASE_URL}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        return response.data.items;
      } catch (error) {
        await handleUnauthorizedError(error, handleLogout);
        throw error;
      }
    },
    getInvoiceById: async (id: number): Promise<IInvoice> => {
      try {
        const response = await axios.get<IInvoice>(`${BASE_URL}/${id}`, {
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

    createInvoice: async (
      newBlock: any
    ) => {
      try {
        const response = await axios.post(`${BASE_URL}`, newBlock, {
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

    updateInvoice: async (
      id: string,
      updatedBlock: any
    ) => {
      try {
        const response = await axios.put(
          `${BASE_URL}/${id}`,
          updatedBlock,
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

    deleteInvoice: async (id: string): Promise<void> => {
      try {
        await axios.delete(`${BASE_URL}/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      } catch (error) {
        await handleUnauthorizedError(error, handleLogout);
        throw error;
      }
    },
    approvedInvoice: async (id: string): Promise<void> => {
      try {
        await axios.put(`${BASE_URL}/approved/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      } catch (error) {
        await handleUnauthorizedError(error, handleLogout);
        throw error;
      }
    },
  };
};

export default invoiceApi;
