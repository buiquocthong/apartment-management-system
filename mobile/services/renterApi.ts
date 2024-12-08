import axios from "axios";
import { API } from "../constant/constant";
import handleUnauthorizedError from "../utils/handleUnauthorizedError";

const renterApi = (token: string, handleLogout: () => void) => {
  const BASE_URL = API + `/master/api/renters`;

  return {
    getAllRenters: async () => {
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

    getRenterById: async (id: string) => {
      try {
        const response = await axios.get(`${BASE_URL}/${id}`, {
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

    createRenter: async (
      newOwner: any
    ) => {
      try {
        const response = await axios.post(`${BASE_URL}`, newOwner, {
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

    updateRenter: async (
      id: string,
      updatedOwner: any
    ) => {
      try {
        const response = await axios.put(
          `${BASE_URL}/${id}`,
          updatedOwner,
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

    deleteRenter: async (id: string) => {
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
  };
};

export default renterApi;
