import IPrint from "../models/IPrint";
import IPrintResponse, { IPrintLastEvaluatedKey } from "../models/IPrintResponse";
import useFetch, {FetchResponse} from "./use-fetch";

const apiURL = `${process.env.REACT_APP_API_BASE_URL}printers/`;

const usePrints = (printerId?: string) => {
  let p: FetchResponse<IPrintResponse>;
  let evalKey: IPrintLastEvaluatedKey | undefined = undefined;
  let accumulatedPrints: IPrint[] = [];
  do {
    p = useFetch<IPrintResponse>(apiURL + printerId + "/prints" + evalKey ? `?LastEvaluatedKey=${JSON.stringify(evalKey)}` : "", { reloadTime: 0 });
    if (p.data && p.data.data) {
      //accumulatedPrints.concat(p.data.data)
      console.log(p);
    }
  } while (p.data && p.data.LastEvaluatedKey)
  
  return { prints: accumulatedPrints, isLoading: p.isLoading, refresh: p.refresh };
};

export default usePrints;
