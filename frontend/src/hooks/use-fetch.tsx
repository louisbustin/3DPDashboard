import { useEffect, useState } from "react";
import useAPIToken from "./use-api-token";
import { v4 as uuidv4 } from "uuid";
import _ from "lodash";
import { useCache } from "./use-cache";

type FetchResponse<T> = {
  data?: T;
  isLoading: boolean;
  refresh: () => void;
};

function useFetch<T>(
  url: string,
  init?: RequestInit & { reloadTime?: number }
): FetchResponse<T> {
  const token = useAPIToken();
  const [data, setData] = useState<T>();
  const [isLoading, setIsLoading] = useState(false);
  const [reload, setReload] = useState(uuidv4());
  const [initState, setInitState] = useState(init);
  const { getCache, setCache } = useCache();

  if (!_.isEqual(init, initState)) {
    setInitState(init);
  }
  const mutate = () => {
    console.log("mutating");
    setReload(uuidv4());
  };
  try {
    useEffect(() => {
      async function fetchWithBearerToken() {
        setIsLoading(true);
        const response = await fetch(url, {
          ...init,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const jsonData = await response.json();
        setData(jsonData);
        setCache(url, _.clone(jsonData), init?.reloadTime);
        setIsLoading(false);
      }

      const cachedData = getCache(url);
      if (cachedData) {
        setData(_.clone(cachedData));
      } else {
        if (token) {
          fetchWithBearerToken();
        }
      }
    }, [token, reload, url, getCache, init, setCache]);
  } catch (e) {
    setIsLoading(false);
  }
  return { isLoading, data, refresh: mutate };
}

export default useFetch;
