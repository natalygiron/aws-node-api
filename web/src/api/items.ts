import axios from "axios";

const BASE = import.meta.env.VITE_API_URL || "http://localhost:3000/dev";
const client = axios.create({
  baseURL: BASE,
  headers: { "Content-Type": "application/json" },
  timeout: 8000,
});

export type Item = {
  itemId: string;
  name: string;
  description?: string;
  price?: number;
  createdAt?: string;
};

export const listItems = async (): Promise<Item[]> => {
  const res = await client.get("/items");
  return res.data;
};

export const createItem = async (payload: Partial<Item>): Promise<Item> => {
  const res = await client.post("/items", payload);
  return res.data;
};

export const getItem = async (id: string): Promise<Item> => {
  const res = await client.get(`/items/${id}`);
  return res.data;
};

export const updateItem = async (id: string, payload: Partial<Item>): Promise<Item> => {
  const res = await client.put(`/items/${id}`, payload);
  return res.data;
};

export const deleteItem = async (id: string): Promise<void> => {
  await client.delete(`/items/${id}`);
};
