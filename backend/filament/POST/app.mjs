import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { PutCommand, DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import { v4 as uuidv4 } from "uuid";

const client = new DynamoDBClient({});
const dynamo = DynamoDBDocumentClient.from(client, {
  marshallOptions: {
    removeUndefinedValues: false,
  },
});
const tableName = "3dpdashboard_filament";

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

export const lambdaHandler = async (event, context) => {
  try {
    const user = await getUserInfo(event.headers.Authorization);

    const requestJSON = JSON.parse(event.body);
    const itemId = requestJSON.id || uuidv4();

    await dynamo.send(
      new PutCommand({
        TableName: tableName,
        Item: {
          ...requestJSON,
          usersub: user.sub,
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
