import { APIGatewayProxyHandlerV2 } from "aws-lambda";
import { ItemsService } from "../service/itemsService";

const service = new ItemsService();
export const handler: APIGatewayProxyHandlerV2 = async (event) => {
  try {
    const id = event.pathParameters?.id as string;
    const body = event.body ? JSON.parse(event.body) : {};
    const updated = await service.updateItem(id, body);
    if (!updated) return { statusCode: 404, body: JSON.stringify({ message: "Not found" }) };
    return { statusCode: 200, body: JSON.stringify(updated) };
  } catch (err: any) {
    return { statusCode: 400, body: JSON.stringify({ message: err.message || "Bad request" }) };
  }
};
