// import axios from "axios";
// import { IService, IServiceRequest } from "../utils/type";
// import { API } from "../constant/constant";

// const floorApi = (token: string) => {
//   const BASE_URL = API + `/master/api/floors`;

//   return {
//     getAllServices: async () => {
//       try {
//         const response = await axios.get(`${BASE_URL}`, {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         });
//         return response.data;
//       } catch (error) {
//         if (axios.isAxiosError(error)) {
//           console.error("Response data:", error.response?.data);
//           console.error("Response status:", error.response?.status);
//           console.error("Response headers:", error.response?.headers);
//         } else {
//           console.error("Error:", error);
//         }
//         throw new Error(`Error fetching blocks: ${error}`);
//       }
//     },
//     getServiceById: async (id: string): Promise<IService> => {
//       try {
//         const response = await axios.get<IService>(`${BASE_URL}/${id}`, {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         });
//         return response.data;
//       } catch (error) {
//         throw new Error(`Error fetching block with ID ${id}: ${error}`);
//       }
//     },

//     createService: async (
//       newBlock: Omit<IServiceRequest, "id">
//     ): Promise<IService> => {
//       try {
//         const response = await axios.post<IService>(`${BASE_URL}`, newBlock, {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         });
//         return response.data;
//       } catch (error) {
//         throw new Error(`Error creating block: ${error}`);
//       }
//     },

//     updateService: async (
//       id: string,
//       updatedService: Partial<IService>
//     ): Promise<IService> => {
//       try {
//         const response = await axios.put<IService>(
//           `${BASE_URL}/${id}`,
//           updatedService,
//           {
//             headers: {
//               Authorization: `Bearer ${token}`,
//             },
//           }
//         );
//         return response.data;
//       } catch (error) {
//         throw new Error(`Error updating block with ID ${id}: ${error}`);
//       }
//     },

//     deleteService: async (id: string): Promise<void> => {
//       try {
//         await axios.delete(`${BASE_URL}/${id}`, {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         });
//       } catch (error) {
//         throw new Error(`Error deleting block with ID ${id}: ${error}`);
//       }
//     },
//   };
// };

// export default floorApi;
