import {RouterHandler} from "../util/router";
import getBaseResponse from "../util/base-reponse";
import {HTTP_STATUS} from "../util/http-constants";
import {getDynamoDBClient} from "../util/db";
import {QueryCommand} from "@aws-sdk/client-dynamodb";
import {PutCommand} from "@aws-sdk/lib-dynamodb";
import {unmarshall} from "@aws-sdk/util-dynamodb";

export const getUser = async (usersub: string) => {
  const dynamo = getDynamoDBClient();

  const command = new QueryCommand({
    TableName: "3dpdashboard_users",
    KeyConditionExpression: "usersub = :usersub",
    ExpressionAttributeValues: {
      ":usersub": {S: usersub},
    },
  });

  const results = await dynamo.send(command);
  if (results.Count === 1) {
    return results.Items![0];
  }
  return {};
}

const saveUser = async (
  userStr: string,
  usersub: string
) => {
  const user = JSON.parse(userStr);

  //always set the usersub to the current user
  user.usersub = usersub;

  //always update the updatedAt time
  user.updatedAt = Date.now();

  if (!user.insertedAt) {
    user.insertedAt = Date.now();
  }

  const command = new PutCommand({
    TableName: "3dpdashboard_users",
    Item: user,
  });

  const dynamo = getDynamoDBClient();
  await dynamo.send(command);
  return "";
};

export const getUsersApiResponse: RouterHandler = async (context) => {
  try {
    const user = await getUser(context.usersub);
    const response = await getBaseResponse(HTTP_STATUS.OK);
    response.body = JSON.stringify(unmarshall(user));
    return response;
  } catch (e) {
    console.error(e);
    return await getBaseResponse(HTTP_STATUS.INTERNAL_SERVER_ERROR);
  }
}

export const postUsersApiResponse: RouterHandler = async (context) => {
  try {
    const userStr = context.event.body;
    if (!userStr) {
      return await getBaseResponse(HTTP_STATUS.BAD_REQUEST);
    }
    await saveUser(userStr, context.usersub);
    return await getBaseResponse(HTTP_STATUS.OK);
  } catch (e) {
    console.error(e);
    return await getBaseResponse(HTTP_STATUS.INTERNAL_SERVER_ERROR);
  }
}