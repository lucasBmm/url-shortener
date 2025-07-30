import { Repository, DeepPartial } from 'typeorm';
import { IRepository } from './repository.interface';

export abstract class BaseRepository<
  T,
  C extends DeepPartial<T>,
  U extends DeepPartial<T>,
> implements IRepository<T, C, U>
{
  protected constructor(protected readonly repo: Repository<T>) {}

  async create(data: C): Promise<T> {
    const entity = this.repo.create(data);
    return this.repo.save(entity);
  }

  async findAll(): Promise<T[]> {
    return this.repo.find({ where: { deletedAt: null } as any });
  }

  async findOne(id: string): Promise<T | null> {
    return this.repo.findOne({ where: { id, deletedAt: null } as any });
  }

  async update(id: string, data: U): Promise<void> {
    await this.repo.update(id, data as any);
  }

  async remove(id: string): Promise<void> {
    await this.repo.softDelete(id as any);
  }
}
