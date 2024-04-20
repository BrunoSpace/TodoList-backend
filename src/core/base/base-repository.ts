import { NotFoundException } from '@nestjs/common';
import { Model, FilterQuery } from 'mongoose';

export interface IFindOneOptions<T> {
  criteria?: FilterQuery<T>;
  throwOnNotFound?: boolean;
  errorMessage?: string;
}

export abstract class BaseRepository<T> {
  constructor(private readonly model: Model<T>) {}

  public async findOne(options: IFindOneOptions<T>): Promise<T | null> {
    const { criteria, throwOnNotFound = false, errorMessage } = options;
    const record = await this.model.findOne(criteria).exec();

    if (!record && throwOnNotFound) {
      throw new NotFoundException(errorMessage);
    }

    return record;
  }
}
