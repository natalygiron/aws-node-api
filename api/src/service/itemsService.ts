import { ItemsRepository } from "../repository/itemsRepository";
import { Item } from "../model/Item";

const repo = new ItemsRepository();

export class ItemsService {
  async createItem(payload: { name?: string; description?: string; price?: number }): Promise<Item> {
    if (!payload.name) throw new Error("Name is required");
    return repo.create({ name: payload.name, description: payload.description, price: payload.price });
  }

  async listItems(): Promise<Item[]> {
    return repo.list();
  }

  async getItem(itemId: string): Promise<Item | null> {
    return repo.getById(itemId);
  }

  async updateItem(itemId: string, updates: Partial<Item>): Promise<Item | null> {
    if (updates.name === "") throw new Error("Name cannot be empty");
    return repo.update(itemId, updates);
  }

  async deleteItem(itemId: string): Promise<boolean> {
    return repo.delete(itemId);
  }
}
