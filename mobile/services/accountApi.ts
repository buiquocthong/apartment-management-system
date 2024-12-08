import axios from "axios";
import { IAccount, IChangePassword, IService, IServiceRequest } from "../utils/type";
import { API } from "../constant/constant";
import handleUnauthorizedError from "../utils/handleUnauthorizedError";

const accountApi = (token: string, handleLogout: () => void) => {
  const BASE_URL = API + `/identity/api/my/account`;

  return {
    getMyAccount: async () => {
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

    updateAccount: async (id: string, updateAccount: Partial<IAccount>) => {
      try {
        const response = await axios.put<IAccount>(`${BASE_URL}/${id}`, updateAccount,
          {
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
    
    changePassword: async (
      changePassword: IChangePassword
    ) => {
      try {
        const response = await axios.put<IChangePassword>(
          `${BASE_URL}/change_password`,
          changePassword,
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
  };
};

export default accountApi;
