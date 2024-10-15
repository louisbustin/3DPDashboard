import { APIGatewayProxyResult } from "aws-lambda";
import { HTTP_METHOD, HTTP_STATUS } from "./http-constants";
import { RouterHandler } from "./router";

const getBaseResponse = async (
  statusCode: HTTP_STATUS,
  allowedMethods?: HTTP_METHOD[],
  allowedOrigins?: string,
  allowedHeaders?: string
): Promise<APIGatewayProxyResult> => {
  const methods = allowedMethods ? allowedMethods.join(", ") : "OPTIONS";
  const headers = allowedHeaders
    ? allowedHeaders
    : "Content-Type, Authorization";
  const origins = allowedOrigins ? allowedOrigins : "*";
  return {
    statusCode: statusCode,
    headers: {
      "Access-Control-Allow-Origin": origins,
      "Access-Control-Allow-Methods": methods,
      "Access-Control-Allow-Headers": headers,
    },
    body: "",
  };
};

export default getBaseResponse;
