import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import getBaseResponse from "./util/base-reponse";
import { HTTP_METHOD, HTTP_STATUS } from "./util/http-constants";
import dotenv from "dotenv";
import { doRouting } from "./util/router";
import {
  deletePrintsAPIResponse,
  getPrintAPIResponse,
  getPrintsByUserAPIResponse,
  savePrintsAPIResponse,
} from "./services/prints";
import { getFilamentByIdAPIResponse } from "./services/filaments";

export const lambdaHandler = async (
  event: APIGatewayProxyEvent,
): Promise<APIGatewayProxyResult> => {
  dotenv.config();

  const result = await doRouting(event, [
    {
      path: "/prints",
      method: HTTP_METHOD.OPTIONS,
      handler: async () =>
        await getBaseResponse(HTTP_STATUS.OK, [
          HTTP_METHOD.OPTIONS,
          HTTP_METHOD.GET,
          HTTP_METHOD.POST,
        ]),
      authenticationRequired: false,
    },
    {
      path: "/prints",
      method: HTTP_METHOD.GET,
      handler: getPrintsByUserAPIResponse,
      authenticationRequired: true,
    },
    {
      path: "/prints",
      method: HTTP_METHOD.POST,
      handler: savePrintsAPIResponse,
      authenticationRequired: true,
    },
    {
      path: "/prints/{id}",
      method: HTTP_METHOD.OPTIONS,
      handler: async () =>
        await getBaseResponse(HTTP_STATUS.OK, [
          HTTP_METHOD.OPTIONS,
          HTTP_METHOD.GET,
          HTTP_METHOD.POST,
          HTTP_METHOD.DELETE,
        ]),
      authenticationRequired: false,
    },
    {
      path: "/prints/{id}",
      method: HTTP_METHOD.GET,
      handler: getPrintAPIResponse,
      authenticationRequired: true,
    },
    {
      path: "/prints/{id}",
      method: HTTP_METHOD.POST,
      handler: savePrintsAPIResponse,
      authenticationRequired: true,
    },
    {
      path: "/prints/{id}",
      method: HTTP_METHOD.DELETE,
      handler: deletePrintsAPIResponse,
      authenticationRequired: true,
    },
    {
      path: "/filament/{id}",
      method: HTTP_METHOD.OPTIONS,
      handler: async () =>
        await getBaseResponse(HTTP_STATUS.OK, [
          HTTP_METHOD.OPTIONS,
          HTTP_METHOD.GET,
          HTTP_METHOD.DELETE,
        ]),
      authenticationRequired: false,
    },
    {
      path: "/filament/{id}",
      method: HTTP_METHOD.GET,
      handler: getFilamentByIdAPIResponse,
      authenticationRequired: true,
    },
  ]);

  return result;
};
