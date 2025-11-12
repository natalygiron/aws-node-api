import { APIGatewayProxyHandlerV2 } from "aws-lambda";
import { ItemsService } from "../service/itemsService";

const service = new ItemsService();
export const handler: APIGatewayProxyHandlerV2 = async () => {
  try {
    const items = await service.listItems();
    return { statusCode: 200, body: JSON.stringify(items) };
  } catch (err: any) {
    return { statusCode: 500, body: JSON.stringify({ message: "Server error" }) };
  }
};
