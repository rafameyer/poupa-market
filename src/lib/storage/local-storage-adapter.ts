import type {
  EntityWithId,
  StorageAdapter,
} from "@/lib/storage/storage-adapter";

export class LocalStorageAdapter<T extends EntityWithId>
  implements StorageAdapter<T>
{
  constructor(private readonly storageKey: string) {}

  async getAll(): Promise<T[]> {
    return this.read();
  }

  async getById(id: string): Promise<T | null> {
    return this.read().find((item) => item.id === id) ?? null;
  }

  async create(item: T): Promise<T> {
    const items = this.read();
    items.push(item);
    this.write(items);
    return item;
  }

  async update(id: string, item: Partial<T>): Promise<T> {
    const items = this.read();
    const index = items.findIndex((entry) => entry.id === id);

    if (index < 0) {
      throw new Error(`Item with id "${id}" was not found.`);
    }

    const updatedItem = { ...items[index], ...item };
    items[index] = updatedItem;
    this.write(items);

    return updatedItem;
  }

  async delete(id: string): Promise<void> {
    const items = this.read().filter((item) => item.id !== id);
    this.write(items);
  }

  private read(): T[] {
    if (typeof window === "undefined") {
      return [];
    }

    const rawValue = window.localStorage.getItem(this.storageKey);

    if (!rawValue) {
      return [];
    }

    try {
      const parsed = JSON.parse(rawValue) as T[];
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }

  private write(items: T[]) {
    if (typeof window === "undefined") {
      return;
    }

    window.localStorage.setItem(this.storageKey, JSON.stringify(items));
  }
}
