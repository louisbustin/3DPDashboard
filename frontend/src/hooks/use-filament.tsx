import IFilament from "../models/IFilament";
import useFetch from "./use-fetch";

const apiURL = `${import.meta.env.VITE_BASE_URL}filament/`;

const useFilament = () => {
  const p = useFetch<IFilament[]>(apiURL, { reloadTime: undefined });

  return { filament: p.data, isLoading: p.isLoading, refresh: p.refresh };
};

export default useFilament;
