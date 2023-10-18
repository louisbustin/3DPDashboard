import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, QueryCommand } from "@aws-sdk/lib-dynamodb";

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

export const lambdaHandler = async (event, context) => {
  //This method will return summary details for display on the main dashboard
  //Count of filaments
  //Count of printers
  //Count of active prints (will return 0 for now, as prints are not implemented yet)
  const returnObject = { filamentCount: 0, printerCount: 0, printCount: 0 };
  try {
    const user = await getUserInfo(event.headers.Authorization);

    const command = new QueryCommand({
      TableName: "3dpdashboard_filament",
      IndexName: "usersub-index",
      KeyConditionExpression: "usersub = :usersub",
      ExpressionAttributeValues: {
        ":usersub": user.sub,
      },
      Select: "COUNT",
    });
    const response = await dynamo.send(command);
    returnObject.filamentCount = response.Count;

    const printerCommand = new QueryCommand({
      TableName: "3dpdashboard_printers",
      IndexName: "usersub-index",
      KeyConditionExpression: "usersub = :usersub",
      ExpressionAttributeValues: {
        ":usersub": user.sub,
      },
      Select: "COUNT",
    });

    const printerResponse = await dynamo.send(printerCommand);

    returnObject.printerCount = printerResponse.Count;

    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify(returnObject),
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
