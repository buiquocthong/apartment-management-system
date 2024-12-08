import axios from "axios";
import { IService, IServiceRequest } from "../utils/type";
import { API } from "../constant/constant";
import handleUnauthorizedError from "../utils/handleUnauthorizedError";

const serviceApi = (token: string, handleLogout: () => void) => {
  const BASE_URL = API + `/master/api/services`;

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
        await handleUnauthorizedError(error, handleLogout);
        throw error;
      }
    },
    getServiceById: async (id: string): Promise<IService> => {
      try {
        const response = await axios.get<IService>(`${BASE_URL}/${id}`, {
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

    createService: async (
      newService: any
    ) => {
      try {
        const response = await axios.post(`${BASE_URL}`, newService, {
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

    updateService: async (
      id: string,
      updatedService: Partial<IService>
    ): Promise<IService> => {
      try {
        const response = await axios.put<IService>(
          `${BASE_URL}/${id}`,
          updatedService,
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

    deleteService: async (id: string): Promise<void> => {
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

export default serviceApi;
