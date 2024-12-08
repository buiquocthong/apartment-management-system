import axios from "axios";
import { API } from "../constant/constant";
import handleUnauthorizedError from "../utils/handleUnauthorizedError";

const serviceDetailApi = (token: string, handleLogout: () => void) => {
  const BASE_URL = `${API}/master/api/service_details`;

  if (!token) throw new Error("Authentication token not found. Please log in.");

  return {
    createServiceDetail: async (newServiceDetail: any) => {
      try {
        const response = await axios.post(BASE_URL, newServiceDetail, {
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

    updateServiceDetail: async (id: string, updatedServiceDetail: any) => {
      try {
        const response = await axios.put(`${BASE_URL}/${id}`, updatedServiceDetail, {
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

    deleteServiceDetail: async (id: string) => {
      try {
        await axios.delete(`${BASE_URL}/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        return true;
      } catch (error) {
        await handleUnauthorizedError(error, handleLogout);
        throw error;
      }
    },
  };
};

export default serviceDetailApi;
