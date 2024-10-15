import jsonwebtoken from "jsonwebtoken";
let key = "";

const getPublicKey = async () => {
  const response = await fetch(
    "https://eforge.us.auth0.com/.well-known/jwks.json"
  );
  const data = await response.json();
  return `
-----BEGIN CERTIFICATE-----
${data.keys[0].x5c[0]}
-----END CERTIFICATE-----
`;
};

const getUserInfo = async (authToken?: string) => {
  if (!key) {
    console.log("Fetching public keys");
    key = await getPublicKey();
  }
  if (authToken) {
    try {
      const verify = jsonwebtoken.verify(
        authToken.replace("Bearer ", ""),
        key,
        {
          algorithms: ["RS256"],
        }
      );
      return verify;
    } catch (e) {
      console.error(e);
    }
    return "";
  }
  return "";
};

export default getUserInfo;
