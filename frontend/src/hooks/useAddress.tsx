import { useState, useEffect } from "react";
import { normalizeCityName } from "../utils/utils";
import { fetchData } from "../services/api";

export function useRegions() {
  const [regions, setRegions]= useState<{ code: string; name: string }[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<unknown>(null);

  useEffect(() => {
    const getRegionsAsync = async () => {
      try {
        const response = await fetchData(`/api/regions` );
        const regions = response
          .map((region: any) => ({
            code: region.code,
            name: region.name
          }))
          .sort((a : any, b : any) => a.name.localeCompare(b.name));
        
        setRegions(regions);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    getRegionsAsync();
  }, []);

  return { regions, loading, error };
}


export function useBarangays(cityCode: string) {
  const [barangays, setBarangays] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<unknown>(null);

  useEffect(() => {
    const getBarangaysAsync = async () => {
      try {
        const response = await fetchData(`/api/cities-municipalities/${cityCode}/barangays` );
        const barangays = response
          .map((barangay: any) => barangay.name)
          .sort();
        
        setBarangays(barangays);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    getBarangaysAsync();
  }, [cityCode]);

  return { barangays, loading, error };
}


export function useCities(regionCode: string) {
  const [cities, setCities] = useState<{ code: string; name: string }[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<unknown>(null);

  useEffect(() => {
    const getCitiesAsync = async () => {
      try {
        const response = await fetchData(`/api/regions/${regionCode}/cities-municipalities`);
        const cities = response
          .map((city: any) => ({
            code: city.code,
            name: normalizeCityName(city.name)
          }))
          .sort((a : any, b : any) => a.name.localeCompare(b.name));
        
        setCities(cities);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    getCitiesAsync();
  }, [regionCode]);

  return { cities, loading, error };
}