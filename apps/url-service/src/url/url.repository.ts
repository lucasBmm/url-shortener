// src/url/url.repository.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';
import { BaseRepository } from 'src/db/base.repository';
import { ShortUrl } from './entities/url.entity';
import { IUrlRepository } from './url.repository.interface';
import { CreateUrlDto } from './dto/create-url.dto';
import { UpdateUrlDto } from './dto/update-url.dto';

@Injectable()
export class UrlRepository
  extends BaseRepository<ShortUrl, CreateUrlDto, UpdateUrlDto>
  implements IUrlRepository
{
  constructor(
    @InjectRepository(ShortUrl)
    repo: Repository<ShortUrl>,
  ) {
    super(repo);
  }

  findByShortCode(code: string): Promise<ShortUrl | null> {
    return this.repo.findOne({ where: { shortCode: code, deletedAt: null } });
  }

  findAllByUser(userId: string): Promise<ShortUrl[]> {
    return this.repo.find({
      where: {
        userId,
        deletedAt: null,
      },
      select: ['id', 'originalUrl', 'shortCode', 'clickCount', 'createdAt'],
      order: {
        createdAt: 'DESC',
      },
    });
  }

  findActiveById(id: string): Promise<ShortUrl | null> {
    return this.repo.findOne({
      where: { id, deletedAt: null },
    });
  }

  async updateOriginalUrl(id: string, newUrl: string): Promise<ShortUrl> {
    await this.repo.update(id, { originalUrl: newUrl });
    return this.repo.findOneOrFail({ where: { id } });
  }

  softDeleteById(id: string): Promise<UpdateResult> {
    return this.repo.softDelete(id);
  }
}
