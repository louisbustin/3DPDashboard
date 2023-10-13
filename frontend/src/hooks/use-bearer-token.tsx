import { useEffectOnce } from "usehooks-ts";
import { useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";

const useBearerToken = () => {
  const [bearerToken, setBearerToken] = useState("");
  const auth0 = useAuth0();
  useEffectOnce(() => {
    const getToken = async () => {
      setBearerToken(await auth0.getAccessTokenSilently());
    };
    if (!bearerToken) getToken();
  });

  return bearerToken;
};

export default useBearerToken;
