import { useState, useEffect } from "react";
import { normalizeCityName } from "../utils/utils";
import { fetchData } from "../services/api";

function useRegions() {
  const [regions, setRegions]= useState<{ code: string; name: string }[]>([]);

  useEffect(() => {
    const getRegionsAsync = async () => {
      const response = await fetchData(`/api/regions` );
      const regions = response
        .map((region: any) => ({
          code: region.code,
          name: region.name
        }))
        .sort((a : any, b : any) => a.name.localeCompare(b.name));
        
      setRegions(regions);
    };

    getRegionsAsync();
  }, []);

  return { regions };
}


function useBarangays(cityCode: string) {
  const [barangays, setBarangays] = useState<string[]>([]);

  useEffect(() => {
    const getBarangaysAsync = async () => {
      const response = await fetchData(`/api/cities-municipalities/${cityCode}/barangays` );
      const barangays = response
        .map((barangay: any) => barangay.name)
        .sort();
        
      setBarangays(barangays);
    };

    if(cityCode) getBarangaysAsync();
  }, [cityCode]);

  return { barangays };
}

function useCities(regionCode: string) {
  const [cities, setCities] = useState<{ code: string; name: string }[]>([]);

  useEffect(() => {
    const getCitiesAsync = async () => {
      const response = await fetchData(`/api/regions/${regionCode}/cities-municipalities`);
      const cities = response
        .map((city: any) => ({
          code: city.code,
          name: normalizeCityName(city.name)
        }))
        .sort((a : any, b : any) => a.name.localeCompare(b.name));
        
      setCities(cities);
    };

    if(regionCode) getCitiesAsync();
  }, [regionCode]);

  return { cities };
}

export const useAddress = () => {
  const [selectedRegion, setSelectedRegion] = useState<string>('');
  const [selectedCity, setSelectedCity] = useState<string>('');
  const { regions } = useRegions();
  const { cities } = useCities(selectedRegion);
  const { barangays } = useBarangays(selectedCity);

  return { 
    regions, 
    cities, 
    barangays, 
    selectedRegion,
    setSelectedRegion, 
    selectedCity,
    setSelectedCity
  }
}