import IPrinter from "../models/IPrinter";
import useFetch from "./use-fetch";

const apiURL = `${process.env.REACT_APP_API_BASE_URL}printers/`;

const usePrinters = () => {
  const p = useFetch<IPrinter[]>(apiURL, { reloadTime: 30 });

  return { printers: p.data, isLoading: p.isLoading, refresh: p.refresh };
};

export default usePrinters;
