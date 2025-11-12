import { Request, Response } from "express";
import { ItemsService } from "../service/itemsService";

const service = new ItemsService();

export const createItem = async (req: Request, res: Response) => {
  try {
    const item = await service.createItem(req.body);
    return res.status(201).json(item);
  } catch (err: any) {
    return res.status(400).json({ message: err.message || "Bad request" });
  }
};

export const listItems = async (_req: Request, res: Response) => {
  try {
    const items = await service.listItems();
    return res.json(items);
  } catch (err: any) {
    return res.status(500).json({ message: "Server error" });
  }
};

export const getItem = async (req: Request, res: Response) => {
  try {
    const item = await service.getItem(req.params.id);
    if (!item) return res.status(404).json({ message: "Not found" });
    return res.json(item);
  } catch (err: any) {
    return res.status(500).json({ message: "Server error" });
  }
};

export const updateItem = async (req: Request, res: Response) => {
  try {
    const updated = await service.updateItem(req.params.id, req.body);
    if (!updated) return res.status(404).json({ message: "Not found" });
    return res.json(updated);
  } catch (err: any) {
    return res.status(400).json({ message: err.message || "Bad request" });
  }
};

export const deleteItem = async (req: Request, res: Response) => {
  try {
    const deleted = await service.deleteItem(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Not found" });
    return res.status(204).send();
  } catch (err: any) {
    return res.status(500).json({ message: "Server error" });
  }
};
