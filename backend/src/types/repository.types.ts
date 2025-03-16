export interface Repository<T = unknown> {
  create(data: Partial<T>): Promise<T>;
  exists(query: Query): Promise<{} | null>;
}

export type Query = Record<string, unknown>;
