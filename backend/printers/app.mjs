import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand, QueryCommand } from "@aws-sdk/lib-dynamodb";
import jsonwebtoken from "jsonwebtoken";

const getUserInfo = async (authToken) => {
  if (authToken) {
    return jsonwebtoken.decode(authToken.replace("Bearer ", ""));
  }
  return null;

};

const client = new DynamoDBClient({});
const dynamo = DynamoDBDocumentClient.from(client);
const printersTableName = "3dpdashboard_printers";
const printsTableName = "3dpdashboard_prints";
const allowOriginHeaders = {
  "Access-Control-Allow-Origin": "*",
};

const getOptionsReponse = () => {
  return {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET,POST,DELETE",
      "Access-Control-Allow-Headers": "Authorization",
    },
  }
}

const getMethodNotFoundResponse = () => {
  return {
    statusCode: 405,
    headers: allowOriginHeaders,
    body: "method not found",
  }
}

const getPrintersGetResponse = async (user) => {
  const command = new QueryCommand({
    TableName: printersTableName,
    IndexName: "usersub-index",
    KeyConditionExpression: "usersub = :usersub",
    ExpressionAttributeValues: {
      ":usersub": user.sub,
    },
  });

  const response = await dynamo.send(command);

  //remove the usersub from going over the wire to the client
  response.Items.forEach((i) => delete i.usersub);
  return {
    statusCode: 200,
    headers: allowOriginHeaders,
    body: JSON.stringify(response.Items),
  };
}

const getPrintersPostReponse = async (user, requestBody) => {
  const requestJSON = JSON.parse(requestBody);
  const itemId = requestJSON.id || uuidv4();

  await dynamo.send(
    new PutCommand({
      TableName: printersTableName,
      Item: {
        ...requestJSON,
        id: itemId,
        usersub: user.sub,
      },
    })
  );

  return {
    statusCode: requestJSON.id ? 200 : 201,
    headers: allowOriginHeaders,
    body: JSON.stringify({
      message: requestJSON.id ? "updated" : "created",
      id: itemId,
    }),
  };
}

const getPrintersByIdGetResponse = async (user, printerId) => {
  const command = new QueryCommand({
    TableName: printersTableName,
    KeyConditionExpression: "id = :id",
    ExpressionAttributeValues: {
      ":usersub": user.sub,
      ":id": printerId,
    },
    FilterExpression: "usersub = :usersub",
  });

  const response = await dynamo.send(command);

  //remove the usersub from going over the wire to the client
  response.Items.forEach((i) => delete i.usersub);

  return {
    statusCode: 200,
    headers: allowOriginHeaders,
    body: JSON.stringify(response.Items[0]),
  };
}

const getPrintersbyIdDeleteResponse = async (user, printerId) => {

  //first, we must verify this filament is owned by this user
  const queryCommand = new QueryCommand({
    TableName: printersTableName,
    KeyConditionExpression: "id = :id",
    ExpressionAttributeValues: {
      ":usersub": user.sub,
      ":id": printerId,
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
      id: printerId,
    },
  });

  const response = await dynamo.send(command);

  return {
    statusCode: 204,
    headers: allowOriginHeaders,
  };
}

const getPrintsByPrinterIdGetResponse = async (user, printerId, ExclusiveStartKey) => {

  //query printers table to get octoEverywhereId
  const printer = await getPrintersByIdGetResponse(user, printerId);

  if (printer) {
    console.log("printerId", printerId);
    const command = new QueryCommand({
      TableName: printsTableName,
      KeyConditionExpression: "printerId = :printerid",
      ExpressionAttributeValues: {
        ":printerid": printerId,
      },
      ExclusiveStartKey,
      ScanIndexForward: true,
      Limit: 50,
    });

    const response = await dynamo.send(command);

    return {
      statusCode: 200,
      headers: allowOriginHeaders,
      body: JSON.stringify({LastEvaluatedKey: response.LastEvaluatedKey, data: response.Items}),
    };

  } else {
    return {
      statusCode: 404,
      headers: allowOriginHeaders,
      body: "not found",
    }
  }
}

const getPrintsByPrinterIdPostResponse = async (printDetails) => {
  
  const command = new PutCommand({
    TableName: "3dpdashboard_prints",
    Item: JSON.parse(printDetails),
  });

  const result = await dynamo.send(command);

  return {
    statusCode: 200,
    headers: allowOriginHeaders,
    body: "ok",
  };
}

export const lambdaHandler = async (event, context) => {
  try {
    const httpMethod = event.httpMethod;
    const path = event.requestContext.path;
    //if the method is OPTIONS, regardless of path, always return the options headers
    if (httpMethod === "OPTIONS") {
      return getOptionsReponse();
    }

    const user = await getUserInfo(event.headers.Authorization);

    if (!user) {
      return { statusCode: 401, body: "unauthorized" };
    }

    //The /printers endpoints
    if (path === "/printers" || path === "/printers/") {
      if (httpMethod === "GET") {
        return getPrintersGetResponse(user);
      }
      if (httpMethod === "POST") {
        return getPrintersPostReponse(user, event.body);
      }

      //no other methods are available for this path, return a 405 method not found
      return getMethodNotFoundResponse();
    }
    //the /printers/{id} endpoints
    if (path === "/printers/{id}" || path === "/printers/{id}/") {
      if (httpMethod === "GET") {
        return getPrintersByIdGetResponse(user, event.pathParameters.id);
      } 
      
      if (httpMethod === "DELETE") {
        return getPrintersbyIdDeleteResponse(user, event.pathParameters.id)
      }
      //no other methods are available for this path, return a 405 method not found
      return getMethodNotFoundResponse();
    }


    //the /printers/{id}/prints endpoints
    if (path === "/printers/{id}/prints" || path === "/printers/{id}/prints/") {
      if (httpMethod === "GET") {
        return getPrintsByPrinterIdGetResponse(user, event.pathParameters.id, event.queryStringParameters?.LastEvaluatedKey ? JSON.parse(event.queryStringParameters?.LastEvaluatedKey): undefined);
      }

      if (httpMethod === "POST") {
        return getPrintsByPrinterIdPostResponse(event.body);
      }
      
      //no other methods are available for this path, return a 405 method not found
      return getMethodNotFoundResponse();
    }

  } catch (err) {
    console.log(err);
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "an error occurred",
        error: err,
        headers: allowOriginHeaders,
      }),
    };
  }
};
