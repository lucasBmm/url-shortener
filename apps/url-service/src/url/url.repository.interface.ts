import { IRepository } from 'src/db/repository.interface';
import { ShortUrl } from './entities/url.entity';
import { CreateShortUrlDto } from './dto/create-shorturl.dto';
import { UpdateResult } from 'typeorm';
import { UpdateShortUrlDto } from './dto/update-shorturl.dto';

export interface IUrlRepository
  extends IRepository<ShortUrl, CreateShortUrlDto, UpdateShortUrlDto> {
  findByShortCode(code: string): Promise<ShortUrl | null>;

  findByShortCode(code: string): Promise<ShortUrl | null>;

  findAllByUser(userId: string): Promise<ShortUrl[]>;

  findActiveById(id: string): Promise<ShortUrl | null>;

  updateOriginalUrl(id: string, newUrl: string): Promise<ShortUrl>;

  softDeleteById(id: string): Promise<UpdateResult>;
}
