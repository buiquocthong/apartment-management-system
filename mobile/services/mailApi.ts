import axios from "axios";
import { IApartment, IApartmentRequest } from "../utils/type";
import { API } from "../constant/constant";
import handleUnauthorizedError from "../utils/handleUnauthorizedError";

const mailApi = (token: string, handleLogout: () => void) => {
  const BASE_URL = API + `/notification/api/mails`;

  return {
    getAllMails: async () => {
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

    createMail: async (
      newMail: any
    ) => {
      try {
        const response = await axios.post(`${BASE_URL}`, newMail, {
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
  };
};

export default mailApi;
