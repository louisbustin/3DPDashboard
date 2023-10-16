import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  QueryCommand,
  DeleteCommand,
  DynamoDBDocumentClient,
} from "@aws-sdk/lib-dynamodb";

const getUserInfo = async (authToken) => {
  const response = await fetch("https://eforge.us.auth0.com/userinfo", {
    headers: { Authorization: authToken },
  });
  if (response && response.status === 200) {
    return await response.json();
  } else {
    throw new Error("unable to verify user");
  }
};

const client = new DynamoDBClient({});
const dynamo = DynamoDBDocumentClient.from(client);
const tableName = "3dpdashboard_printers";

export const lambdaHandler = async (event, context) => {
  try {
    //first, we must verify this filament is owned by this user
    const user = await getUserInfo(event.headers.Authorization);
    const queryCommand = new QueryCommand({
      TableName: tableName,
      KeyConditionExpression: "id = :id",
      ExpressionAttributeValues: {
        ":usersub": user.sub,
        ":id": event.pathParameters.id,
      },
      FilterExpression: "usersub = :usersub",
    });

    const res = await dynamo.send(queryCommand);
    if (res && res.Items && res.Items.length < 1) {
      return {
        statusCode: 404,
        headers: {
          "Access-Control-Allow-Origin": "*",
        },
      };
    }

    const command = new DeleteCommand({
      TableName: tableName,
      Key: {
        id: event.pathParameters.id,
      },
    });

    const response = await dynamo.send(command);

    return {
      statusCode: 204,
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
