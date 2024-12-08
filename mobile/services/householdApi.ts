import axios from "axios";
import { API } from "../constant/constant";
import handleUnauthorizedError from "../utils/handleUnauthorizedError";

const householdApi = (token: string, handleLogout: () => void) => {
  const BASE_URL = API + `/master/api/households`;

  return {
    getAllHousehold: async () => {
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
  };
};
export default householdApi;
