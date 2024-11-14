import {APIGatewayProxyEvent, APIGatewayProxyResult} from "aws-lambda";
import getBaseResponse from "./util/base-reponse";
import {HTTP_METHOD, HTTP_STATUS} from "./util/http-constants";
import dotenv from "dotenv";
import {doRouting} from "./util/router";
import {
  deletePrintsAPIResponse,
  getPrintAPIResponse,
  getPrintsByPrinterIdAPIResponse,
  getPrintsByUserAPIResponse,
  savePrintsAPIResponse,
} from "./services/prints";
import {
  deleteFilamentByIdAPIResponse,
  getFilamentByIdAPIResponse,
  getFilamentsAPIResponse,
  postFilamentsAPIResponse,
} from "./services/filaments";
import {getDashboardGETAPIResponse} from "./services/dashboard";
import {
  deletePrinterByIdAPIResponse,
  getPrinterByIdAPIResponse,
  getPrintersAPIResponse,
  postPrintersAPIResponse,
} from "./services/printers";
import {getUsersApiResponse, postUsersApiResponse} from "./services/users";

export const lambdaHandler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  dotenv.config();

  return await doRouting(event, [
    {
      path: "/dashboard",
      method: HTTP_METHOD.OPTIONS,
      handler: async () =>
        await getBaseResponse(HTTP_STATUS.OK, [HTTP_METHOD.GET]),
      authenticationRequired: false,
    },
    {
      path: "/dashboard",
      method: HTTP_METHOD.GET,
      handler: getDashboardGETAPIResponse,
      authenticationRequired: true,
    },
    {
      path: "/prints",
      method: HTTP_METHOD.OPTIONS,
      handler: async () =>
        await getBaseResponse(HTTP_STATUS.OK, [
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
    {
      path: "/filament/{id}",
      method: HTTP_METHOD.DELETE,
      handler: deleteFilamentByIdAPIResponse,
      authenticationRequired: true,
    },
    {
      path: "/filament",
      method: HTTP_METHOD.OPTIONS,
      handler: () =>
        getBaseResponse(HTTP_STATUS.OK, [HTTP_METHOD.GET, HTTP_METHOD.POST]),
      authenticationRequired: false,
    },
    {
      path: "/filament",
      method: HTTP_METHOD.GET,
      handler: getFilamentsAPIResponse,
      authenticationRequired: true,
    },
    {
      path: "/filament",
      method: HTTP_METHOD.POST,
      handler: postFilamentsAPIResponse,
      authenticationRequired: true,
    },
    {
      path: "/printers",
      method: HTTP_METHOD.OPTIONS,
      handler: () => getBaseResponse(HTTP_STATUS.OK, [HTTP_METHOD.GET]),
      authenticationRequired: false,
    },
    {
      path: "/printers",
      method: HTTP_METHOD.GET,
      handler: getPrintersAPIResponse,
      authenticationRequired: true,
    },
    {
      path: "/printers",
      method: HTTP_METHOD.POST,
      handler: postPrintersAPIResponse,
      authenticationRequired: true,
    },
    {
      path: "/printers/{id}",
      method: HTTP_METHOD.OPTIONS,
      handler: () =>
        getBaseResponse(HTTP_STATUS.OK, [
          HTTP_METHOD.GET,
          HTTP_METHOD.DELETE,
          HTTP_METHOD.POST,
        ]),
      authenticationRequired: false,
    },
    {
      path: "/printers/{id}",
      method: HTTP_METHOD.GET,
      handler: getPrinterByIdAPIResponse,
      authenticationRequired: true,
    },
    {
      path: "/printers/{id}",
      method: HTTP_METHOD.DELETE,
      handler: deletePrinterByIdAPIResponse,
      authenticationRequired: true,
    },
    {
      path: "/printers/{id}/prints",
      method: HTTP_METHOD.OPTIONS,
      handler: () =>
        getBaseResponse(HTTP_STATUS.OK, [HTTP_METHOD.GET, HTTP_METHOD.POST]),
      authenticationRequired: false,
    },
    {
      path: "/printers/{id}/prints",
      method: HTTP_METHOD.GET,
      handler: getPrintsByPrinterIdAPIResponse,
      authenticationRequired: true,
    },
    {
      path: "/user",
      method: HTTP_METHOD.OPTIONS,
      handler: () =>
        getBaseResponse(HTTP_STATUS.OK, [HTTP_METHOD.GET, HTTP_METHOD.POST]),
      authenticationRequired: false,
    },
    {
      path: "/user",
      method: HTTP_METHOD.GET,
      handler: getUsersApiResponse,
      authenticationRequired: true,
    },
    {
      path: "/user",
      method: HTTP_METHOD.POST,
      handler: postUsersApiResponse,
      authenticationRequired: true,
    },
  ]);

};
