export interface Repository<T = unknown> {
  create(data: Partial<T>): Promise<T>;
}
