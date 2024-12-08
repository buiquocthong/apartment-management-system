import axios from "axios";
import { API } from "../constant/constant";

const serviceDetailApi = () => {
  const BASE_URL = `${API}/master/api/service_details`;
  const token = localStorage.getItem("token");

  if (!token) throw new Error("Authentication token not found. Please log in.");

  return {
    createServiceDetail: async (newServiceDetail) => {
      try {
        const response = await axios.post(BASE_URL, newServiceDetail, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        return response.data;
      } catch (error) {
        const message = error.response?.data?.message || error.message;
        throw new Error(`Error creating service detail: ${message}`);
      }
    },

    updateServiceDetail: async (id, updatedServiceDetail) => {
      try {
        const response = await axios.put(`${BASE_URL}/${id}`, updatedServiceDetail, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        return response.data;
      } catch (error) {
        const message = error.response?.data?.message || error.message;
        throw new Error(`Error updating service detail with ID ${id}: ${message}`);
      }
    },

    deleteServiceDetail: async (id) => {
      try {
        await axios.delete(`${BASE_URL}/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        return true;
      } catch (error) {
        const message = error.response?.data?.message || error.message;
        throw new Error(`Error deleting service detail with ID ${id}: ${message}`);
      }
    },
  };
};

export default serviceDetailApi;
