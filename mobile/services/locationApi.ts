import axios from 'axios';
import { IDistrict, IProvince, IWard } from '../utils/type';

const baseURL = 'https://vapi.vnappmob.com';

export const locationApi = {
  async getProvinces(): Promise<IProvince[]> {
    try {
      const response = await axios.get(`${baseURL}/api/province`);
      return response.data.results; 
    } catch (error) {
      console.log("Failed to fetch provinces:", error);
      throw error; 
    }
  },

  async getDistricts(provinceId: string): Promise<IDistrict[]> {
    try {
      const response = await axios.get(`${baseURL}/api/province/district/${provinceId}`);
      return response.data.results;
    } catch (error) {
      console.log("Failed to fetch districts:", error);
      throw error;
    }
  },

  async getWards(districtId: string): Promise<IWard[]> {
    try {
      const response = await axios.get(`${baseURL}/api/province/ward/${districtId}`);
      return response.data.results;
    } catch (error) {
      console.log("Failed to fetch wards:", error);
      throw error; 
    }
  },
};
