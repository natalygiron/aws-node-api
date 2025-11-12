import { APIGatewayProxyHandlerV2 } from "aws-lambda";
import { ItemsService } from "../service/itemsService";

const service = new ItemsService();
export const handler: APIGatewayProxyHandlerV2 = async (event) => {
  try {
    const id = event.pathParameters?.id as string;
    const deleted = await service.deleteItem(id);
    if (!deleted) return { statusCode: 404, body: JSON.stringify({ message: "Not found" }) };
    return { statusCode: 204, body: "" };
  } catch (err: any) {
    return { statusCode: 500, body: JSON.stringify({ message: "Server error" }) };
  }
};
