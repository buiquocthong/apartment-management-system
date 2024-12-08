import axios from "axios";
import { API } from "../constant/constant";

const invoiceApi = () => {
  const BASE_URL = API + `/master/api/invoices`;
  const token = localStorage.getItem("token");
  
  return {
    getAllInvoices: async () => {
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

    getInvoiceById: async (id) => {
      try {
        const response = await axios.get(`${BASE_URL}/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        return response.data;
      } catch (error) {
        throw new Error(`Error fetching invoice with ID ${id}: ${error}`);
      }
    },

    createInvoice: async (newInvoice) => {
      try {
        const response = await axios.post(`${BASE_URL}`, newInvoice, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        return response.data;
      } catch (error) {
        throw new Error(`Error creating invoice: ${error}`);
      }
    },

    updateInvoice: async (id, updatedInvoice) => {
      try {
        const response = await axios.put(`${BASE_URL}/${id}`, updatedInvoice, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        return response.data;
      } catch (error) {
        throw new Error(`Error updating invoice with ID ${id}: ${error}`);
      }
    },

    deleteInvoice: async (id) => {
      try {
        await axios.delete(`${BASE_URL}/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      } catch (error) {
        throw new Error(`Error deleting invoice with ID ${id}: ${error}`);
      }
    },

    approvedInvoice: async (id) => {
      try {
        const response = await axios.put(
          `${BASE_URL}/approved/${id}`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        return response.data;
      } catch (error) {
        if (axios.isAxiosError(error)) {
          console.error("Response data:", error.response?.data);
          console.error("Response status:", error.response?.status);
          throw new Error(error.response?.data?.message || `Error collecting payment for invoice with ID ${id}`);
        }
        throw new Error(`Error collecting payment for invoice with ID ${id}: ${error}`);
      }
    },
  };
};

export default invoiceApi;