import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { HTTP_METHOD, HTTP_STATUS } from "./http-constants";
import getBaseResponse from "./base-reponse";
import getUserInfo from "./user";
import { JwtPayload } from "jsonwebtoken";

const makeContext = async (
  event: APIGatewayProxyEvent,
  user?: JwtPayload | string
): Promise<RouterContext> => {
  return {
    event: event,
    usersub: typeof user !== "string" && user?.sub ? user.sub : "",
  };
};

export type RouterContext = {
  event: APIGatewayProxyEvent;
  usersub: string;
};

export type RouterHandler = (
  event: RouterContext
) => Promise<APIGatewayProxyResult>;

export type Route = {
  path: string;
  method: HTTP_METHOD;
  handler: RouterHandler;
  authenticationRequired?: boolean;
};

export const doRouting = async (
  event: APIGatewayProxyEvent,
  routes: Route[]
): Promise<APIGatewayProxyResult> => {
  //console.log("Event: ", event);
  //console.log("Routes: ", routes);

  const route = routes.find(
    (r) =>
      r.path === event.requestContext.resourcePath &&
      r.method === event.httpMethod
  );

  if (!route) {
    return getBaseResponse(HTTP_STATUS.NOT_FOUND);
  }

  //default authRequired to true if not sent
  const authRequired =
    route.authenticationRequired === undefined
      ? true
      : route.authenticationRequired;

  const user = await getUserInfo(event.headers.Authorization);
  const context = await makeContext(event, user);

  if (authRequired) {
    // Get the user info from the Authorization header, since all these routes are protected
    // If the user is not found, return a 401 response
    if (!user) {
      return getBaseResponse(HTTP_STATUS.UNAUTHORIZED);
    }
  }

  return route.handler(context);
};
