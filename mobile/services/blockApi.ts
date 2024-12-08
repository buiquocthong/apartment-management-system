import axios from 'axios';
import { IBlock, IBlockRequest } from '../utils/type';
import { API } from '../constant/constant';
import handleUnauthorizedError from '../utils/handleUnauthorizedError';

const BASE_URL = API + '/master/api/blocks';
const blockApi = (token: string, handleLogout: () => void) => {
  return {
    getAllBlocks: async (): Promise<IBlock[]> => {
      try {
        const response = await axios.get<IBlock[]>(`${BASE_URL}`, {
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

    getBlockById: async (id: string): Promise<IBlock> => {
      try {
        const response = await axios.get<IBlock>(`${BASE_URL}/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        return response.data;
      } catch (error) {
        await handleUnauthorizedError(error, handleLogout);
        throw error;      }
    },

    createBlock: async (newBlock: IBlockRequest)=> {
      try {
        const response = await axios.post(`${BASE_URL}`, newBlock, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        return response.data;
      } catch (error) {
        await handleUnauthorizedError(error, handleLogout);
        throw error;      }
    },

    updateBlock: async (id: string, updatedBlock: Partial<IBlock>): Promise<IBlock> => {
      try {
        const response = await axios.put<IBlock>(`${BASE_URL}/${id}`, updatedBlock, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        return response.data;
      } catch (error) {
        await handleUnauthorizedError(error, handleLogout);
        throw error;      }
    },

    deleteBlock: async (id: string): Promise<void> => {
      try {
        await axios.delete(`${BASE_URL}/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      } catch (error) {
        await handleUnauthorizedError(error, handleLogout);
        throw error;      }
    },
  };
};

export default blockApi;
