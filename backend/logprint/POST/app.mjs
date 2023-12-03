import { DynamoDBClient, QueryCommand } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";
import { unmarshall } from "@aws-sdk/util-dynamodb";
import { v4 as uuidv4 } from "uuid";

const client = new DynamoDBClient({});
const dynamo = DynamoDBDocumentClient.from(client);

export const lambdaHandler = async (event, context) => {
  //This method log prints as a webhook from octoeverywhere
  try {
    const requestJSON = JSON.parse(event.body);

    //first, does this print have an associated printer, if not, ignore it.
    const command = new QueryCommand({
      TableName: "3dpdashboard_printers",
      IndexName: "octoEverywhereId-index",
      KeyConditionExpression: "octoEverywhereId = :octoid",
      ExpressionAttributeValues: {
        ":octoid": { S: requestJSON.PrinterId },
      },
    });
    const response = await dynamo.send(command);

    if (response.Count === 1) {
      const currentPrinter = unmarshall(response.Items[0]);
      if (!currentPrinter.prints) {
        currentPrinter.prints = [];
      }

      const printToUpdate = currentPrinter.prints.find(
        (p) => p.id === requestJSON.PrintId
      );

      const newStatus =
        requestJSON.EventType === 2
          ? "Complete"
          : requestJSON.EventType === 3
          ? "Failed"
          : "Pending";

      if (printToUpdate) {
        printToUpdate.insertedAt = Date.now();
        printToUpdate.status = newStatus;
      } else {
        currentPrinter.prints.push({
          id: requestJSON.PrintId,
          amountUsed: 0,
          filamentId: "",
          status: newStatus,
          insertedAt: Date.now(),
          ...requestJSON,
        });
      }

      await dynamo.send(
        new PutCommand({
          TableName: "3dpdashboard_printers",
          Item: currentPrinter,
        })
      );
      //also, log the full request from octoeverywhere, in case we need it in the future
      await dynamo.send(
        new PutCommand({
          TableName: "3dpdashboard_printlogs",
          Item: { id: uuidv4(), insertedAt: Date.now(), ...requestJSON },
        })
      );
    }

    //if nothing errors, return success
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
      body: "ok",
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
