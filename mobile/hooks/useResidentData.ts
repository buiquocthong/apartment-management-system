import { useState, useCallback } from 'react';
import { 
  IApartment, 
  IResident, 
  IOwner, 
  IRenter 
} from '../utils/type';

interface ResidentDataState {
  apartments: IApartment[];
  apartmentResidents: Record<string, IResident[]>;
  isLoading: boolean;
  isRefreshing: boolean;
}

interface OwnerDataState {
  apartments: any[];
  apartmentOwners: Record<string, IOwner[]>;
  isLoading: boolean;
  isRefreshing: boolean;
}

interface RenterDataState {
  apartments: IApartment[];
  apartmentRenters: Record<string, IRenter[]>;
  isLoading: boolean;
  isRefreshing: boolean;
}

export const useResidentData = (apis: any) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [residentsData, setResidentsData] = useState<ResidentDataState>({
    apartments: [],
    apartmentResidents: {},
    isLoading: false,
    isRefreshing: false,
  });

  const [ownersData, setOwnersData] = useState<OwnerDataState>({
    apartments: [],
    apartmentOwners: {},
    isLoading: false,
    isRefreshing: false,
  });

  const [rentersData, setRentersData] = useState<RenterDataState>({
    apartments: [],
    apartmentRenters: {},
    isLoading: false,
    isRefreshing: false,
  });

  const fetchResidentsData = useCallback(async (isRefreshing = false) => {
    if (!apis) return;

    setResidentsData(prev => ({
      ...prev,
      isLoading: !isRefreshing,
      isRefreshing,
    }));

    try {
      const fetchedApartments = await apis.apartment.getAllApartment();
      const soldApartments = fetchedApartments.filter((apt: { status: string; }) => apt.status === "SOLD");

      const residentsPromises = soldApartments.map((apartment: { apartment_id: any; }) => 
        apis.apartment.getApartmentById(apartment.apartment_id)
      );

      const apartmentDetails = await Promise.all(residentsPromises);
      
      const filteredApartments: IApartment[] = [];
      const residentsData: Record<string, IResident[]> = {};

      apartmentDetails.forEach((details, index) => {
        if (details.residents?.length > 0) {
          filteredApartments.push(soldApartments[index]);
          residentsData[soldApartments[index].apartment_id] = details.residents;
        }
      });

      setResidentsData({
        apartments: filteredApartments,
        apartmentResidents: residentsData,
        isLoading: false,
        isRefreshing: false,
      });
    } catch (err) {
      setError("Error fetching residents data");
      setResidentsData(prev => ({
        ...prev,
        isLoading: false,
        isRefreshing: false,
      }));
    }
  }, [apis]);


  const fetchOwnersData = useCallback(async (isRefreshing = false) => {
    if (!apis) return;
  
    setOwnersData((prev) => ({
      ...prev,
      isLoading: !isRefreshing,
      isRefreshing,
    }));
  
    try {
      const [fetchedApartments, households] = await Promise.all([
        apis.apartment.getAllApartment(),
        apis.household.getAllHousehold(),
      ]);
  
      const soldApartments = fetchedApartments.filter(
        (apt: { status: string }) => apt.status === "SOLD"
      );
  
      const filteredApartments: any[] = [];
      const ownersData: Record<string, IOwner[]> = {};
  
      await Promise.all(
        soldApartments.map(async (apartment: { apartment_id: string }) => {
          try {
            const apartmentDetails = await apis.apartment.getApartmentById(
              apartment.apartment_id
            );
  
            if (apartmentDetails.owner?.owner_id) {
              const ownerDetails = await apis.owner.getOwnerById(
                apartmentDetails.owner.owner_id
              );
  
              if (ownerDetails.household?.household_id) {
                const matchingHousehold = households.find(
                  (h: { household_id: string }) =>
                    h.household_id === ownerDetails.household.household_id
                );
  
                if (matchingHousehold?.owners?.length > 0) {
                  const apartmentWithHousehold = {
                    ...apartment,
                    household_id: ownerDetails.household.household_id,
                  };

                  filteredApartments.push(apartmentWithHousehold);
                  ownersData[apartment.apartment_id] = matchingHousehold.owners;
                }
              }
            }
          } catch (error) {
            console.error(
              `Error fetching details for apartment ${apartment.apartment_id}:`,
              error
            );
          }
        })
      );
  
      setOwnersData({
        apartments: filteredApartments,
        apartmentOwners: ownersData,
        isLoading: false,
        isRefreshing: false,
      });
    } catch (err) {
      console.error("Error fetching owners data:", err);
      setError("Error fetching owners data");
      setOwnersData((prev) => ({
        ...prev,
        isLoading: false,
        isRefreshing: false,
      }));
    }
  }, [apis]);

  const fetchRentersData = useCallback(async (isRefreshing = false) => {
    if (!apis) return;
  
    setRentersData((prev) => ({
      ...prev,
      isLoading: !isRefreshing,
      isRefreshing,
    }));
  
    try {
      const fetchedRecords = await apis.rentalRecord.getAllRecords();
  
      const activeRecords = fetchedRecords.filter(
        (record: { end_date: string }) => new Date(record.end_date) > new Date()
      );
  
      const apartmentRenters: Record<string, IRenter[]> = {};
  
      activeRecords.forEach((record: any) => {
        if (record.owner?.apartment?.apartment_id && record.renters?.length) {
          const apartmentId = record.owner.apartment.apartment_id;
  
          if (!apartmentRenters[apartmentId]) {
            apartmentRenters[apartmentId] = [];
          }
  
          record.renters.forEach((renter: IRenter) => {
            if (
              !apartmentRenters[apartmentId].some(
                (existingRenter) => existingRenter.renter_id === renter.renter_id
              )
            ) {
              apartmentRenters[apartmentId].push(renter);
            }
          });
        }
      });
  
      const apartments = Object.keys(apartmentRenters).map((apartmentId) => {
        const matchedRecord = activeRecords.find(
          (record: any) =>
            record.owner?.apartment?.apartment_id === apartmentId
        );
  
        return {
          apartment_id: apartmentId,
          ...matchedRecord?.owner?.apartment,
          record: matchedRecord,
        };
      });
  
      setRentersData({
        apartments,
        apartmentRenters,
        isLoading: false,
        isRefreshing: false,
      });
    } catch (err) {
      console.error("Error fetching renters data:", err);
      setError("Error fetching renters data");
      setRentersData((prev) => ({
        ...prev,
        isLoading: false,
        isRefreshing: false,
      }));
    }
  }, [apis]);
  
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    residentsData,
    ownersData,
    rentersData,
    loading,
    error,
    fetchResidentsData,
    fetchOwnersData,
    fetchRentersData,
    clearError,
  };
};