import { useAuth0 } from "@auth0/auth0-react";
import { useEffect, useState } from "react";

const useAPIToken = () => {
  const [jwt, setJwt] = useState("");
  const auth0 = useAuth0();

  useEffect(() => {
    const getToken = async () => {
      const token = await auth0.getAccessTokenSilently();
      setJwt(token);
    };

    if (jwt === "" && auth0 && auth0.isAuthenticated) {
      getToken();
    }
  }, [auth0, jwt]);

  return jwt;
};

export default useAPIToken;
