import { Model, Document, FilterQuery } from "mongoose";
import { IBaseRepository } from "../../interface/repository/base.repository.interface";

export class BaseRepository<T extends Document> implements IBaseRepository<T> {
  private model: Model<T>;

  constructor(model: Model<T>) {
    this.model = model; 
  }

  async create(data: Partial<T>): Promise<T> {
    const newRecord = new this.model(data);
    return await newRecord.save();
  }

  async findById(id: string): Promise<T | null> {
    return await this.model.findById(id);
  }

 async findAll(filter: FilterQuery<T> = {}, skip = 0, limit = 10, sort: Record<string, 1 | -1> = {}) {
    const [items, total] = await Promise.all([
      this.model.find(filter).sort(sort).skip(skip).limit(limit).lean() as Promise<T[]>,
      this.model.countDocuments(filter),
    ]);
    return { items, total };
    }

  async updateById(id: string, data: Partial<T>): Promise<T | null> {
    return await this.model.findByIdAndUpdate(id, data, { new: true });
  }

  async deleteById(id: string): Promise<T | null> {
    return await this.model.findByIdAndDelete(id);
  }

  async findOne(query: any): Promise<T | null> {
    return await this.model.findOne(query);
  }
  async find(query: any): Promise<T[]> {
    return await this.model.find(query);
  }
  async update(filter: FilterQuery<T>, updateData: Partial<T>) {
    return this.model
      .findOneAndUpdate(filter, updateData, { new: true })
      .lean() as Promise<T>;
  }
  async findWithPopulate<TReturn = T>(filter: FilterQuery<T>,populateFields: { path: string; select?: string }[]): Promise<TReturn[]> {
    let query = this.model.find(filter);

    for (const { path, select } of populateFields) {
      query = query.populate(path, select);
    }

    return query.lean() as Promise<TReturn[]>;
  } 
}
