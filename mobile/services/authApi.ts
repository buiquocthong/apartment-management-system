import axios from 'axios';
import qs from 'qs';
import { ILogIn, ILoginResponse } from '../utils/type';
import { API } from '../constant/constant'; 

export const login = async (credentials: ILogIn): Promise<ILoginResponse> => {
  const response = await axios.post<ILoginResponse>(API + '/identity/global/auth/token', qs.stringify({
    username: credentials.username,
    password: credentials.password
  }), {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });
  return response.data;
};


export const forgetPassword = async (email: string) => {
  try {
    const response = await axios.put(
      `${API}/identity/global/reset_password`,
      {
        email: email
      },
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
    return response.data;
  } catch (error) {
    console.log('Error resetting password:', error);
    throw error;
  }
};


// axios.interceptors.response.use(
//   response => response,
//   error => {
//     console.log('Error:', error);
//     return Promise.reject(error);
//   }
// );
// `${API}/global/auth/token`
