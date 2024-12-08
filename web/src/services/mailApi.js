import axios from "axios";
import { API } from "../constant/constant";

const mailApi = () => {
  const BASE_URL = API + `/notification/api/mails`;
  const token = localStorage.getItem("token");
  
  return {
    getAllMails: async () => {
      try {
        const response = await axios.get(`${BASE_URL}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        return response.data;
      } catch (error) {
        if (axios.isAxiosError(error)) {
          console.error("Response data:", error.response?.data);
        } else {
          console.error("Error:", error);
        }
        throw new Error(`Error fetching mails: ${error}`);
      }
    },

    createMail: async (newMail) => {
      try {
        const response = await axios.post(`${BASE_URL}`, newMail, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        return response.data;
      } catch (error) {
        throw new Error(`Error creating mail: ${error}`);
      }
    },
  };
};

export default mailApi;
