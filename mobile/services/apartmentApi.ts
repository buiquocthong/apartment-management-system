import axios from "axios";
import { IApartment, IApartmentRequest } from "../utils/type";
import { API } from "../constant/constant";
import handleUnauthorizedError from "../utils/handleUnauthorizedError";

const apartmentApi = (token: string, handleLogout: () => void) => {
  const BASE_URL = API + `/master/api/apartments`;

  return {
    getAllApartment: async (): Promise<IApartment[]> => {
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

    getApartmentById: async (id: string) => {
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

    createApartment: async (
      newBlock: IApartmentRequest
    ): Promise<IApartment> => {
      try {
        const response = await axios.post<IApartment>(`${BASE_URL}`, newBlock, {
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

    updateApartment: async (
      id: string,
      updatedBlock: Partial<IApartment>
    ): Promise<IApartment> => {
      try {
        const response = await axios.put<IApartment>(
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

    deleteApartment: async (id: string) => {
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

export default apartmentApi;
