import { useEffect, useState } from "react";
import useAPIToken from "./use-api-token";
import { v4 as uuidv4 } from "uuid";

type FetchResponse<T> = {
  data?: T;
  isLoading: boolean;
  mutate: () => void;
};

function useFetch<T>(
  url: string,
  init?: RequestInit | undefined
): FetchResponse<T> {
  const token = useAPIToken();
  const [data, setData] = useState<T>();
  const [isLoading, setIsLoading] = useState(false);
  const [reload, setReload] = useState(uuidv4());

  const mutate = () => {
    setReload(uuidv4());
  };
  try {
    useEffect(() => {
      setIsLoading(true);
      async function fetchWithBearerToken() {
        const response = await fetch(url, {
          ...init,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setData(await response.json());
        setIsLoading(false);
      }
      if (token) fetchWithBearerToken();
    }, [token, reload, url, init]);
  } catch (e) {
    setIsLoading(false);
  }
  return { isLoading, data, mutate };
}

export default useFetch;
