import axios from "axios";
import { API } from "../constant/constant";

const serviceApi = () => {
  const BASE_URL = API + `/master/api/services`;
  const token = localStorage.getItem("token");
  
  return {
    getAllServices: async () => {
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
        throw new Error(`Error fetching services: ${error}`);
      }
    },

    getServiceById: async (id) => {
      try {
        const response = await axios.get(`${BASE_URL}/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        return response.data;
      } catch (error) {
        throw new Error(`Error fetching service with ID ${id}: ${error}`);
      }
    },

    createService: async (newService) => {
      try {
        const response = await axios.post(`${BASE_URL}`, newService, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        return response.data;
      } catch (error) {
        throw new Error(`Error creating service: ${error}`);
      }
    },

    updateService: async (id, updatedService) => {
      try {
        const response = await axios.put(`${BASE_URL}/${id}`, updatedService, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        return response.data;
      } catch (error) {
        throw new Error(`Error updating service with ID ${id}: ${error}`);
      }
    },

    deleteService: async (id) => {
      try {
        await axios.delete(`${BASE_URL}/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      } catch (error) {
        throw new Error(`Error deleting service with ID ${id}: ${error}`);
      }
    },
  };
};

export default serviceApi;
