import axios from "axios";
import { IContract, IContractRequest } from "../utils/type";
import { API } from "../constant/constant";
import handleUnauthorizedError from "../utils/handleUnauthorizedError";

const contractApi = (token: string, handleLogout: () => void) => {
  const BASE_URL = API + `/master/api/contracts`;

  return {
    getAllContract: async () => {
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
    getContractById: async (id: string): Promise<IContract> => {
      try {
        const response = await axios.get<IContract>(`${BASE_URL}/${id}`, {
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

    createContract: async (
      newContract: IContractRequest
    ): Promise<IContractRequest> => {
      try {
        const response = await axios.post<IContractRequest>(`${BASE_URL}`, newContract, {
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

    updateContract: async (
      id: string,
      updatedBlock: Partial<IContract>
    ): Promise<IContract> => {
      try {
        const response = await axios.put<IContract>(
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

    deleteContract: async (id: string): Promise<void> => {
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

export default contractApi;
