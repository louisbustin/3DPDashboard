import { useEffect, useState } from "react";
import useAPIToken from "./use-api-token";
import { v4 as uuidv4 } from "uuid";
import _ from "lodash";

export type FetchResponse<T> = {
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
  const [previousReload, setPreviousReload] = useState(reload);
  const [initState, setInitState] = useState(init);
  const [previousUrl, setPreviousUrl] = useState(url);

  if (!_.isEqual(init, initState)) {
    setInitState(init);
  }
  const mutate = () => {
    setReload(uuidv4());
  };

  // Reload data every reloadTime milliseconds
  useEffect(() => {
    if (!init || !init.reloadTime || init?.reloadTime === 0) return;
    const interval = setInterval(() => {
      mutate();
    }, init?.reloadTime);
    return () => clearInterval(interval);
  }, [init]);

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
        setIsLoading(false);
      }

      if (token) {
        if (
          (!data || reload !== previousReload || url !== previousUrl) &&
          !isLoading
        ) {
          fetchWithBearerToken().then(() => {
            setPreviousReload(reload);
            setPreviousUrl(url);
          });
        }
      }
    }, [
      token,
      reload,
      url,
      init,
      data,
      previousReload,
      previousUrl,
      isLoading,
    ]);
  } catch (e) {
    setIsLoading(false);
  }

  return { isLoading, data, refresh: mutate };
}

export default useFetch;
