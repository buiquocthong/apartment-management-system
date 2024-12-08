import axios from "axios";
import { API } from "../constant/constant";

const renterRecordApi = () => {
  const BASE_URL = `${API}/master/api/records`; 
  const token = localStorage.getItem("token");

  if (!token) throw new Error("Authentication token not found. Please log in.");

  return {
    getAllRecords: async () => {
        try {
          const response = await axios.get(`${BASE_URL}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          return response.data.items;
        } catch (error) {
          if (axios.isAxiosError(error)) {
            console.error("Response data:", error.response?.data);
            console.error("Response status:", error.response?.status);
            console.error("Response headers:", error.response?.headers);
          } else {
            console.error("Error:", error);
          }
          throw new Error(`Error fetching records: ${error}`);
        }
      },
      
    createRenterRecord: async (newRenterRecord) => {
      try {
        const response = await axios.post(BASE_URL, newRenterRecord, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        return response.data;
      } catch (error) {
        const message = error.response?.data?.message || error.message;
        throw new Error(`Error creating renter record: ${message}`);
      }
    },

    updateRenterRecord: async (id, updatedRenterRecord) => {
      try {
        const response = await axios.put(`${BASE_URL}/${id}`, updatedRenterRecord, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        return response.data;
      } catch (error) {
        const message = error.response?.data?.message || error.message;
        throw new Error(`Error updating renter record with ID ${id}: ${message}`);
      }
    },

    deleteRenterRecord: async (id) => {
      try {
        await axios.delete(`${BASE_URL}/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        return true;
      } catch (error) {
        const message = error.response?.data?.message || error.message;
        throw new Error(`Error deleting renter record with ID ${id}: ${message}`);
      }
    },
  };
};

export default renterRecordApi;
