import "dotenv/config";
import { DynamoDBClient, QueryCommand } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";
import { unmarshall } from "@aws-sdk/util-dynamodb";
import AWS from "aws-sdk";
import axios from "axios";

const client = new DynamoDBClient({});
const dynamo = DynamoDBDocumentClient.from(client);
const allowOriginHeaders = {
  "Access-Control-Allow-Origin": "*",
};

const getOptionsReponse = () => {
  return {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST",
      "Access-Control-Allow-Headers": "*",
    },
  };
};

const getMethodNotFoundResponse = () => {
  return {
    statusCode: 405,
    headers: allowOriginHeaders,
    body: "method not found",
  };
};

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

const s3 = new AWS.S3();

async function copyImageToS3(imageUrl) {
  try {
    // Download the image
    const response = await axios.get(imageUrl, { responseType: "arraybuffer" });
    const buffer = Buffer.from(response.data, "binary");

    // Define S3 upload parameters
    const uploadParams = {
      Bucket: process.env.S3_BUCKET_NAME,
      Key: `images/${Date.now()}_${imageUrl.split("/").pop()}`, // Unique key for the image
      Body: buffer,
      ContentType: response.headers["content-type"],
    };

    // Upload the image to S3
    const uploadResult = await s3.upload(uploadParams).promise();

    // Return the S3 URL
    return uploadResult.Location;
  } catch (error) {
    console.error("Error copying image to S3:", error);
    return "";
  }
}

const getPostResponse = async (event) => {
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
  const printerResult = await dynamo.send(command);

  if (printerResult.Count === 1) {
    const printerJson = unmarshall(printerResult.Items[0]);

    //is there already a print with this PrintId?
    const printCommand = new QueryCommand({
      TableName: "3dpdashboard_prints",
      IndexName: "PrintId-index",
      KeyConditionExpression: "PrintId = :id",
      ExpressionAttributeValues: {
        ":id": { S: requestJSON.PrintId },
      },
    });

    const printResult = await dynamo.send(printCommand);

    let printResultJson = {};

    if (printResult.Count === 1) {
      printResultJson = unmarshall(printResult.Items[0]);
    }

    const newStatus =
      requestJSON.EventType === 2
        ? "Complete"
        : requestJSON.EventType === 3
        ? "Failed"
        : "Pending";

    //if the print exists, this will replace the original. If it does not, it is created.
    //this ensures the prints table always has the most recent info from the octoeverywhere
    const imageUrl = await copyImageToS3(requestJSON.SnapshotUrl);
    const newPrint = {
      printerId: printerJson.id,
      insertedAt: printResultJson.insertedAt
        ? printResultJson.insertedAt
        : Date.now(),
      filamentId: printResultJson.filamentId ? printResultJson.filamentId : "",
      amountUsed: printResultJson.amountUsed ? printResultJson.amountUsed : 0,
      PrintStatus: newStatus,
      usersub: printerJson.usersub,
      updatedAt: Date.now(),
      imageUrl: imageUrl,
      ...requestJSON,
    };
    //commenting out the save here. just testing the upload for now

    await dynamo.send(
      new PutCommand({
        TableName: "3dpdashboard_prints",
        Item: newPrint,
      })
    );

    //log the full request from octoeverywhere
    await dynamo.send(
      new PutCommand({
        TableName: "3dpdashboard_printlogs",
        Item: { id: uuidv4(), insertedAt: Date.now(), ...requestJSON },
      })
    );
  }

  //if nothing errors, return success, regardless of whether we found the printer or not
  return {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
    body: "ok",
  };
};

export const lambdaHandler = async (event, context) => {
  //This method log prints as a webhook from octoeverywhere
  try {
    const httpMethod = event.httpMethod;
    const path = event.requestContext.resourcePath;
    //if the method is OPTIONS, regardless of path, always return the options headers
    if (httpMethod === "OPTIONS") {
      return getOptionsReponse();
    }

    if (httpMethod === "POST") {
      return await getPostResponse(event);
    }

    //if to this point, no other methods are implemented. return a 405
    return getMethodNotFoundResponse();
  } catch (err) {
    console.log(err);
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "an error occurred",
        error: err,
      }),
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
    };
  }
};
