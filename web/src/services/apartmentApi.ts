import axios from "axios";
import { API } from "../constant/constant";

const apartmentApi = () => {
  const BASE_URL = API + `/master/api/apartments`;
  const token = localStorage.getItem("token");

  return {
    getAllApartment: async () => {
      try {
        const response = await axios.get(`${BASE_URL}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        return response.data.items;
      } catch (error) {
        throw error;
      }
    },

    getApartmentById: async (id) => {
      try {
        const response = await axios.get(`${BASE_URL}/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        return response.data;
      } catch (error) {
        throw error;
      }
    },

    createApartment: async (newBlock) => {
      try {
        const response = await axios.post(`${BASE_URL}`, newBlock, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        return response.data;
      } catch (error) {
        throw error;
      }
    },

    updateApartment: async (id, updatedBlock) => {
      try {
        const response = await axios.put(`${BASE_URL}/${id}`, updatedBlock, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        return response.data;
      } catch (error) {
        throw error;
      }
    },

    deleteApartment: async (id) => {
      try {
        await axios.delete(`${BASE_URL}/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      } catch (error) {
        throw error;
      }
    },
  };
};

export default apartmentApi;
