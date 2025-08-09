import { useState } from "react";
import { normalizeCityName } from "../utils/utils";
import useFetch from "./useFetch";

function useRegions() {
  const { data } = useFetch(`/api/regions`);
  const regions = data?.regions ? data.regions.map((region: any) => ({
          code: region.code,
          name: region.name
        }))
        .sort((a : any, b : any) => a.name.localeCompare(b.name)) : []

  return { regions };
}


function useBarangays(cityCode: string) {
  const { data } = useFetch(`/api/cities-municipalities/${cityCode}/barangays`);
  const barangays = data?.barangays ? data.barangays.map((barangay: any) => barangay.name)
        .sort() : []

  return { barangays };
}

function useCities(regionCode: string) {
  const { data } = useFetch(`/api/regions/${regionCode}/cities-municipalities`);
  const cities = data?.cities ? data.cities.map((city: any) => ({
          code: city.code,
          name: normalizeCityName(city.name)
        }))
        .sort((a : any, b : any) => a.name.localeCompare(b.name)) : []


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