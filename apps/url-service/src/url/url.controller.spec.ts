jest.mock('nanoid', () => {
  return {
    customAlphabet: () => () => 'TESTCODE',
  };
});

import { Test, TestingModule } from '@nestjs/testing';
import { UrlController } from './url.controller';
import { UrlService } from './url.service';
import { ConfigService } from '@nestjs/config';
import { CreateUrlDto } from './dto/create-url.dto';
import { ShortUrl } from './entities/url.entity';

describe('UrlController', () => {
  let controller: UrlController;
  let urlService: jest.Mocked<UrlService>;
  let configService: jest.Mocked<ConfigService>;

  const mockUserId = 'user-123';
  const mockRequest = {
    user: { sub: mockUserId },
  } as any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UrlController],
      providers: [
        {
          provide: UrlService,
          useValue: {
            create: jest.fn(),
            findByUser: jest.fn(),
            updateOriginalUrl: jest.fn(),
            deleteUrl: jest.fn(),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<UrlController>(UrlController);
    urlService = module.get(UrlService);
    configService = module.get(ConfigService);
  });

  describe('create', () => {
    it('should create a short URL with optional userId', async () => {
      const dto: CreateUrlDto = { originalUrl: 'https://example.com' };
      const fakeShort: ShortUrl = {
        shortCode: 'abc123',
        originalUrl: dto.originalUrl,
        id: 'example',
        clickCount: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      urlService.create.mockResolvedValue(fakeShort);
      configService.get.mockReturnValue('http://localhost:3000');

      const result = await controller.create(dto, mockRequest);

      expect(result).toEqual({
        shortUrl: `http://localhost:3000/${fakeShort.shortCode}`,
        originalUrl: fakeShort.originalUrl,
      });

      expect(urlService.create).toHaveBeenCalledWith(dto, mockUserId);
    });
  });

  describe('listUserUrls', () => {
    it('should return all URLs by user', async () => {
      const urls: ShortUrl[] = [
        {
          shortCode: 'abc',
          originalUrl: 'url',
          id: 'example',
          clickCount: 0,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];
      urlService.findByUser.mockResolvedValue(urls);

      const result = await controller.listUserUrls(mockRequest);

      expect(result).toEqual({ data: urls });
      expect(urlService.findByUser).toHaveBeenCalledWith(mockUserId);
    });
  });

  describe('updateUrl', () => {
    it('should update the original URL', async () => {
      const dto = { originalUrl: 'https://new-url.com' };
      const urlId = 'url-123';

      await controller.updateUrl(urlId, dto, mockRequest);

      expect(urlService.updateOriginalUrl).toHaveBeenCalledWith(
        mockUserId,
        urlId,
        dto.originalUrl,
      );
    });
  });

  describe('deleteUrl', () => {
    it('should delete the URL', async () => {
      const urlId = 'url-456';

      await controller.deleteUrl(urlId, mockRequest);

      expect(urlService.deleteUrl).toHaveBeenCalledWith(mockUserId, urlId);
    });
  });
});
