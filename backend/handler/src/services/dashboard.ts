import {QueryCommand} from "@aws-sdk/client-dynamodb";
import {getDynamoDBClient} from "../util/db";
import getBaseResponse from "../util/base-reponse";
import {RouterHandler} from "../util/router";
import {HTTP_STATUS} from "../util/http-constants";
import {getPrintsByUser} from "./prints";
import dayjs from "dayjs";

export const getDashboardInfo = async (usersub: string) => {
  //This method will return summary details for display on the main dashboard
  //Count of filaments
  //Count of printers
  //Count of recent prints
  const returnObject = {filamentCount: 0, printerCount: 0, recentPrintCount: 0};
  const dynoClient = getDynamoDBClient();

  const command = new QueryCommand({
    TableName: "3dpdashboard_filament",
    IndexName: "usersub-index",
    KeyConditionExpression: "usersub = :usersub",
    ExpressionAttributeValues: {
      ":usersub": {S: usersub},
      ":stat": {N: "0"},
    },
    FilterExpression:
      "filamentStatus = :stat OR attribute_not_exists(filamentStatus)",
    Select: "COUNT",
  });
  const response = await dynoClient.send(command);
  returnObject.filamentCount = response.Count || 0;

  const printerCommand = new QueryCommand({
    TableName: "3dpdashboard_printers",
    IndexName: "usersub-index",
    KeyConditionExpression: "usersub = :usersub",
    ExpressionAttributeValues: {
      ":usersub": {S: usersub},
    },
    Select: "COUNT",
  });

  const printerResponse = await dynoClient.send(printerCommand);
  returnObject.printerCount = printerResponse.Count || 0;

  const minDate = dayjs().subtract(1, "week").startOf("day").unix() * 1000;
  const maxDate = dayjs().endOf("day").unix() * 1000;
  const recentPrintsResult = await getPrintsByUser(usersub, minDate, maxDate);

  returnObject.recentPrintCount = recentPrintsResult?.length || 0;

  return returnObject;
};

export const getDashboardGETAPIResponse: RouterHandler = async (context) => {
  try {
    const dashboardInfo = await getDashboardInfo(context.usersub);
    const response = await getBaseResponse(HTTP_STATUS.OK);
    response.body = JSON.stringify(dashboardInfo);
    return response;
  } catch (err) {
    console.error("Error in getDashboardGETAPIResponse", err);
    return await getBaseResponse(HTTP_STATUS.INTERNAL_SERVER_ERROR);
  }
};
