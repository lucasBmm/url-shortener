import { ForbiddenException, Inject, Injectable } from '@nestjs/common';
import { IUrlRepository } from './url.repository.interface';
import { CreateUrlDto } from './dto/create-url.dto';
import { ShortUrl } from './entities/url.entity';
import { generateShortCode } from 'src/common/utils/shortcode.util';

@Injectable()
export class UrlService {
  constructor(
    @Inject('IUrlRepository')
    private readonly urlRepository: IUrlRepository,
  ) {}

  async create(dto: CreateUrlDto, userId?: string): Promise<ShortUrl> {
    let shortCode: string;
    let exists: ShortUrl | null;

    do {
      shortCode = generateShortCode();
      exists = await this.urlRepository.findByShortCode(shortCode);
    } while (exists);

    const newUrl = await this.urlRepository.create({
      originalUrl: dto.originalUrl,
      shortCode,
      userId: userId || null,
    });

    return newUrl;
  }

  findByUser(userId: string): Promise<ShortUrl[]> {
    return this.urlRepository.findAllByUser(userId);
  }

  async updateOriginalUrl(
    userId: string,
    urlId: string,
    newUrl: string,
  ): Promise<ShortUrl> {
    const url = await this.urlRepository.findActiveById(urlId);

    if (!url || url.userId !== userId) {
      throw new ForbiddenException(
        'User does not have permission to alter this url.',
      );
    }

    return this.urlRepository.updateOriginalUrl(urlId, newUrl);
  }

  async deleteUrl(userId: string, urlId: string): Promise<void> {
    const url = await this.urlRepository.findActiveById(urlId);

    if (!url || url.userId !== userId) {
      throw new ForbiddenException(
        'User does not have permission to delete url.',
      );
    }

    await this.urlRepository.softDeleteById(urlId);
  }
}
