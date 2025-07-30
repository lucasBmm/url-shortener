export interface IRepository<
  T,
  C = Partial<T>,
  U = Partial<T>
> {
  create(data: C): Promise<T>;
  findAll(): Promise<T[]>;
  findOne(id: string): Promise<T | null>;
  update(id: string, data: U): Promise<void>;
  remove(id: string): Promise<void>;
}