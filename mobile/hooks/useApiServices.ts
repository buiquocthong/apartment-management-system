import { useMemo } from 'react';
import { useAuth } from '../services/AuthContext';
import apartmentApi from '../services/apartmentApi';
import householdApi from '../services/householdApi';
import ownerApi from '../services/ownerApi';
import rentalRecordApi from '../services/rentalRecordApi';


export const useApiServices = () => {
  const { token, handleLogout } = useAuth();

  return useMemo(() => {
    if (!token) return null;
    
    return {
      apartment: apartmentApi(token, handleLogout),
      household: householdApi(token, handleLogout),
      owner: ownerApi(token, handleLogout),
      rentalRecord: rentalRecordApi(token, handleLogout),
    };
  }, [token, handleLogout]);
};