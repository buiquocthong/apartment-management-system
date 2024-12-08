import axios from "axios";
import { IApartment, IApartmentRequest } from "../utils/type";
import { API } from "../constant/constant";
import handleUnauthorizedError from "../utils/handleUnauthorizedError";

const ownerApi = (token: string, handleLogout: () => void) => {
  const BASE_URL = API + `/master/api/owners`;

  return {
    getAllOwners: async () => {
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

    getOwnerById: async (id: string) => {
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

    createOwner: async (
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

    updateOwner: async (
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

    deleteOwner: async (id: string) => {
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

export default ownerApi;
