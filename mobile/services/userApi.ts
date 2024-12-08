import axios from "axios";
import { IService, IServiceRequest } from "../utils/type";
import { API } from "../constant/constant";

const userApi = (token: string) => {
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
        if (axios.isAxiosError(error)) {
          console.log("Response data:", error.response?.data);
          console.log("Response status:", error.response?.status);
          console.log("Response headers:", error.response?.headers);
        } else {
          console.log("Error:", error);
        }
        throw new Error(`Error fetching services: ${error}`);
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
        throw new Error(`Error fetching service with ID ${id}: ${error}`);
      }
    },

    createService: async (
      newservice: Omit<IServiceRequest, "id">
    ): Promise<IService> => {
      try {
        const response = await axios.post<IService>(`${BASE_URL}`, newservice, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        return response.data;
      } catch (error) {
        throw new Error(`Error creating service: ${error}`);
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
        throw new Error(`Error updating service with ID ${id}: ${error}`);
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
        throw new Error(`Error deleting service with ID ${id}: ${error}`);
      }
    },
  };
};

export default userApi;
