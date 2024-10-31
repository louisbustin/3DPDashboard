import { DeleteCommand, PutCommand } from "@aws-sdk/lib-dynamodb";
import getBaseResponse from "../util/base-reponse";
import { getDynamoDBClient } from "../util/db";
import { HTTP_STATUS } from "../util/http-constants";
import { RouterHandler } from "../util/router";
import { QueryCommand } from "@aws-sdk/client-dynamodb";
import { unmarshall } from "@aws-sdk/util-dynamodb";
import { v4 as uuidv4 } from "uuid";

export const getPrinters = async (usersub: string) => {
  const dynamo = getDynamoDBClient();

  const command = new QueryCommand({
    TableName: "3dpdashboard_printers",
    IndexName: "usersub-index",
    KeyConditionExpression: "usersub = :usersub",
    ExpressionAttributeValues: {
      ":usersub": { S: usersub },
    },
  });

  const response = await dynamo.send(command);

  return response.Items?.map((i) => unmarshall(i));
};

export const savePrinter = async (printerStr: string, usersub: string) => {
  const dynamo = getDynamoDBClient();
  const printer = JSON.parse(printerStr);
  const itemId = printer.id || uuidv4();

  await dynamo.send(
    new PutCommand({
      TableName: "3dpdashboard_printers",
      Item: {
        ...printer,
        id: itemId,
        usersub: usersub,
        insertedAt: printer.id ? printer.insertedAt : Date.now(),
        updatedAt: Date.now(),
        octoEverywhereId: printer.octoEverywhereId
          ? printer.octoEverywhereId
          : "unused",
      },
    })
  );
};

export const getPrinter = async (printerId: string, usersub: string) => {
  const dynamo = getDynamoDBClient();

  const command = new QueryCommand({
    TableName: "3dpdashboard_printers",
    KeyConditionExpression: "id = :id",
    ExpressionAttributeValues: {
      ":usersub": { S: usersub },
      ":id": { S: printerId },
    },
    FilterExpression: "usersub = :usersub",
  });

  const response = await dynamo.send(command);

  if (response.Count && response.Count !== 1) {
    return null;
  }
  return unmarshall(response.Items![0]);
};

export const deletePrinter = async (printerId: string, usersub: string) => {
  const dynamo = getDynamoDBClient();
  //first, we must verify this filament is owned by this user
  const queryCommand = new QueryCommand({
    TableName: "3dpdashboard_printers",
    KeyConditionExpression: "id = :id",
    ExpressionAttributeValues: {
      ":usersub": { S: usersub },
      ":id": { S: printerId },
    },
    FilterExpression: "usersub = :usersub",
  });

  const res = await dynamo.send(queryCommand);
  if (res && res.Items && res.Items.length < 1) {
    return false;
  }

  const command = new DeleteCommand({
    TableName: "3dpdashboard_printers",
    Key: {
      id: printerId,
    },
  });

  const response = await dynamo.send(command);
  return true;
};

export const getPrintersAPIResponse: RouterHandler = async (context) => {
  try {
    const printers = await getPrinters(context.usersub);
    const response = await getBaseResponse(HTTP_STATUS.OK);
    response.body = JSON.stringify(printers);
    return response;
  } catch (error) {
    console.error(error);
    return await getBaseResponse(HTTP_STATUS.INTERNAL_SERVER_ERROR);
  }
};

export const postPrintersAPIResponse: RouterHandler = async (context) => {
  try {
    if (!context.event.body) {
      return await getBaseResponse(HTTP_STATUS.BAD_REQUEST);
    }
    await savePrinter(context.event.body, context.usersub);
    return getBaseResponse(HTTP_STATUS.OK);
  } catch (error) {
    console.error(error);
    return await getBaseResponse(HTTP_STATUS.INTERNAL_SERVER_ERROR);
  }
};

export const getPrinterByIdAPIResponse: RouterHandler = async (context) => {
  try {
    if (!context.event?.pathParameters?.id) {
      return await getBaseResponse(HTTP_STATUS.BAD_REQUEST);
    }
    const printer = await getPrinter(
      context.event.pathParameters.id,
      context.usersub
    );
    if (printer) {
      const res = await getBaseResponse(HTTP_STATUS.OK);
      res.body = JSON.stringify(printer);
      return res;
    }
    return await getBaseResponse(HTTP_STATUS.NOT_FOUND);
  } catch (error) {
    console.error(error);
    return await getBaseResponse(HTTP_STATUS.INTERNAL_SERVER_ERROR);
  }
};

export const deletePrinterByIdAPIResponse: RouterHandler = async (context) => {
  try {
    if (!context.event?.pathParameters?.id) {
      return await getBaseResponse(HTTP_STATUS.BAD_REQUEST);
    }
    const deleted = await deletePrinter(
      context.event.pathParameters.id,
      context.usersub
    );
    if (deleted) {
      return await getBaseResponse(HTTP_STATUS.OK);
    }
    return await getBaseResponse(HTTP_STATUS.NOT_FOUND);
  } catch (error) {
    console.log(error);
    return await getBaseResponse(HTTP_STATUS.INTERNAL_SERVER_ERROR);
  }
};
