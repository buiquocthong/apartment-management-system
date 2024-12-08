import axios from "axios";
import { IContract, IContractRequest, IRentalRecord, IRentalRecordRequest } from "../utils/type";
import { API } from "../constant/constant";
import handleUnauthorizedError from "../utils/handleUnauthorizedError";

const rentalRecordApi = (token: string, handleLogout: () => void) => {
  const BASE_URL = API + `/master/api/records`;

  return {
    getAllRecords: async () => {
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
    getAllInactiveRecords: async () => {
      try {
        const response = await axios.get(`${BASE_URL}/expired`, {
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
    getRecordById: async (id: string): Promise<IRentalRecord> => {
      try {
        const response = await axios.get<IRentalRecord>(`${BASE_URL}/${id}`, {
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

    createRecord: async (
      record: IRentalRecordRequest
    ): Promise<IRentalRecordRequest> => {
      try {
        const response = await axios.post<IRentalRecordRequest>(`${BASE_URL}`, record, {
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

    updateRecord: async (
      id: string,
      record: any
    ) => {
      try {
        const response = await axios.put(
          `${BASE_URL}/${id}`,
          record,
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

    deleteRecord: async (id: string): Promise<void> => {
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

export default rentalRecordApi;
