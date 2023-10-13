import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { PutCommand, DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import { v4 as uuidv4 } from "uuid";
const client = new DynamoDBClient({});
const dynamo = DynamoDBDocumentClient.from(client);
const tableName = "3dpdashboard_filament";

export const lambdaHandler = async (event, context) => {
  try {
    console.log(event);
    const requestJSON = JSON.parse(event.body);
    const itemId = requestJSON.id || uuidv4();

    await dynamo.send(
      new PutCommand({
        TableName: tableName,
        Item: {
          id: itemId,
          name: requestJSON.name,
          type: requestJSON.type,
          brand: requestJSON.brand,
        },
      })
    );

    return {
      statusCode: requestJSON.id ? 200 : 201,
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({
        message: requestJSON.id ? "updated" : "created",
        id: itemId,
      }),
    };
  } catch (err) {
    console.log(err);
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "an error occurred",
        error: err,
      }),
    };
  }
};
