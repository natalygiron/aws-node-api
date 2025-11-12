import AWS from "aws-sdk";
import dotenv from "dotenv";
dotenv.config();

const region = process.env.AWS_REGION || "us-east-1";

AWS.config.update({ region });

export const createDocumentClient = () => {
  if (process.env.USE_DDB === "true") {
    const options: AWS.DynamoDB.DocumentClient.DocumentClientOptions & AWS.ConfigurationOptions = {};
    // If using local DynamoDB for testing (DDB_ENDPOINT set), override endpoint
    if (process.env.DDB_ENDPOINT) {
      (options as any).endpoint = process.env.DDB_ENDPOINT;
    }
    return new AWS.DynamoDB.DocumentClient(options);
  }
  return null;
};

export default createDocumentClient;
