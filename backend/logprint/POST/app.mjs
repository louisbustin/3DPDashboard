import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";
import { v4 as uuidv4 } from "uuid";

const client = new DynamoDBClient({});
const dynamo = DynamoDBDocumentClient.from(client);

export const lambdaHandler = async (event, context) => {
  //This method log prints as a webhook from octoeverywhere
  try {
    const requestJSON = JSON.parse(event.body);

    await dynamo.send(
      new PutCommand({
        TableName: "3dpdashboard_printlogs",
        Item: {
          id: uuidv4(),
          ...requestJSON,
        },
      })
    );

    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
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
