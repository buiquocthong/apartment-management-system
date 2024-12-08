import { useState, useEffect } from 'react';
import { locationApi } from '../services/locationApi';
import { IDistrict, IProvince, IWard } from '../utils/type';

export const useLocationData = () => {
  const [provinces, setProvinces] = useState<IProvince[]>([]);
  const [districts, setDistricts] = useState<IDistrict[]>([]);
  const [wards, setWards] = useState<IWard[]>([]);
  
  const [selectedProvince, setSelectedProvince] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [selectedWard, setSelectedWard] = useState('');

  useEffect(() => {
    const fetchProvinces = async () => {
      try {
        const data = await locationApi.getProvinces();
        setProvinces(data);
      } catch (error) {
        console.error('Error fetching provinces:', error);
      }
    };
    fetchProvinces();
  }, []);

  useEffect(() => {
    const fetchDistricts = async () => {
      if (selectedProvince) {
        try {
          const data = await locationApi.getDistricts(selectedProvince);
          setDistricts(data);
          setSelectedDistrict(''); // Reset district
          setSelectedWard('');     // Reset ward khi province thay đổi
        } catch (error) {
          console.error('Error fetching districts:', error);
        }
      } else {
        setDistricts([]);
        setSelectedDistrict(''); 
        setWards([]);
        setSelectedWard('');     
      }
    };
    fetchDistricts();
  }, [selectedProvince]);
  
  useEffect(() => {
    const fetchWards = async () => {
      if (selectedDistrict) {
        try {
          const data = await locationApi.getWards(selectedDistrict);
          setWards(data);
          setSelectedWard(''); 
        } catch (error) {
          console.error('Error fetching wards:', error);
        }
      } else {
        setWards([]);
        setSelectedWard(''); 
      }
    };
    fetchWards();
  }, [selectedDistrict]);
  

  return {
    provinces,
    districts,
    wards,
    selectedProvince,
    selectedDistrict,
    selectedWard,
    setSelectedProvince,
    setSelectedDistrict,
    setSelectedWard
  };
};