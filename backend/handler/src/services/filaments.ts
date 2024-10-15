import { QueryCommand } from "@aws-sdk/client-dynamodb";
import { getDynamoDBClient } from "../util/db";
import { unmarshall } from "@aws-sdk/util-dynamodb";
import getBaseResponse from "../util/base-reponse";
import { RouterHandler } from "../util/router";
import { HTTP_STATUS } from "../util/http-constants";

export const getFilamentById = async (id: string, usersub: string) => {
  const dynamo = getDynamoDBClient();

  const command = new QueryCommand({
    TableName: "3dpdashboard_filament",
    KeyConditionExpression: "id = :id",
    ExpressionAttributeValues: {
      ":id": { S: id },
      ":usersub": { S: usersub },
    },
    FilterExpression: "usersub = :usersub",
  });

  const results = await dynamo.send(command);
  console.log(results);

  if (results.Items && results.Items.length === 1) {
    return unmarshall(results.Items[0]);
  } else {
    return null;
  }
};

export const getFilamentByIdAPIResponse: RouterHandler = async (context) => {
  if (!context.event.pathParameters || !context.event.pathParameters.id) {
    return getBaseResponse(HTTP_STATUS.BAD_REQUEST);
  }
  const filament = await getFilamentById(
    context.event.pathParameters.id,
    context.usersub
  );

  if (!filament) {
    return getBaseResponse(HTTP_STATUS.NOT_FOUND);
  }

  const response = await getBaseResponse(HTTP_STATUS.OK);
  response.body = JSON.stringify(filament); // Add the filament to the response body

  return response;
};
