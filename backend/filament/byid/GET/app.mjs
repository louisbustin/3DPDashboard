import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, QueryCommand } from "@aws-sdk/lib-dynamodb";
import jsonwebtoken from "jsonwebtoken";

const getUserInfo = async (authToken) => {
  return jsonwebtoken.decode(authToken.replace("Bearer ", ""));
};

const client = new DynamoDBClient({});
const dynamo = DynamoDBDocumentClient.from(client);
const tableName = "3dpdashboard_filament";

export const lambdaHandler = async (event, context) => {
  try {
    const user = await getUserInfo(event.headers.Authorization);
    const command = new QueryCommand({
      TableName: "3dpdashboard_filament",
      KeyConditionExpression: "id = :id",
      ExpressionAttributeValues: {
        ":usersub": user.sub,
        ":id": event.pathParameters.id,
      },
      FilterExpression: "usersub = :usersub",
    });

    const response = await dynamo.send(command);

    //remove the usersub from going over the wire to the client
    response.Items.forEach((i) => delete i.usersub);
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify(response.Items[0]),
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
