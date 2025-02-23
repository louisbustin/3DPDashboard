import IPrint from "../models/IPrint";
import { IPrintLastEvaluatedKey } from "../models/IPrintResponse";
import useFetch from "./use-fetch";

const apiURL = `${import.meta.env.VITE_BASE_URL}prints/`;
export type PrintOptions = {
  printerId?: string;
  startDate: number;
  endDate: number;
  lastEvaluatedKey?: IPrintLastEvaluatedKey;
};
export const usePrints = (options?: PrintOptions & { reloadTime?: number }) => {
  //const apiURL = ;
  const p = useFetch<IPrint[]>(
    `${apiURL}?startDate=${options?.startDate}&endDate=${options?.endDate}`,
    { reloadTime: options?.reloadTime }
  );

  return {
    prints: p.data,
    isLoading: p.isLoading,
    refresh: p.refresh,
  };
};

export default usePrints;
