import { ItemsService } from "../itemsService";

describe("ItemsService (in-memory)", () => {
  const service = new ItemsService();

  it("creates and returns an item", async () => {
    const item = await service.createItem({ name: "Test", description: "x", price: 1 });
    expect(item).toHaveProperty("itemId");
    expect(item.name).toBe("Test");
  });

  it("lists items (at least one)", async () => {
    const items = await service.listItems();
    expect(Array.isArray(items)).toBe(true);
    expect(items.length).toBeGreaterThanOrEqual(1);
  });

  it("gets, updates and deletes item", async () => {
    const created = await service.createItem({ name: "ToUpdate", price: 2 });
    const fetched = await service.getItem(created.itemId);
    expect(fetched?.name).toBe("ToUpdate");

    const updated = await service.updateItem(created.itemId, { price: 3 });
    expect(updated?.price).toBe(3);

    const deleted = await service.deleteItem(created.itemId);
    expect(deleted).toBe(true);
    const shouldBeNull = await service.getItem(created.itemId);
    expect(shouldBeNull).toBeNull();
  });
});
