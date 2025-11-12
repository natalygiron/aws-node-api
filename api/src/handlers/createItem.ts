import { APIGatewayProxyHandlerV2 } from "aws-lambda";
import { ItemsService } from "../service/itemsService";

const service = new ItemsService();

export const handler: APIGatewayProxyHandlerV2 = async (event) => {
  try {
    const body = event.body ? JSON.parse(event.body) : {};
    const item = await service.createItem(body);
    return { statusCode: 201, body: JSON.stringify(item) };
  } catch (err: any) {
    return { statusCode: 400, body: JSON.stringify({ message: err.message || "Bad request" }) };
  }
};
