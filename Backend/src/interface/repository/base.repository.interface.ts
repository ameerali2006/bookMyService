export interface IBaseRepository<T> {
  create(data: Partial<T>): Promise<T>;
  findById(id: string): Promise<T | null>;
  findOne(query: any): Promise<T | null>;
  updateById(id: string, updateData: Partial<T>): Promise<T | null>;
  deleteById(id: string): Promise<T | null>;
  findAll(filter: any,skip: number,limit: number,sort?: Record<string, 1 | -1>): Promise<{ items: T[]; total: number }>;
  find(query: any): Promise<T[]>;
  update(filter: any, updateData: Partial<T> | any): Promise<T | null>;
}
