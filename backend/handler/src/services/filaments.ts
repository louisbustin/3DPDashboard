import { QueryCommand } from "@aws-sdk/client-dynamodb";
import { getDynamoDBClient } from "../util/db";
import { unmarshall } from "@aws-sdk/util-dynamodb";
import getBaseResponse from "../util/base-reponse";
import { RouterHandler } from "../util/router";
import { HTTP_STATUS } from "../util/http-constants";
import { DeleteCommand, PutCommand } from "@aws-sdk/lib-dynamodb";
import { v4 as uuidv4 } from "uuid";

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

export const deleteFilamentById = async (id: string, usersub: string) => {
  const dynamo = getDynamoDBClient();

  //first, we must verify this filament is owned by this user
  const queryCommand = new QueryCommand({
    TableName: "3dpdashboard_filament",
    KeyConditionExpression: "id = :id",
    ExpressionAttributeValues: {
      ":usersub": { S: usersub },
      ":id": { S: id },
    },
    FilterExpression: "usersub = :usersub",
  });

  const res = await dynamo.send(queryCommand);
  if (res?.Count && res.Count === 0) {
    return false;
  }

  const command = new DeleteCommand({
    TableName: "3dpdashboard_filament",
    Key: {
      id: id,
    },
  });

  await dynamo.send(command);
  return true;
};

export const getFilaments = async (usersub: string) => {
  const dynamo = getDynamoDBClient();
  const command = new QueryCommand({
    TableName: "3dpdashboard_filament",
    IndexName: "usersub-index",
    KeyConditionExpression: "usersub = :usersub",
    ExpressionAttributeValues: {
      ":usersub": { S: usersub },
    },
  });

  const response = await dynamo.send(command);

  return response.Items?.map((i) => unmarshall(i));
};

export const saveFilament = async (filamentStr: string, usersub: string) => {
  const requestJSON = JSON.parse(filamentStr);
  const itemId = requestJSON.id || uuidv4();
  const dynamo = getDynamoDBClient();

  const putResponse = await dynamo.send(
    new PutCommand({
      TableName: "3dpdashboard_filament",
      Item: {
        ...requestJSON,
        id: itemId,
        usersub: usersub,
        insertedAt: requestJSON.id ? requestJSON.insertedAt : Date.now(),
        updatedAt: Date.now(),
      },
    })
  );
};

export const getFilamentsAPIResponse: RouterHandler = async (context) => {
  try {
    const filaments = await getFilaments(context.usersub);
    const response = await getBaseResponse(HTTP_STATUS.OK);
    response.body = JSON.stringify(filaments);
    return response;
  } catch (err) {
    console.error(err);
    return await getBaseResponse(HTTP_STATUS.INTERNAL_SERVER_ERROR);
  }
};

export const postFilamentsAPIResponse: RouterHandler = async (context) => {
  try {
    if (!context.event.body) {
      return await getBaseResponse(HTTP_STATUS.BAD_REQUEST);
    }

    await saveFilament(context.event.body, context.usersub);
    const response = await getBaseResponse(HTTP_STATUS.OK);
    return response;
  } catch (err) {
    console.error(err);
    return await getBaseResponse(HTTP_STATUS.INTERNAL_SERVER_ERROR);
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

export const deleteFilamentByIdAPIResponse: RouterHandler = async (context) => {
  try {
    if (context.event.pathParameters?.id) {
      const deleted = await deleteFilamentById(
        context.event.pathParameters.id,
        context.usersub
      );
      if (deleted) {
        return getBaseResponse(HTTP_STATUS.NO_CONTENT);
      } else {
        return getBaseResponse(HTTP_STATUS.NOT_FOUND);
      }
    } else {
      //this probably shouldn't happen
      return await getBaseResponse(HTTP_STATUS.BAD_REQUEST);
    }
  } catch (err) {
    console.error("Unable to deletee filamanet: ", err);
    return await getBaseResponse(HTTP_STATUS.INTERNAL_SERVER_ERROR);
  }
};
