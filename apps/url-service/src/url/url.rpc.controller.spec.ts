jest.mock('nanoid', () => {
  return {
    customAlphabet: () => () => 'TESTCODE',
  };
});

import { Test, TestingModule } from '@nestjs/testing';
import { UrlRpcController } from './url.rpc.controller';
import { UrlService } from './url.service';
import { ShortUrl } from './entities/url.entity';

describe('UrlRpcController', () => {
  let controller: UrlRpcController;
  let urlService: jest.Mocked<UrlService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UrlRpcController],
      providers: [
        {
          provide: UrlService,
          useValue: {
            findByShortUrl: jest.fn(),
            registerClick: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<UrlRpcController>(UrlRpcController);
    urlService = module.get(UrlService);
  });

  describe('resolve', () => {
    it('should call urlService.findByShortUrl with shortCode and return result', async () => {
      const shortCode = 'abc123';
      const expectedResult: ShortUrl = {
        id: '1',
        shortCode,
        originalUrl: 'https://example.com',
        clickCount: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      urlService.findByShortUrl.mockResolvedValue(expectedResult);

      const result = await controller.resolve(shortCode);

      expect(urlService.findByShortUrl).toHaveBeenCalledWith(shortCode);
      expect(result).toBe(expectedResult);
    });
  });

  describe('handleClick', () => {
    it('should call urlService.registerClick with shortCode and timestamp', async () => {
      const data = { shortCode: 'abc123', timestamp: 1234567890 };

      urlService.registerClick.mockResolvedValue(undefined);

      const result = await controller.handleClick(data);

      expect(urlService.registerClick).toHaveBeenCalledWith(
        data.shortCode,
        data.timestamp,
      );
      expect(result).toBeUndefined();
    });
  });
});
