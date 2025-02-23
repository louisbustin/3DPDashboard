import IPrinter from "../models/IPrinter";
import useFetch from "./use-fetch";

const apiURL = `${import.meta.env.VITE_BASE_URL}printers/`;

const usePrinters = () => {
  const p = useFetch<IPrinter[]>(apiURL);

  return { printers: p.data, isLoading: p.isLoading, refresh: p.refresh };
};

export default usePrinters;
