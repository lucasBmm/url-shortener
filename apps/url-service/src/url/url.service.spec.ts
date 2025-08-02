jest.mock('nanoid', () => {
  return {
    customAlphabet: () => () => 'TESTCODE',
  };
});

import { Test, TestingModule } from '@nestjs/testing';
import { UrlService } from './url.service';
import { IUrlRepository } from './url.repository.interface';
import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { ShortUrl } from './entities/url.entity';
import { CreateUrlDto } from './dto/create-url.dto';

jest.mock('src/common/utils/shortcode.util', () => ({
  generateShortCode: jest.fn(() => 'mocked123'),
}));

import { generateShortCode } from 'src/common/utils/shortcode.util';

describe('UrlService', () => {
  let service: UrlService;
  let urlRepository: jest.Mocked<IUrlRepository>;

  const mockUrl: ShortUrl = {
    id: 'url-id',
    originalUrl: 'https://example.com',
    shortCode: 'abc123',
    clickCount: 5,
    createdAt: new Date(),
    updatedAt: new Date(),
    userId: 'user-id',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UrlService,
        {
          provide: 'IUrlRepository',
          useValue: {
            create: jest.fn(),
            findByShortCode: jest.fn(),
            findAllByUser: jest.fn(),
            findActiveById: jest.fn(),
            updateOriginalUrl: jest.fn(),
            update: jest.fn(),
            softDeleteById: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<UrlService>(UrlService);
    urlRepository = module.get('IUrlRepository');
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should generate unique shortCode and create a URL', async () => {
      const dto: CreateUrlDto = { originalUrl: 'https://example.com' };

      (generateShortCode as jest.Mock).mockReturnValueOnce('abc123');

      urlRepository.findByShortCode.mockResolvedValueOnce(null);
      urlRepository.create.mockResolvedValue(mockUrl);

      const result = await service.create(dto, 'user-id');

      expect(generateShortCode).toHaveBeenCalled();
      expect(urlRepository.findByShortCode).toHaveBeenCalledWith('abc123');
      expect(urlRepository.create).toHaveBeenCalledWith({
        originalUrl: dto.originalUrl,
        shortCode: 'abc123',
        userId: 'user-id',
      });
      expect(result).toEqual(mockUrl);
    });
  });

  describe('findByUser', () => {
    it('should return all urls for a user', async () => {
      urlRepository.findAllByUser.mockResolvedValue([mockUrl]);

      const result = await service.findByUser('user-id');

      expect(result).toEqual([mockUrl]);
    });
  });

  describe('findByShortUrl', () => {
    it('should return the url by short code', async () => {
      urlRepository.findByShortCode.mockResolvedValue(mockUrl);

      const result = await service.findByShortUrl('abc123');

      expect(result).toEqual(mockUrl);
    });
  });

  describe('updateOriginalUrl', () => {
    it('should update the original URL if user is owner', async () => {
      urlRepository.findActiveById.mockResolvedValue(mockUrl);
      urlRepository.updateOriginalUrl.mockResolvedValue({
        ...mockUrl,
        originalUrl: 'https://updated.com',
      });

      const result = await service.updateOriginalUrl(
        'user-id',
        'url-id',
        'https://updated.com',
      );

      expect(result.originalUrl).toBe('https://updated.com');
    });

    it('should throw ForbiddenException if user is not owner', async () => {
      urlRepository.findActiveById.mockResolvedValue({
        ...mockUrl,
        userId: 'other-user',
      });

      await expect(
        service.updateOriginalUrl('user-id', 'url-id', 'new-url'),
      ).rejects.toThrow(ForbiddenException);
    });
  });

  describe('registerClick', () => {
    it('should increment click count if short code exists', async () => {
      urlRepository.findByShortCode.mockResolvedValue(mockUrl);
      urlRepository.update.mockResolvedValue();

      await service.registerClick('abc123', Date.now());

      expect(urlRepository.update).toHaveBeenCalledWith(mockUrl.id, {
        clickCount: mockUrl.clickCount + 1,
      });
    });

    it('should throw NotFoundException if short code not found', async () => {
      urlRepository.findByShortCode.mockResolvedValue(null);

      await expect(
        service.registerClick('notfound', Date.now()),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('deleteUrl', () => {
    it('should soft delete URL if user is owner', async () => {
      urlRepository.findActiveById.mockResolvedValue(mockUrl);
      urlRepository.softDeleteById.mockResolvedValue(null);

      await service.deleteUrl('user-id', 'url-id');

      expect(urlRepository.softDeleteById).toHaveBeenCalledWith('url-id');
    });

    it('should throw ForbiddenException if user is not owner', async () => {
      urlRepository.findActiveById.mockResolvedValue({
        ...mockUrl,
        userId: 'other-user',
      });

      await expect(service.deleteUrl('user-id', 'url-id')).rejects.toThrow(
        ForbiddenException,
      );
    });
  });
});
