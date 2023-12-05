import { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";

const useAPIToken = () => {
  const [bearerToken, setBearerToken] = useState("");
  const auth0 = useAuth0();
  useEffect(() => {
    const getToken = async () => {
      const tokenClaims = await auth0.getIdTokenClaims();
      if (tokenClaims) setBearerToken(tokenClaims.__raw);
    };

    getToken();
  }, [auth0]);

  return bearerToken;
};

export default useAPIToken;
