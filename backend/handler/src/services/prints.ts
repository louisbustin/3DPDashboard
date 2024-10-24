import { getDynamoDBClient } from "../util/db";
import getBaseResponse from "../util/base-reponse";
import { HTTP_STATUS } from "../util/http-constants";
import { RouterHandler } from "../util/router";
import { QueryCommand } from "@aws-sdk/client-dynamodb";
import { unmarshall } from "@aws-sdk/util-dynamodb";
import { DeleteCommand, PutCommand } from "@aws-sdk/lib-dynamodb";
import { v4 } from "uuid";

export const getPrintsByUser = async (
  usersub: string,
  startDate: number,
  endDate: number,
) => {
  const dynamo = getDynamoDBClient();

  const command = new QueryCommand({
    TableName: "3dpdashboard_prints",
    IndexName: "usersub-insertedAt-index",
    KeyConditionExpression:
      "usersub = :usersub AND insertedAt BETWEEN :startDate AND :endDate",
    ExpressionAttributeValues: {
      ":usersub": { S: usersub },
      ":startDate": { N: startDate.toString() },
      ":endDate": { N: endDate.toString() },
    },
  });

  const results = await dynamo.send(command);

  if (results.Items) {
    return results.Items.map((item) => unmarshall(item));
  }
};

const savePrint = async (
  printStr: string,
  usersub: string,
  pathId?: string,
) => {
  const print = JSON.parse(printStr);

  //always set the usersub to the current user
  print.usersub = usersub;

  //always update the updatedAt time
  print.updatedAt = Date.now();

  // if the id in the path is undefined, this is a new print
  // in that case, setup some fields, like id and insertedAt
  console.log("pathId", pathId);
  if (!pathId) {
    print.PrintId = v4();
    print.insertedAt = Date.now();
  }

  const command = new PutCommand({
    TableName: "3dpdashboard_prints",
    Item: print,
  });

  const dynamo = getDynamoDBClient();
  const result = await dynamo.send(command);

  return "";
};

const getPrint = async (printId: string, usersub: string) => {
  const dynamo = getDynamoDBClient();

  const command = new QueryCommand({
    TableName: "3dpdashboard_prints",
    IndexName: "PrintId-index",
    KeyConditionExpression: "PrintId = :PrintId",
    ExpressionAttributeValues: {
      ":usersub": { S: usersub },
      ":PrintId": { S: printId },
    },
    FilterExpression: "usersub = :usersub",
  });

  const results = await dynamo.send(command);

  if (results.Items && results.Items.length === 1) {
    return unmarshall(results.Items[0]);
  }
};

const deletePrint = async (printId: string, usersub: string) => {
  const dynamo = getDynamoDBClient();

  const command = new QueryCommand({
    TableName: "3dpdashboard_prints",
    IndexName: "PrintId-index",
    KeyConditionExpression: "PrintId = :PrintId",
    ExpressionAttributeValues: {
      ":usersub": { S: usersub },
      ":PrintId": { S: printId },
    },
    FilterExpression: "usersub = :usersub",
  });

  const results = await dynamo.send(command);

  if (results.Items && results.Items.length > 0) {
    //there may be multiple prints with the same printId due to some strange bug
    //so we will delete both to clean up the database
    results.Items.forEach(async (item) => {
      const print = unmarshall(item);

      const deleteCommand = new DeleteCommand({
        TableName: "3dpdashboard_prints",
        Key: {
          printerId: print.printerId,
          insertedAt: print.insertedAt,
        },
      });

      await dynamo.send(deleteCommand);
    });
    return "ok";
  }
  return "not found";
};

export const getPrintsByUserAPIResponse: RouterHandler = async (context) => {
  //get a javascript date object for one week ago as a number
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

  //default the startDate to one week ago
  const startDate =
    Number(context.event.queryStringParameters?.startDate) ||
    oneWeekAgo.getTime();
  //default the endDate to now
  const endDate =
    Number(context.event.queryStringParameters?.endDate) ||
    new Date().getTime();

  if (startDate > endDate) {
    const response = await getBaseResponse(HTTP_STATUS.BAD_REQUEST);
    response.body = "startDate must be less than endDate";
    return response;
  }

  const prints = await getPrintsByUser(context.usersub, startDate, endDate);
  const response = await getBaseResponse(HTTP_STATUS.OK);
  response.body = JSON.stringify(prints); // Add the prints to the response body

  return response;
};

export const getPrintAPIResponse: RouterHandler = async (context) => {
  const printId = context.event.pathParameters?.id;
  if (!printId) {
    return await getBaseResponse(HTTP_STATUS.BAD_REQUEST);
  }
  try {
    const result = await getPrint(printId, context.usersub);
    if (!result) {
      return await getBaseResponse(HTTP_STATUS.NOT_FOUND);
    }
    const response = await getBaseResponse(HTTP_STATUS.OK);
    response.body = JSON.stringify(result);
    return response;
  } catch (e) {
    console.error(e);
    return await getBaseResponse(HTTP_STATUS.INTERNAL_SERVER_ERROR);
  }
};

export const savePrintsAPIResponse: RouterHandler = async (context) => {
  const print = context.event.body;
  if (!print) {
    return await getBaseResponse(HTTP_STATUS.BAD_REQUEST);
  }

  try {
    const result = await savePrint(
      print,
      context.usersub,
      context.event.pathParameters?.id,
    );
  } catch (e) {
    console.error(e);
    return await getBaseResponse(HTTP_STATUS.INTERNAL_SERVER_ERROR);
  }
  return await getBaseResponse(HTTP_STATUS.OK);
};

export const deletePrintsAPIResponse: RouterHandler = async (context) => {
  const printId = context.event.pathParameters?.id;
  if (!printId) {
    return await getBaseResponse(HTTP_STATUS.BAD_REQUEST);
  }

  try {
    const response = await deletePrint(printId, context.usersub);
    if (response === "not found") {
      return await getBaseResponse(HTTP_STATUS.NOT_FOUND);
    }
  } catch (e) {
    console.error(e);
    return await getBaseResponse(HTTP_STATUS.INTERNAL_SERVER_ERROR);
  }
  return await getBaseResponse(HTTP_STATUS.OK);
};
