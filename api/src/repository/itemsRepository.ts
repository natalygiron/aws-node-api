import { Item } from "../model/Item";  
import createDocumentClient from "../lib/dynamoClient";
import { v4 as uuidv4 } from "uuid";

const TABLE_NAME = process.env.TABLE_NAME || "Items";

export class ItemsRepository {
  private memory: Map<string, Item> = new Map();
  private ddb = createDocumentClient();

  async create(itemData: Omit<Item, "itemId" | "createdAt">): Promise<Item> {
    const item: Item = {
      itemId: uuidv4(),
      name: itemData.name,
      description: itemData.description,
      price: itemData.price,
      createdAt: new Date().toISOString()
    };

    if (process.env.USE_DDB === "true" && this.ddb) {
      await this.ddb
        .put({
          TableName: TABLE_NAME,
          Item: item
        })
        .promise();
      return item;
    }

    // in-memory
    this.memory.set(item.itemId, item);
    return item;
  }

  async list(): Promise<Item[]> {
    if (process.env.USE_DDB === "true" && this.ddb) {
      const result = await this.ddb.scan({ TableName: TABLE_NAME }).promise();
      return (result.Items as Item[]) || [];
    }
    return Array.from(this.memory.values());
  }

  async getById(itemId: string): Promise<Item | null> {
    if (process.env.USE_DDB === "true" && this.ddb) {
      const r = await this.ddb.get({ TableName: TABLE_NAME, Key: { itemId } }).promise();
      return (r.Item as Item) || null;
    }
    return this.memory.get(itemId) || null;
  }

  async update(itemId: string, updates: Partial<Item>): Promise<Item | null> {
    if (process.env.USE_DDB === "true" && this.ddb) {
      // simple update using put (replace)
      const existing = await this.getById(itemId);
      if (!existing) return null;
      const newItem = { ...existing, ...updates };
      await this.ddb.put({ TableName: TABLE_NAME, Item: newItem }).promise();
      return newItem;
    }
    const existing = this.memory.get(itemId);
    if (!existing) return null;
    const updated = { ...existing, ...updates };
    this.memory.set(itemId, updated);
    return updated;
  }

  async delete(itemId: string): Promise<boolean> {
    if (process.env.USE_DDB === "true" && this.ddb) {
      await this.ddb.delete({ TableName: TABLE_NAME, Key: { itemId } }).promise();
      return true;
    }
    return this.memory.delete(itemId);
  }
}
