import IFilament from "../models/IFilament";
import useFetch from "./use-fetch";

const apiURL = `${process.env.REACT_APP_API_BASE_URL}filament/`;

const useFilament = () => {
  const p = useFetch<IFilament[]>(apiURL, { reloadTime: 30 });

  return { filament: p.data, isLoading: p.isLoading, refresh: p.refresh };
};

export default useFilament;
